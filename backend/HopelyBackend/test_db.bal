import ballerina/io;
import ballerinax/mongodb;

public function testDbConnectionWithConfig(EnvConfig config) returns error? {
    io:println("🧪 Testing MongoDB Connection...");

    io:println("📡 Connecting to database: " + config.dbName);
    io:println("🔗 Connection URI: " + config.mongodbUri.substring(0, 20) + "...");

    // Create connection config
    mongodb:ConnectionConfig mongoConfig = {
        connection: config.mongodbUri
    };

    // Test connection with better error handling
    mongodb:Client|error mongoClientResult = new (mongoConfig);
    if mongoClientResult is error {
        io:println("❌ Failed to create MongoDB client:");
        io:println("   Error: " + mongoClientResult.message());
        io:println("   Details: " + mongoClientResult.detail().toString());
        return mongoClientResult;
    }

    mongodb:Client mongoClient = mongoClientResult;
    mongodb:Database|error databaseResult = mongoClient->getDatabase(config.dbName);
    if databaseResult is error {
        io:println("❌ Failed to get database:");
        io:println("   Error: " + databaseResult.message());
        check mongoClient->close();
        return databaseResult;
    }

    mongodb:Database database = databaseResult;

    // Test basic operation - list collections
    io:println("📋 Testing database access...");
    string[]|error collectionsResult = database->listCollectionNames();
    if collectionsResult is error {
        io:println("❌ Failed to list collections:");
        io:println("   Error: " + collectionsResult.message());
        check mongoClient->close();
        return collectionsResult;
    }

    string[] collections = collectionsResult;
    io:println("📄 Collections found: " + collections.length().toString());

    foreach string collection in collections {
        io:println("  - " + collection);
    }

    // Test creating a collection if none exist
    if collections.length() == 0 {
        io:println("🔨 Creating test collection 'users'...");
        mongodb:Collection|error userCollectionResult = database->getCollection("users");
        if userCollectionResult is error {
            io:println("❌ Failed to create collection:");
            io:println("   Error: " + userCollectionResult.message());
            check mongoClient->close();
            return userCollectionResult;
        }
        io:println("✅ Collection 'users' ready for use");
    }

    // Close connection
    check mongoClient->close();

    io:println("✅ Database connection test successful!");
    io:println("🎉 Your MongoDB Atlas setup is working correctly!");
}

// Keep the old function for backward compatibility
public function testDbConnection() returns error? {
    EnvConfig config = {
        mongodbUri: "mongodb://localhost:27017",
        dbName: "hopely_db",
        jwtSecret: "default-secret",
        port: "8080",
        environment: "development"
    };
    return testDbConnectionWithConfig(config);
}
