package com.prystupa;

import io.vertx.core.Vertx;
import io.vertx.ext.auth.User;
import io.vertx.ext.stomp.Destination;
import io.vertx.ext.stomp.Frame;
import io.vertx.ext.stomp.StompServerConnection;
import io.vertx.ext.stomp.impl.Topic;
import io.vertx.rabbitmq.RabbitMQClient;
import io.vertx.rabbitmq.RabbitMQOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RabbitDestination extends Topic {
    private static Logger logger = LoggerFactory.getLogger(RabbitDestination.class);

    static Destination factory(Vertx vertx, String name) {
        return new RabbitDestination(vertx);
    }

    private RabbitDestination(Vertx vertx) {
        super(vertx, null);

        logger.debug("Creating RabbitMQ destination");

        RabbitMQOptions options = new RabbitMQOptions().setUri("amqp://message-bus");
        RabbitMQClient.create(vertx, options);
    }

    @Override
    public String destination() {
        return "<<rabbitmq>>";
    }

    @Override
    public synchronized Destination subscribe(StompServerConnection connection, Frame frame) {
        User user = connection.handler().getUserBySession(connection.session());
        logger.debug("Accepting RabbitMQ destination subscription for user: " + user.principal().getString("user"));

        return this;
    }
}
