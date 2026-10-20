package com.keystone.backend.service;

import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.domain.WorkOrderStatus;
import com.keystone.backend.domain.WorkOrderStatusHistory;
import com.keystone.backend.repository.WorkOrderRepository;
import com.keystone.backend.repository.WorkOrderStatusHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkOrderStatusService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;

    public WorkOrderStatusService(
            WorkOrderRepository workOrderRepository,
            WorkOrderStatusHistoryRepository historyRepository) {
        this.workOrderRepository = workOrderRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public WorkOrder changeStatus(
            Long workOrderId,
            WorkOrderStatus newStatus,
            String changedBy) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        WorkOrderStatus oldStatus = workOrder.getStatus();

        if (oldStatus == newStatus) {
            throw new RuntimeException("Work order is already in this status");
        }

        if (!isAllowedTransition(oldStatus, newStatus)) {
            throw new RuntimeException(
                    "Illegal status transition: "
                            + oldStatus
                            + " -> "
                            + newStatus
            );
        }

        workOrder.setStatus(newStatus);

        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);

        WorkOrderStatusHistory history =
                new WorkOrderStatusHistory(
                        savedWorkOrder,
                        oldStatus,
                        newStatus,
                        changedBy
                );

        historyRepository.save(history);

        return savedWorkOrder;
    }

    public List<WorkOrderStatusHistory> getHistory(Long workOrderId) {

        if (!workOrderRepository.existsById(workOrderId)) {
            throw new RuntimeException("Work order not found");
        }

        return historyRepository
                .findByWorkOrderIdOrderByChangedAtAsc(workOrderId);
    }

    private boolean isAllowedTransition(
            WorkOrderStatus oldStatus,
            WorkOrderStatus newStatus) {

        return switch (oldStatus) {

            case NEW ->
                    newStatus == WorkOrderStatus.ASSIGNED
                            || newStatus == WorkOrderStatus.CANCELLED;

            case ASSIGNED ->
                    newStatus == WorkOrderStatus.IN_PROGRESS
                            || newStatus == WorkOrderStatus.CANCELLED;

            case IN_PROGRESS ->
                    newStatus == WorkOrderStatus.ON_HOLD
                            || newStatus == WorkOrderStatus.COMPLETED;

            case ON_HOLD ->
                    newStatus == WorkOrderStatus.IN_PROGRESS
                            || newStatus == WorkOrderStatus.CANCELLED;

            case COMPLETED ->
                    newStatus == WorkOrderStatus.CLOSED;

            case CLOSED, CANCELLED ->
                    false;
        };
    }
}