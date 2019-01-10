package com.prystupa;

import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.User;
import io.vertx.ext.stomp.Destination;
import io.vertx.ext.stomp.Frame;
import io.vertx.ext.stomp.StompServerConnection;
import io.vertx.ext.stomp.impl.Topic;
import io.vertx.rabbitmq.RabbitMQClient;
import io.vertx.rabbitmq.RabbitMQConsumer;
import io.vertx.rabbitmq.RabbitMQOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RabbitDestination extends Topic {
    private static Logger logger = LoggerFactory.getLogger(RabbitDestination.class);
    private static Pattern destinationPattern = Pattern.compile("/exchange/(?<exchange>.+)/(?<pattern>.+)");
    private final RabbitMQClient client;
    private final String exchange;
    private final String pattern;

    static Destination factory(Vertx vertx, String name) {
        Matcher matcher = destinationPattern.matcher(name);
        if (!matcher.matches()) {
            logger.error("Invalid destination", name);
            return null;
        }

        String exchange = matcher.group("exchange");
        String pattern = matcher.group("pattern");
        return new RabbitDestination(vertx, name, exchange, pattern);
    }

    private RabbitDestination(Vertx vertx, String name, String exchange, String pattern) {
        super(vertx, name);
        this.exchange = exchange;
        this.pattern = pattern;

        logger.debug("Creating RabbitMQ destination");

        RabbitMQOptions options = new RabbitMQOptions().setUri("amqp://message-bus");
        client = RabbitMQClient.create(vertx, options);

        startRabbitMqClient()
                .compose(v -> declareQueue())
                .compose(queueName -> bindQueue(queueName)
                        .compose(v -> setupConsumer(queueName)))
                .setHandler(result -> {
                    if (result.failed()) {
                        logger.error("Something went wrong with RabbitMQ: {}", result.cause());
                    } else {
                        logger.debug("All went well with RabbitMQ.");
                    }
                });
    }

    @Override
    public String destination() {
        return "<<rabbitmq2>>";
    }

    @Override
    public synchronized Destination subscribe(StompServerConnection connection, Frame frame) {
        User user = connection.handler().getUserBySession(connection.session());
        String userId = user.principal().getString("user");

        logger.debug("Handling Subscribe frame to {} for {}...", frame.getDestination(), userId);

        super.subscribe(connection, frame);
        return this;
    }

    private Future<Void> startRabbitMqClient() {
        Future<Void> clientStarted = Future.future();
        client.start(clientStarted);
        return clientStarted.compose(v -> {
            logger.debug("Successfully started RabbitMQ client.");
            return clientStarted;
        });
    }

    private Future<String> declareQueue() {
        Future<JsonObject> queueDeclared = Future.future();
        String queueName = "push-service-" + UUID.randomUUID();
        client.queueDeclare(queueName, false, true, true, queueDeclared);
        return queueDeclared.compose(json -> {
            logger.debug("Succeeded in declaring a queue: {} for {}", queueName);
            return queueDeclared.map(queueName);
        });
    }

    private Future<Void> bindQueue(String queueName) {
        Future<Void> queueBound = Future.future();
        client.queueBind(queueName, exchange, pattern, queueBound);
        return queueBound.compose(v -> {
            logger.debug("Succeeded in binding queue {} to {}/{}", queueName, exchange, pattern);
            return queueBound;
        });
    }

    private Future<RabbitMQConsumer> setupConsumer(String queueName) {
        Future<RabbitMQConsumer> consumerSetup = Future.future();
        client.basicConsumer(queueName, consumerSetup);
        return consumerSetup.compose(consumer -> {
            consumer.handler(message -> {
                logger.debug("Message arrived, dispatching: {}", message.body().toString());
                dispatch(null, new Frame().setBody(message.body()));
            });

            logger.debug("Setup consumer {} for {}", consumer.consumerTag(), queueName);
            return consumerSetup;
        });
    }
}
