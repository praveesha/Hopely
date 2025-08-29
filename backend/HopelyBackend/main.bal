import ballerina/http;
import ballerina/io;
import ballerina/time;
import ballerina/uuid;

public function main() returns error? {
    io:println("🚀 Starting Hopely Backend...");

    // Load configuration from .env file
    EnvConfig config = check parseEnvFile();

    io:println("🔍 Configuration loaded:");
    io:println("  📡 MongoDB URI: " + (config.mongodbUri.startsWith("mongodb+srv") ? "Atlas Cloud" : "Local"));
    io:println("  📄 Database: " + config.dbName);
    io:println("  🌍 Environment: " + config.environment);
    io:println("  🔌 Port: " + config.port);

    io:println("✅ Configuration loaded successfully!");

    // Test database connection
    io:println("🧪 Running database connection test...");
    error? testResult = testDbConnectionWithConfig(config);
    if testResult is error {
        io:println("❌ Database test failed: " + testResult.message());
        io:println("💡 Make sure your MongoDB Atlas cluster is running and accessible");
        return;
    }

    // Test User CRUD operations
    io:println("👥 Testing User CRUD operations...");
    error? userTestResult = testUserOperations(config);
    if userTestResult is error {
        io:println("❌ User operations test failed: " + userTestResult.message());
        return;
    }

    io:println("🎉 Hopely Backend is ready!");

    // Start HTTP server to keep the backend running
    io:println("🌐 Starting HTTP server on port 8080...");
    io:println("🔗 Visit: http://localhost:8080/api/health to check status");
    io:println("⏹️  Press Ctrl+C to stop the server");
}

// Simple health check service to keep the server running
service /api on new http:Listener(8080) {

    // CORS configuration
    resource function options .(http:Caller caller) returns error? {
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        check caller->respond(response);
    }

    resource function get health() returns json {
        return {
            "status": "healthy",
            "message": "Hopely Backend is running!",
            "timestamp": time:utcToString(time:utcNow())
        };
    }

    resource function get info() returns json {
        return {
            "name": "Hopely Medical Donation System",
            "version": "1.0.0",
            "description": "Government medical donation platform for Sri Lanka"
        };
    }
}

function testUserOperations(EnvConfig config) returns error? {
    string timestamp = time:utcToString(time:utcNow());

    // Create a test user
    User testUser = {
        id: uuid:createType4AsString(),
        email: "admin@hopely.gov.lk",
        passwordHash: "$2b$10$hashedpassword123", // This would be properly hashed in real implementation
        role: ADMIN,
        firstName: "System",
        lastName: "Administrator",
        phoneNumber: "+94123456789",
        hospitalName: (),
        hospitalAddress: (),
        hospitalLicense: (),
        hospitalStatus: (),
        createdAt: timestamp,
        updatedAt: timestamp
    };

    // Test creating user
    string|error createResult = createUser(config, testUser);
    if createResult is error {
        io:println("❌ Create user failed: " + createResult.message());
        return createResult;
    }
    io:println("✅ Created user with ID: " + createResult);

    // Test finding user
    User|error foundUser = getUserByEmail(config, testUser.email);
    if foundUser is error {
        io:println("❌ Get user failed: " + foundUser.message());
        return foundUser;
    }
    io:println("✅ Found user: " + foundUser.firstName + " " + foundUser.lastName);

    io:println("🎯 All user operations completed successfully!");
}

