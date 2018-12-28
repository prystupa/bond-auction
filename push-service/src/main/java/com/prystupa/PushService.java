package com.prystupa;


import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;

public class PushService extends AbstractVerticle {
    @Override
    public void start(Future<Void> startFuture) {

        vertx.createHttpServer()
                .requestHandler(r -> r.response().end("Hello from Vert.x!"))
                .listen(8080, result -> {
                    if (result.succeeded()) {
                        startFuture.complete();
                    } else {
                        startFuture.fail(result.cause());
                    }
                });
    }
}
