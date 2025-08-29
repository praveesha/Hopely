import ballerina/http;
import ballerinax/mongodb;

service /medicineShortages on new http:Listener(9090) {

    // MongoDB client
    final mongodb:Client mongoClient = check new ("mongodb+srv://<username>:<password>@cluster0.wlzhoek.mongodb.net/hopely_db");

    resource function get .() returns json|error {
        // Connect to database + collection
        mongodb:Database db = mongoClient->getDatabase("hopely_db");
        mongodb:Collection collection = db.getCollection("medicine_shortages");

        // Find all documents
        stream<json, error?> resultStream = collection->find({});
        json[] results = [];

        // Iterate through results
        check from json doc in resultStream
            do {
                results.push(doc);
            };

        return results;
    }
}
