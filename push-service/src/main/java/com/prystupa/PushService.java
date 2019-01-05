package com.prystupa;


import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.ext.stomp.StompServer;
import io.vertx.ext.stomp.StompServerHandler;
import io.vertx.ext.stomp.StompServerOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class PushService extends AbstractVerticle {
    private static Logger logger = LoggerFactory.getLogger(PushService.class);

    @Override
    public void start(Future<Void> startFuture) throws IOException {
        logger.info("Starting push service");

        StompServerOptions stompServerOptions = new StompServerOptions()
                .setPort(-1)
                .setSecured(true)
                .setWebsocketBridge(true)
                .setWebsocketPath("/ws");
        StompServer stompServer = StompServer.create(vertx, stompServerOptions)
                .handler(StompServerHandler.create(vertx)
                        .destinationFactory(RabbitDestination::factory)
                        .authProvider(new OktaAuthProvider())
                        .connectHandler(new OktaConnectHandler()));

        HttpServerOptions httpServerOptions = new HttpServerOptions()
                .setWebsocketSubProtocols("v10.stomp, v11.stomp, v12.stomp");
        vertx.createHttpServer(httpServerOptions)
                .websocketHandler(stompServer.webSocketHandler())
                .listen(8083, result -> {
                    if (result.succeeded()) {
                        logger.info("Started websocket STOMP server");
                        startFuture.complete();
                    } else {
                        startFuture.fail(result.cause());
                    }
                });
    }
}
