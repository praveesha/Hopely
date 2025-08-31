import ballerina/http;

// One listener on port 8080 for ALL /api routes
public listener http:Listener apiListener = new (8080);
