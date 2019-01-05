package com.prystupa;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AbstractUser;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OktaAuthProvider implements AuthProvider {
    private static Logger logger = LoggerFactory.getLogger(OktaAuthProvider.class);

    @Override
    public void authenticate(JsonObject authInfo, Handler<AsyncResult<User>> resultHandler) {
        logger.debug("Authenticating: " + authInfo + ".");

        resultHandler.handle(Future.succeededFuture(new AbstractUser() {
            @Override
            protected void doIsPermitted(String permission, Handler<AsyncResult<Boolean>> resultHandler) {
                resultHandler.handle(Future.succeededFuture(true));
            }

            @Override
            public JsonObject principal() {
                String user = authInfo.getString("username");
                return new JsonObject().put("user", user);
            }

            @Override
            public void setAuthProvider(AuthProvider authProvider) {
                // nothing to do
            }
        }));
    }
}
