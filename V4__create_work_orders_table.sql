CREATE TABLE work_orders (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    customer_id BIGINT NOT NULL,
    site_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_work_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_work_orders_site
        FOREIGN KEY (site_id)
        REFERENCES sites(id)
        ON DELETE CASCADE
);