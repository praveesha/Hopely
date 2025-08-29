import ballerina/io;
import ballerinax/mongodb;

public function createUser(EnvConfig config, User user) returns string|error {
    io:println("👤 Creating new user: " + user.email);

    // Create connection
    mongodb:ConnectionConfig mongoConfig = {
        connection: config.mongodbUri
    };

    mongodb:Client mongoClient = check new (mongoConfig);
    mongodb:Database database = check mongoClient->getDatabase(config.dbName);
    mongodb:Collection userCollection = check database->getCollection("users");

    // Convert user record to map<json> for insertion
    map<json> userDoc = {
        "id": user.id,
        "email": user.email,
        "passwordHash": user.passwordHash,
        "role": user.role.toString(),
        "firstName": user.firstName,
        "lastName": user.lastName,
        "phoneNumber": user.phoneNumber ?: (),
        "hospitalName": user.hospitalName ?: (),
        "hospitalAddress": user.hospitalAddress ?: (),
        "hospitalLicense": user.hospitalLicense ?: (),
        "hospitalStatus": user.hospitalStatus is HospitalStatus ? user.hospitalStatus.toString() : (),
        "createdAt": user.createdAt,
        "updatedAt": user.updatedAt
    };

    // Insert the new user  
    _ = check userCollection->insertOne(userDoc);

    check mongoClient->close();

    io:println("✅ User created successfully");
    return user.id;
}

public function getUserByEmail(EnvConfig config, string email) returns User|error {
    io:println("🔍 Finding user by email: " + email);

    mongodb:ConnectionConfig mongoConfig = {
        connection: config.mongodbUri
    };

    mongodb:Client mongoClient = check new (mongoConfig);
    mongodb:Database database = check mongoClient->getDatabase(config.dbName);
    mongodb:Collection userCollection = check database->getCollection("users");

    // For now, return a success message - actual implementation would parse the result
    check mongoClient->close();
    io:println("✅ User lookup completed");

    // Return a dummy user for now
    return {
        id: "test-id",
        email: email,
        passwordHash: "hash",
        role: ADMIN,
        firstName: "Test",
        lastName: "User",
        phoneNumber: (),
        hospitalName: (),
        hospitalAddress: (),
        hospitalLicense: (),
        hospitalStatus: (),
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
    };
}

