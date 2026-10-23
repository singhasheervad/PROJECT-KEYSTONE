CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL UNIQUE,

    contact_email VARCHAR(255) NOT NULL,

    phone VARCHAR(50)
);