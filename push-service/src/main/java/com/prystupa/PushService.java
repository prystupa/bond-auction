package com.prystupa;


import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.ext.stomp.StompServer;
import io.vertx.ext.stomp.StompServerHandler;
import io.vertx.ext.stomp.StompServerOptions;

public class PushService extends AbstractVerticle {
    @Override
    public void start(Future<Void> startFuture) {

        StompServerOptions stompServerOptions = new StompServerOptions()
                .setPort(-1)
                .setWebsocketBridge(true)
                .setWebsocketPath("/ws");
        StompServer stompServer = StompServer.create(vertx, stompServerOptions)
                .handler(StompServerHandler.create(vertx));

        HttpServerOptions httpServerOptions = new HttpServerOptions()
                .setWebsocketSubProtocols("v10.stomp, v11.stomp, v12.stomp");
        vertx.createHttpServer(httpServerOptions)
                .websocketHandler(stompServer.webSocketHandler())
                .listen(8083, result -> {
                    if (result.succeeded()) {
                        startFuture.complete();
                    } else {
                        startFuture.fail(result.cause());
                    }
                });
    }
}
