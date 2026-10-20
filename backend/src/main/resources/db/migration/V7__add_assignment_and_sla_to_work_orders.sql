ALTER TABLE work_orders
ADD COLUMN assigned_technician_id BIGINT;

ALTER TABLE work_orders
ADD COLUMN sla_due_at TIMESTAMP;

ALTER TABLE work_orders
ADD CONSTRAINT fk_work_orders_technician
    FOREIGN KEY (assigned_technician_id)
    REFERENCES users(id);