package com.prystupa;


import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.ext.stomp.StompServer;
import io.vertx.ext.stomp.StompServerHandler;
import io.vertx.ext.stomp.StompServerOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PushService extends AbstractVerticle {
    private static Logger logger = LoggerFactory.getLogger(PushService.class);

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        logger.info("Starting push service");

        Connection rabbitConnection = connectToRabbit();

        StompServerOptions stompServerOptions = new StompServerOptions()
                .setPort(-1)
                .setSecured(true)
                .setWebsocketBridge(true)
                .setWebsocketPath("/ws");
        StompServer stompServer = StompServer.create(vertx, stompServerOptions)
                .handler(StompServerHandler.create(vertx)
                        .destinationFactory((vertx, name) -> RabbitDestination.factory(vertx, name, rabbitConnection))
                        .authProvider(new OktaAuthProvider())
                        .connectHandler(new OktaConnectHandler()));

        HttpServerOptions httpServerOptions = new HttpServerOptions()
                .setWebsocketSubProtocols("v10.stomp, v11.stomp, v12.stomp");
        vertx.createHttpServer(httpServerOptions)
                .websocketHandler(stompServer.webSocketHandler())
                .listen(8083, startFuture.mapEmpty());
    }

    private Connection connectToRabbit() throws Exception {
        ConnectionFactory connectionFactory = new ConnectionFactory();
        connectionFactory.setUri("amqp://message-bus");
        return connectionFactory.newConnection();
    }
}
