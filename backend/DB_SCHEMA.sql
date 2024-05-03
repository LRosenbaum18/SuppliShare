CREATE SCHEMA IF NOT EXISTS SuppliShare;

CREATE TYPE SuppliShare.UserRole AS ENUM ('Admin', 'Teacher', 'Donor');
CREATE TYPE SuppliShare.ItemStatus AS ENUM ('Pending', 'Accepted', 'Rejected');
CREATE TYPE SuppliShare.RequestStatus AS ENUM ('Pending', 'Accepted', 'Rejected');
CREATE TYPE SuppliShare.ListingStatus AS ENUM ('Active', 'Expired', 'Paused');

CREATE TABLE SuppliShare.Users (
    UserID SERIAL PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    AccountStatus BOOLEAN DEFAULT TRUE,
    LastLoginDate TIMESTAMP,
    Role SuppliShare.UserRole,
    OrganizationName VARCHAR(255),
    ItemsDonated INTEGER DEFAULT 0,
    SchoolName VARCHAR(255),
    GradeLevel VARCHAR(50),
    City VARCHAR(255) NOT NULL,
    State VARCHAR(255) NOT NULL,
    AzureObjectId UUID UNIQUE
);

-- Renamed Items to Listings, ItemID to ListingID, and ItemType to ListingName. Status type changed to ListingStatus
CREATE TABLE SuppliShare.Listings (
    ListingID SERIAL PRIMARY KEY,
    ListingName VARCHAR(255) NOT NULL,
    Description TEXT,
    ZipCode VARCHAR(10),
    DatePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status SuppliShare.ListingStatus, -- Now using ListingStatus
    UserID INTEGER NOT NULL,
    ImageCount INTEGER DEFAULT 0,
    FOREIGN KEY (UserID) REFERENCES SuppliShare.Users(UserID) -- Ensuring FK constraint is correctly defined
);

-- ItemID in ImageURL table changed to ListingID to reflect the Listings table changes
CREATE TABLE SuppliShare.ImageURL (
    ImageID SERIAL PRIMARY KEY,
    ListingID INTEGER NOT NULL,
    ImageURL VARCHAR(1024) NOT NULL,
    FOREIGN KEY (ListingID) REFERENCES SuppliShare.Listings(ListingID) -- Updated FK reference
);

CREATE TABLE SuppliShare.Requests (
    RequestID SERIAL PRIMARY KEY,
    TeacherID INTEGER NOT NULL,
    ListingID INTEGER NOT NULL,
    RequestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status SuppliShare.RequestStatus,
    FOREIGN KEY (TeacherID) REFERENCES SuppliShare.Users(UserID),
    FOREIGN KEY (ListingID) REFERENCES SuppliShare.Listings(ListingID) -- Updated FK reference
);

CREATE TABLE SuppliShare.Messages (
    MessageID SERIAL PRIMARY KEY,
    SenderID INTEGER NOT NULL,
    RecipientID INTEGER NOT NULL,
    MsgTxt TEXT,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SenderID) REFERENCES SuppliShare.Users(UserID),
    FOREIGN KEY (RecipientID) REFERENCES SuppliShare.Users(UserID)
);

CREATE TABLE SuppliShare.GenerateReport (
    ReportID SERIAL PRIMARY KEY,
    ReporterID INTEGER NOT NULL,
    ReportContent TEXT,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReporterID) REFERENCES SuppliShare.Users(UserID)
);
