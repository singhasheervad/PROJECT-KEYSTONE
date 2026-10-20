package com.keystone.backend.service;

import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.domain.WorkOrderStatus;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final WorkOrderRepository workOrderRepository;

    public DashboardService(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    public DashboardSummary getSummary() {

        long total = workOrderRepository.count();

        long newCount =
                workOrderRepository.countByStatus(WorkOrderStatus.NEW);

        long assigned =
                workOrderRepository.countByStatus(WorkOrderStatus.ASSIGNED);

        long inProgress =
                workOrderRepository.countByStatus(WorkOrderStatus.IN_PROGRESS);

        long onHold =
                workOrderRepository.countByStatus(WorkOrderStatus.ON_HOLD);

        long completed =
                workOrderRepository.countByStatus(WorkOrderStatus.COMPLETED);

        long closed =
                workOrderRepository.countByStatus(WorkOrderStatus.CLOSED);

        long cancelled =
                workOrderRepository.countByStatus(WorkOrderStatus.CANCELLED);

        long overdue = workOrderRepository.findAll()
                .stream()
                .filter(this::isOverdue)
                .count();

        long completedOnTime = workOrderRepository.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == WorkOrderStatus.COMPLETED
                                || order.getStatus() == WorkOrderStatus.CLOSED)
                .filter(order ->
                        order.getSlaDueAt() != null
                                && order.getCreatedAt() != null
                                && order.getSlaDueAt()
                                .isAfter(order.getCreatedAt()))
                .filter(order ->
                        !order.getCreatedAt().isAfter(order.getSlaDueAt()))
                .count();

        double slaCompliance = 0.0;

        if (completed + closed > 0) {
            slaCompliance =
                    (completedOnTime * 100.0)
                            / (completed + closed);
        }

        return new DashboardSummary(
                total,
                newCount,
                assigned,
                inProgress,
                onHold,
                completed,
                closed,
                cancelled,
                overdue,
                Math.round(slaCompliance * 100.0) / 100.0
        );
    }

    private boolean isOverdue(WorkOrder order) {

        if (order.getSlaDueAt() == null) {
            return false;
        }

        boolean finished =
                order.getStatus() == WorkOrderStatus.COMPLETED
                        || order.getStatus() == WorkOrderStatus.CLOSED
                        || order.getStatus() == WorkOrderStatus.CANCELLED;

        if (finished) {
            return false;
        }

        return LocalDateTime.now()
                .isAfter(order.getSlaDueAt());
    }

    public record DashboardSummary(
            long total,
            long newCount,
            long assigned,
            long inProgress,
            long onHold,
            long completed,
            long closed,
            long cancelled,
            long overdue,
            double slaCompliancePercentage
    ) {
    }
}