// User roles in the system
public enum UserRole {
    ADMIN,
    DONOR, 
    HOSPITAL
}

// Hospital approval status
public enum HospitalStatus {
    ACTIVE, // Hospital has changed their default password, hence operational
    INACTIVE, // The hospital hasn't activated the account yet
    SUSPENDED
}

// User record structure
public type User record {
    string id;
    string email;
    string passwordHash;
    UserRole role;
    string createdAt;
    string? firstName?;
    string? lastName?;
    string? phoneNumber?;

    // Hospital-specific fields (only for HOSPITAL role)
    string? hospitalName?;
    string? hospitalId?;
    string? location?; //Grama Niladhari Division
    string? hospitalPhone?;
    string? contactPersonName?;
    HospitalStatus? hospitalStatus?;
};

// Request/Response structures

// Admin created hospital account (replaces HospitalRegisterRequest)
public type HospitalRegistration record {
    string hospitalName;
    string hospitalId; // Government hospital ID
    string email; // Hospital's official email
    string password; // Admin sets initial password
    string location; // Grama Niladhari Division
    string hospitalPhone;
    string contactPersonName;
    string contactPersonTitle;
    string? additionalNotes?;
};

// Donor registration
public type UserRegisterRequest record {
    string email;
    string password;
    string confirmPassword;
    UserRole role = DONOR;
    string? firstName?;
    string? lastName?;
    string? phoneNumber?;
};

public type LoginRequest record {
    string email;
    string password;
};

public type UserInfo record {
    string id;
    string email;
    UserRole role;
    string? firstName?;
    string? lastName?;
    string? phoneNumber?;

    // Hospital info (if role is HOSPITAL)
    string? hospitalName?;
    string? hospitalId?;
    string? contactPersonName?;
    HospitalStatus? hospitalStatus?;
};

public type AuthResponse record {
    string token;
    UserInfo user;
};

public type JWTPayload record {
    string userId;
    string email;
    UserRole role;
    int exp; // Expiration time (1 h = 3600 s)
    string? hospitalId?; // Include hospital ID in JWT for hospital accounts
};
