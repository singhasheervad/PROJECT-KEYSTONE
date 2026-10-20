package com.keystone.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "work_order_parts")
public class WorkOrderPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;

    @Column(nullable = false)
    private Integer quantity;

    public WorkOrderPart() {
    }

    public WorkOrderPart(
            WorkOrder workOrder,
            Part part,
            Integer quantity) {

        this.workOrder = workOrder;
        this.part = part;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public WorkOrder getWorkOrder() {
        return workOrder;
    }

    public Part getPart() {
        return part;
    }

    public Integer getQuantity() {
        return quantity;
    }
}