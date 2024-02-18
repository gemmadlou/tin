-- Create extracts table if it does not exist
CREATE TABLE IF NOT EXISTS extracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    row_id INTEGER,
    upload_id INTEGER,
    json JSON,
    UNIQUE(row_id, upload_id)
);

-- Create mapped_data table if it does not exist
CREATE TABLE IF NOT EXISTS mapped_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schema_uploads_id INTEGER NOT NULL,
    row_id INTEGER NOT NULL,
    json JSON,
    UNIQUE(schema_uploads_id, row_id),
    FOREIGN KEY (schema_uploads_id) REFERENCES schema_uploads(id)
);

-- Create mappers table if it does not exist
CREATE TABLE IF NOT EXISTS mappers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config TEXT NOT NULL CHECK (json_valid(config)),
    hashed TEXT,
    UNIQUE(hashed)
);

-- Create schema_uploads table if it does not exist
CREATE TABLE IF NOT EXISTS schema_uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schema_id INTEGER NOT NULL,
    upload_id INTEGER,
    mapper_id INTEGER,
    uuid VARCHAR(255) NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'in_progress',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (mapper_id) REFERENCES mappers(id)
);

-- Create schemas table if it does not exist
CREATE TABLE IF NOT EXISTS schemas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(45) NOT NULL,
	description	VARCHAR(255),
    json JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- Create uploads table if it does not exist
CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    filepath TEXT
);
