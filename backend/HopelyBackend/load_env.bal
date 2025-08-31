import ballerina/io;

public type EnvConfig record {
    string mongodbUri;
    string dbName;
    string jwtSecret;
    string port;
    string environment;
};

public function parseEnvFile() returns EnvConfig|error {
    string envContent = check io:fileReadString(".env");

    EnvConfig config = {
        mongodbUri: "mongodb://localhost:27017",
        dbName: "hopely_db",
        jwtSecret: "default-secret",
        port: "8080",
        environment: "development"
    };

    // Split by newlines manually
    int i = 0;
    string currentLine = "";

    while i < envContent.length() {
        string char = envContent.substring(i, i + 1);

        if char == "\n" || char == "\r" {
            // Process the line
            if currentLine.trim().length() > 0 && !currentLine.trim().startsWith("#") {
                // Find the = sign
                int equalIndex = -1;
                int j = 0;
                while j < currentLine.length() {
                    if currentLine.substring(j, j + 1) == "=" {
                        equalIndex = j;
                        break;
                    }
                    j += 1;
                }

                if equalIndex > 0 {
                    string key = currentLine.substring(0, equalIndex).trim();
                    string value = currentLine.substring(equalIndex + 1).trim();

                    // Remove quotes
                    if value.startsWith("\"") && value.endsWith("\"") {
                        value = value.substring(1, value.length() - 1);
                    }

                    // Map to config
                    if key == "MONGODB_URI" {
                        config.mongodbUri = value;
                    } else if key == "DB_NAME" {
                        config.dbName = value;
                    } else if key == "JWT_SECRET" {
                        config.jwtSecret = value;
                    } else if key == "PORT" {
                        config.port = value;
                    } else if key == "ENVIRONMENT" {
                        config.environment = value;
                    }
                }
            }
            currentLine = "";
        } else {
            currentLine += char;
        }

        i += 1;
    }

    // Process the last line if it doesn't end with newline
    if currentLine.trim().length() > 0 && !currentLine.trim().startsWith("#") {
        int equalIndex = -1;
        int j = 0;
        while j < currentLine.length() {
            if currentLine.substring(j, j + 1) == "=" {
                equalIndex = j;
                break;
            }
            j += 1;
        }

        if equalIndex > 0 {
            string key = currentLine.substring(0, equalIndex).trim();
            string value = currentLine.substring(equalIndex + 1).trim();

            if value.startsWith("\"") && value.endsWith("\"") {
                value = value.substring(1, value.length() - 1);
            }

            if key == "MONGODB_URI" {
                config.mongodbUri = value;
            } else if key == "DB_NAME" {
                config.dbName = value;
            } else if key == "JWT_SECRET" {
                config.jwtSecret = value;
            } else if key == "PORT" {
                config.port = value;
            } else if key == "ENVIRONMENT" {
                config.environment = value;
            }
        }
    }

    return config;
}
