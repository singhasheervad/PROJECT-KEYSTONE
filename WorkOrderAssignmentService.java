package com.keystone.backend.service;

import com.keystone.backend.domain.User;
import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.domain.WorkOrderStatus;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkOrderAssignmentService {

    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;
    private final WorkOrderStatusService statusService;

    public WorkOrderAssignmentService(
            WorkOrderRepository workOrderRepository,
            UserRepository userRepository,
            WorkOrderStatusService statusService) {

        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
        this.statusService = statusService;
    }

    @Transactional
    public WorkOrder assignTechnician(
            Long workOrderId,
            Long technicianId) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException("Work order not found: " + workOrderId));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() ->
                        new RuntimeException("Technician not found: " + technicianId));

        if (!"TECHNICIAN".equalsIgnoreCase(technician.getRole())) {
            throw new RuntimeException(
                    "Selected user is not a technician"
            );
        }

        WorkOrderStatus currentStatus = workOrder.getStatus();

        if (currentStatus == WorkOrderStatus.CLOSED
                || currentStatus == WorkOrderStatus.CANCELLED
                || currentStatus == WorkOrderStatus.COMPLETED) {

            throw new RuntimeException(
                    "Cannot assign technician to a completed, closed, or cancelled work order"
            );
        }

        workOrder.setAssignedTechnician(technician);
        workOrderRepository.save(workOrder);

        if (currentStatus != WorkOrderStatus.ASSIGNED) {
            statusService.changeStatus(
                    workOrderId,
                    WorkOrderStatus.ASSIGNED,
                    "SYSTEM"
            );
        }

        return workOrderRepository.findById(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Work order could not be loaded after assignment"
                        ));
    }
}