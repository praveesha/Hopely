// modules/database/connection.bal - Simplified Database connection utilities
import ballerina/log;
import ballerinax/mongodb;

// Simple MongoDB connection functions without global state
// This avoids the complex client casting issues

// Initialize and test MongoDB connection
public function testDatabaseConnection(string connectionUri, string databaseName) returns boolean {
    mongodb:ConnectionConfig config = {
        connection: connectionUri
    };
    mongodb:Client|mongodb:Error mongoResult = new (config);
    if mongoResult is mongodb:Error {
        log:printError("Failed to connect to MongoDB Atlas", mongoResult);
        return false;
    }
    // Test connection by getting database
    mongodb:Database|mongodb:Error dbResult = mongoResult->getDatabase(databaseName);
    if dbResult is mongodb:Error {
        log:printError("Failed to get database", dbResult);
        error? closeResult = mongoResult->close();
        return false;
    }
    // Try to list collections as a connection test
    string[]|mongodb:Error collections = dbResult->listCollectionNames();
    // Close connection
    error? closeResult = mongoResult->close();
    if collections is mongodb:Error {
        log:printError("Failed to list collections", collections);
        return false;
    }
    log:printInfo("Successfully connected to MongoDB Atlas");
    return true;
}

// Create a new MongoDB client (to be used per operation)
public function createClient(string connectionUri) returns mongodb:Client|error {
    mongodb:ConnectionConfig config = {
        connection: connectionUri
    };
    mongodb:Client|mongodb:Error result = new (config);
    if result is mongodb:Error {
        log:printError("Failed to create MongoDB client", result);
        return result;
    }
    return result;
}
