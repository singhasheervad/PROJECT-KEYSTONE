package com.keystone.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "time_logs")
public class TimeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Column(nullable = false)
    private Double hours;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String loggedBy;

    @Column(nullable = false)
    private LocalDateTime loggedAt;

    public TimeLog() {
    }

    public TimeLog(
            WorkOrder workOrder,
            Double hours,
            String description,
            String loggedBy) {

        this.workOrder = workOrder;
        this.hours = hours;
        this.description = description;
        this.loggedBy = loggedBy;
        this.loggedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public WorkOrder getWorkOrder() {
        return workOrder;
    }

    public Double getHours() {
        return hours;
    }

    public String getDescription() {
        return description;
    }

    public String getLoggedBy() {
        return loggedBy;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }
}