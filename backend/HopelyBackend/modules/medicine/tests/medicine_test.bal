import ballerina/io;
import ballerina/test;

// Before Suite Function

@test:BeforeSuite
function beforeSuiteFunc() {
    io:println("I'm the before suite function!");
}

// Test function

@test:Config {}
function testFunction() {
    string name = "John";
    string welcomeMsg = hello(name);
    test:assertEquals(welcomeMsg, "Hello, John");
}

// Negative Test function

@test:Config {}
function negativeTestFunction() {
    string welcomeMsg = hello(());
    test:assertEquals(welcomeMsg, "Hello, World!");
}

function hello(string? n = ()) returns string {
    if n is string {
        return "Hello, " + n;
    }
    return "Hello, World!";
}

// After Suite Function

@test:AfterSuite
function afterSuiteFunc() {
    io:println("I'm the after suite function!");
}
