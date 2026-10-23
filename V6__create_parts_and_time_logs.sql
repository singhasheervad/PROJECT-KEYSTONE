CREATE TABLE parts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    stock_quantity INTEGER NOT NULL
);

CREATE TABLE work_order_parts (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    part_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,

    CONSTRAINT fk_work_order_parts_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_work_order_parts_part
        FOREIGN KEY (part_id)
        REFERENCES parts(id)
);

CREATE TABLE time_logs (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    hours DOUBLE PRECISION NOT NULL,
    description VARCHAR(500),
    logged_by VARCHAR(255) NOT NULL,
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_time_logs_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id)
        ON DELETE CASCADE
);