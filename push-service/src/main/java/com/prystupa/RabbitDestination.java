package com.prystupa;

import com.rabbitmq.client.*;
import io.reactivex.Observable;
import io.reactivex.disposables.Disposable;
import io.reactivex.subjects.PublishSubject;
import io.reactivex.subjects.Subject;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.User;
import io.vertx.ext.stomp.Destination;
import io.vertx.ext.stomp.Frame;
import io.vertx.ext.stomp.StompServerConnection;
import io.vertx.ext.stomp.impl.Topic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class RabbitDestination extends Topic {
    private static Logger logger = LoggerFactory.getLogger(RabbitDestination.class);
    private static Pattern destinationPattern = Pattern.compile("/exchange/(?<exchange>.+)/(?<pattern>.+)");
    private final List<RxSubscription> subscriptions = new ArrayList<>();
    private final Observable<byte[]> messages;

    static Destination factory(Vertx vertx, String name, Connection rabbitConnection) {
        logger.debug("Creating destination for {}", name);

        Matcher matcher = destinationPattern.matcher(name);
        if (!matcher.matches()) {
            logger.error("Invalid destination", name);
            return null;
        }

        try {
            String exchange = matcher.group("exchange");
            String pattern = matcher.group("pattern");
            Subject<byte[]> messages = PublishSubject.create();

            Channel channel = rabbitConnection.createChannel();
            String queue = "push-service-" + UUID.randomUUID();
            channel.queueDeclare(queue, false, true, true, Collections.emptyMap());
            channel.queueBind(queue, exchange, pattern);
            channel.basicConsume(queue, true, new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) {
                    logger.debug("Received Rabbit message: {}", new String(body));
                    messages.onNext(body);
                }

                @Override
                public void handleShutdownSignal(String consumerTag, ShutdownSignalException sig) {
                    logger.error("Received Rabbit shutdown signal");
                    messages.onError(sig);
                }
            });

            return new RabbitDestination(vertx, name, messages);
        } catch (Exception e) {
            logger.error("Something went wrong when setting up destination", e);
            return null;
        }
    }

    private RabbitDestination(Vertx vertx, String destination, Observable<byte[]> messages) {
        super(vertx, destination);

        this.messages = messages;
    }

    @Override
    public String destination() {
        return "<<rabbitmq2>>";
    }

    @Override
    public synchronized Destination subscribe(StompServerConnection connection, Frame frame) {
        logger.debug("Handling new subscription, have {} subscriptions before adding this one", subscriptions.size());

        User user = connection.handler().getUserBySession(connection.session());
        String userId = user.principal().getString("user");
        Set<String> userTokens = getUserViewEntitlements(userId);

        logger.debug("Handling Subscribe frame to {} for {}...", frame.getDestination(), userId);

        Disposable disposable = messages
                .filter(message -> checkMessageEntitlements(message, userTokens))
                .subscribe(message -> {
                    logger.debug("Message arrived, dispatching to {}: {}", userId, new String(message));

                    Frame stompFrame = transform(
                            new Frame().setBody(Buffer.buffer(message)),
                            new StompSubscription(connection, frame),
                            UUID.randomUUID().toString());
                    connection.write(stompFrame);
                }, error -> {
                    connection.write(new Frame(Frame.Command.ERROR, Collections.emptyMap(), Buffer.buffer()));
                    connection.close();
                });

        subscriptions.add(new RxSubscription(connection, frame, userId, disposable));
        super.subscribe(connection, frame);
        logger.debug("Added new subscription, now have {}", subscriptions.size());
        return this;
    }

    private boolean checkMessageEntitlements(byte[] message, Set<String> userTokens) {

        JsonObject node = new JsonObject(Buffer.buffer(message));
        Set<String> viewTokens = node.getJsonObject("entitlements").getJsonArray("view")
                .stream()
                .map(Object::toString)
                .collect(Collectors.toSet());

        return userTokens.stream().anyMatch(viewTokens::contains);
    }

    @Override
    public synchronized boolean unsubscribe(StompServerConnection connection, Frame frame) {

        for (RxSubscription subscription : subscriptions) {
            if (subscription.connection.equals(connection) && subscription.id.equals(frame.getId())) {
                logger.debug("Disposing of subscription {} for {}", subscription.id, subscription.userId);
                subscription.disposable.dispose();
                subscriptions.remove(subscription);
                break;
            }
        }
        return super.unsubscribe(connection, frame);
    }

    @Override
    public synchronized Destination unsubscribeConnection(StompServerConnection connection) {
        new ArrayList<>(subscriptions).stream()
                .filter(subscription -> subscription.connection.equals(connection))
                .forEach(subscription -> {
                    logger.debug("Disposing of subscription {} for {}", subscription.id, subscription.userId);
                    subscription.disposable.dispose();
                    subscriptions.remove(subscription);
                });
        return super.unsubscribeConnection(connection);
    }

    private static class StompSubscription extends Subscription {
        StompSubscription(StompServerConnection connection, Frame frame) {
            super(connection, frame);
        }
    }

    private Set<String> getUserViewEntitlements(String userId) {
        String[] parts = userId.split("@");
        return Stream.concat(Stream.concat(
                Stream.of("id:" + userId),
                Arrays.stream(parts[0].split("\\.")).map(name -> "name:" + name)),
                Arrays.stream(parts[1].split("\\.")).map(domain -> "domain:" + domain))
                .collect(Collectors.toSet());
    }

    private static class RxSubscription {
        StompServerConnection connection;
        String id;
        String userId;
        Disposable disposable;

        RxSubscription(StompServerConnection connection, Frame frame, String userId, Disposable disposable) {
            this.connection = connection;
            this.id = frame.getId();
            this.userId = userId;
            this.disposable = disposable;
        }
    }
}
