package com.prystupa;

import com.okta.jwt.JoseException;
import com.okta.jwt.Jwt;
import com.okta.jwt.JwtHelper;
import com.okta.jwt.JwtVerifier;
import io.vertx.ext.stomp.DefaultConnectHandler;
import io.vertx.ext.stomp.Frame;
import io.vertx.ext.stomp.ServerFrame;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

public class OktaConnectHandler extends DefaultConnectHandler {
    private JwtVerifier verifier;

    OktaConnectHandler() throws IOException {

        String orgUrl = System.getenv("APP_OKTA_ORG_URL");

        verifier = new JwtHelper()
                .setIssuerUrl(orgUrl + "/oauth2/default")
                .setAudience("api://default")
                .build();

    }

    @Override
    public void handle(ServerFrame sf) {

        String authHeader = sf.frame().getHeader("Authorization");
        String jwtString = authHeader.replaceFirst("^Bearer ", "");

        try {
            Jwt jwt = verifier.decodeAccessToken(jwtString);
            String user = jwt.getClaims().get("sub").toString();

            Map<String, String> headers = sf.frame().getHeaders().entrySet().stream()
                    .filter(e -> e.getKey().equals(Frame.LOGIN))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            headers.put(Frame.LOGIN, user);
            sf.frame().setHeaders(headers);

            super.handle(sf);
        } catch (JoseException e) {
            sf.connection().close();
        }
    }
}
