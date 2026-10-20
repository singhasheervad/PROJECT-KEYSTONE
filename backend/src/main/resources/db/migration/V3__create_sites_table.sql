CREATE TABLE sites (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    address VARCHAR(500) NOT NULL,

    city VARCHAR(100),

    postal_code VARCHAR(20),

    customer_id BIGINT NOT NULL,

    CONSTRAINT fk_sites_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);