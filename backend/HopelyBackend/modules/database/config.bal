import ballerina/os;

// Database configuration using environment variables
public type DatabaseConfig record {
    string connectionUri;
    string databaseName;
};

public final DatabaseConfig dbConfig = {
    connectionUri: os:getEnv("MONGODB_URI") != "" ? <string>os:getEnv("MONGODB_URI") : "mongodb://localhost:27017",
    databaseName: os:getEnv("DB_NAME") != "" ? <string>os:getEnv("DB_NAME") : "hopely_db"
};

public const string USERS_COLLECTION = "users";
public const string DONATIONS_COLLECTION = "donations";
public const string MEDICINE_REQUESTS_COLLECTION = "medicine_requests";
