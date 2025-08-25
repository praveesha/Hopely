import ballerina/log;
import ballerina/os;
import ballerinax/mongodb;

// Simple functions without persistent connections to avoid casting issues

// Test database connection
public function testConnection() returns boolean {
    string mongoUri = os:getEnv("MONGODB_URI") != "" ? <string>os:getEnv("MONGODB_URI") : "mongodb://localhost:27017";
    string dbName = os:getEnv("DB_NAME") != "" ? <string>os:getEnv("DB_NAME") : "hopely_db";

    mongodb:ConnectionConfig config = {
        connection: mongoUri
    };

    mongodb:Client|mongodb:Error mongoResult = new (config);

    if mongoResult is mongodb:Error {
        log:printError("Failed to connect to MongoDB", mongoResult);
        return false;
    }

    // Test connection by getting database
    mongodb:Database|mongodb:Error dbResult = mongoResult->getDatabase(dbName);

    if dbResult is mongodb:Error {
        log:printError("Failed to get database", dbResult);
        error? closeErr = mongoResult->close();
        return false;
    }

    // Close connection
    error? closeErr = mongoResult->close();
    log:printInfo("✅ Successfully tested MongoDB connection!");
    return true;
}

// Create a client for operations (caller responsible for closing)
public function createClient() returns mongodb:Client|error {
    string mongoUri = os:getEnv("MONGODB_URI") != "" ? <string>os:getEnv("MONGODB_URI") : "mongodb://localhost:27017";

    mongodb:ConnectionConfig config = {
        connection: mongoUri
    };

    mongodb:Client|mongodb:Error result = new (config);

    if result is mongodb:Error {
        log:printError("Failed to create MongoDB client", result);
        return result;
    }

    return result;
}
