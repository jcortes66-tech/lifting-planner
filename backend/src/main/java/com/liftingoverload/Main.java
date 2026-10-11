package com.liftingoverload;

import io.javalin.Javalin;

public class Main {
    public static void main(String[] args) {
        Javalin app = Javalin.create().start(8080);

        app.get("/api/test", ctx -> {
            ctx.json(java.util.Map.of("message", "Hello from the Java backend"));
        });
    }
}