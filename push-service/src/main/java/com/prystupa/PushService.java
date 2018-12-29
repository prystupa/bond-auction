package com.prystupa;


import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.ext.stomp.StompServer;
import io.vertx.ext.stomp.StompServerHandler;
import io.vertx.ext.stomp.StompServerOptions;

public class PushService extends AbstractVerticle {
    @Override
    public void start(Future<Void> startFuture) {

        StompServer stompServer = StompServer.create(vertx, new StompServerOptions()
                .setPort(-1)
                .setWebsocketBridge(true)
                .setWebsocketPath("/ws")
        ).handler(StompServerHandler.create(vertx));

        vertx.createHttpServer()
                .websocketHandler(stompServer.webSocketHandler())
                .listen(8089, result -> {
                    if (result.succeeded()) {
                        startFuture.complete();
                    } else {
                        startFuture.fail(result.cause());
                    }
                });
    }
}
