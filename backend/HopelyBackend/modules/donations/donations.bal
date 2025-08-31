import ballerina/http;
import ballerinax/mongodb;
import ballerina/log;
import ballerina/os;

type Hospital readonly & record {|
    string _id?;
    string name?;
    string location?;
|};

type HospitalDoc record {|
    json _id?;
    string name?;
    string location?;
|};

// Bind to 8080 as your team uses
listener http:Listener apiListener = new (8080);

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
        allowMethods: ["GET", "OPTIONS"],
        allowHeaders: ["*"]
    }
}
service /api on apiListener {

    resource function get ping() returns string {
        return "pong";
    }

    resource function get hospitals() returns Hospital[]|http:InternalServerError {
        // ---- read env safely (avoid `?:` on string) ----
        string? envUri = os:getEnv("MONGODB_URI");
        string mongoUri = envUri is string ? envUri : "mongodb://localhost:27017";

        string? envDb = os:getEnv("DB_NAME");
        string dbName = envDb is string ? envDb : "hopely_db";

        string collName = "hospitals";
        // -----------------------------------------------

        log:printInfo("Hospitals API -> uri=" +
            (mongoUri.startsWith("mongodb+srv") ? "Atlas" : "Local") +
            " db=" + dbName + " col=" + collName);

        // 1) Mongo client
        mongodb:Client|mongodb:Error clientOrErr = new ({ connection: mongoUri });
        if clientOrErr is mongodb:Error {
            return { body: "DB client init failed: " + clientOrErr.message() };
        }
        mongodb:Client mongoClient = clientOrErr;

        // 2) Database
        mongodb:Database|mongodb:Error dbOrErr = mongoClient->getDatabase(dbName);
        if dbOrErr is mongodb:Error {
            // NOTE: intentionally not calling mongoClient->close() here to avoid compiler issues
            return { body: "DB open failed: " + dbOrErr.message() };
        }
        mongodb:Database db = dbOrErr;

        // 3) Collection
        mongodb:Collection|mongodb:Error colOrErr = db->getCollection(collName);
        if colOrErr is mongodb:Error {
            // NOTE: intentionally not calling mongoClient->close() here
            return { body: "Collection open failed: " + colOrErr.message() };
        }
        mongodb:Collection col = colOrErr;

        // 4) Query
        stream<HospitalDoc, error?>|mongodb:Error streamOrErr = col->find({}, {}, (), HospitalDoc);
        if streamOrErr is mongodb:Error {
            // NOTE: intentionally not calling mongoClient->close() here
            return { body: "Find failed: " + streamOrErr.message() };
        }
        stream<HospitalDoc, error?> docs = streamOrErr;

        Hospital[] out = [];
        error? consumeErr = from HospitalDoc d in docs
            do {
                string? idStr = ();
                json? mid = d?._id;

                if mid is map<json> {
                    json? oid = mid["$oid"];
                    idStr = oid is string ? oid : mid.toJsonString();
                } else if mid is string {
                    idStr = mid;
                }

                out.push({
                    _id: idStr,
                    name: d?.name,
                    location: d?.location
                });
            };

        // This is a normal function (not remote): must assign its return to avoid BCE2526
        error? streamCloseErr = docs.close();
        if streamCloseErr is error {
            log:printError("Stream close error: " + streamCloseErr.message());
        }

        // We skip mongoClient->close() to avoid the “action invocation as an expression”/assignment issues
        // in your compiler setup. This is OK for dev; we can reintroduce a proper shutdown later.

        if consumeErr is error {
            return { body: "Stream error: " + consumeErr.message() };
        }
        return out;
    }
}
