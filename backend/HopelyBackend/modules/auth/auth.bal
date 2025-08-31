import ballerina/http;
import praveesha/HopelyBackend.database as database;
import ballerina/log;
import ballerinax/mongodb;

// Global client, initialized ONCE
final mongodb:Client mongoClient = check new({
    connection: "mongodb+srv://pravee:pravee@cluster0.wlzhoek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
});

// Document fetch helper
public function getDocument(string collectionName, map<json> filter) returns json|error {
    mongodb:Database db = check mongoClient->getDatabase("hopely_db");
    mongodb:Collection collection = check db->getCollection(collectionName);
    return collection->findOne(filter);
}

// ===== Local helpers =====

function makeResponse(boolean success, string message, json data, int status,
                      http:Cookie? cookie = ()) returns http:Response {
    http:Response res = new;
    res.statusCode = status;
    res.setJsonPayload({ success, message, data });
    if cookie is http:Cookie {
        res.addCookie(cookie);
    }
    return res;
}

// Request payload coming from the frontend
public type UserLogin record {|
    string email;
    string password;
|};

// ===== Login =====

public function login(UserLogin user) returns http:Response|error {
    // 1) Look up user by email via your database module
    var result = database:getDocument("users", { "email": user.email });
    if result is error {
        return makeResponse(false, result.message(), {}, http:STATUS_INTERNAL_SERVER_ERROR);
    } else if result is () {
        // Don't reveal which field is wrong
        return makeResponse(false, "Invalid email or password.", {}, http:STATUS_UNAUTHORIZED);
    }

    // From here, we have a json document
    json doc = <json>result;

    // 2) Read password fields with safe narrowing (handles json|error)
    var pwdNode = doc?.password;        // json|error
    string? storedPlain = pwdNode is string ? pwdNode : ();

    var hashNode = doc?.passwordHash;   // json|error
    string? storedHash = hashNode is string ? hashNode : ();

    boolean ok = false;
    if storedPlain is string {
        ok = (storedPlain == user.password);
    } else if storedHash is string {
        // TODO: replace with your bcrypt verify, e.g. common:verifyPassword(user.password, storedHash)
        ok = false; // keep false until you wire the real verifier
    }

    if !ok {
        return makeResponse(false, "Invalid email or password.", {}, http:STATUS_UNAUTHORIZED);
    }

    // 3) Optional: emailConfirmed gate
    var ecNode = doc?.emailConfirmed;   // json|error
    int? emailConfirmed = ecNode is int ? ecNode : ();
    if emailConfirmed is int && emailConfirmed == 0 {
        return makeResponse(false, "Please verify your email address before logging in.", {}, http:STATUS_FORBIDDEN);
    }

    // 4) Issue cookie (replace 'token' with your real JWT when ready)
    string token = "dev-token"; // TODO: call your JWT helper here
    http:Cookie cookie = new ("JWT", token, path = "/", httpOnly = true, secure = false);

    return makeResponse(true, "User login successful.", doc, http:STATUS_OK, cookie);
}
