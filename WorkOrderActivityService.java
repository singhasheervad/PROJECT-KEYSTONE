package com.keystone.backend.service;

import com.keystone.backend.domain.Part;
import com.keystone.backend.domain.TimeLog;
import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.domain.WorkOrderPart;
import com.keystone.backend.repository.PartRepository;
import com.keystone.backend.repository.TimeLogRepository;
import com.keystone.backend.repository.WorkOrderPartRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkOrderActivityService {

    private final WorkOrderRepository workOrderRepository;
    private final PartRepository partRepository;
    private final WorkOrderPartRepository workOrderPartRepository;
    private final TimeLogRepository timeLogRepository;

    public WorkOrderActivityService(
            WorkOrderRepository workOrderRepository,
            PartRepository partRepository,
            WorkOrderPartRepository workOrderPartRepository,
            TimeLogRepository timeLogRepository) {

        this.workOrderRepository = workOrderRepository;
        this.partRepository = partRepository;
        this.workOrderPartRepository = workOrderPartRepository;
        this.timeLogRepository = timeLogRepository;
    }

    @Transactional
    public WorkOrderPart addPart(
            Long workOrderId,
            Long partId,
            Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        if (part.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient part stock");
        }

        part.setStockQuantity(part.getStockQuantity() - quantity);
        partRepository.save(part);

        WorkOrderPart workOrderPart =
                new WorkOrderPart(workOrder, part, quantity);

        return workOrderPartRepository.save(workOrderPart);
    }

    public List<WorkOrderPart> getParts(Long workOrderId) {

        if (!workOrderRepository.existsById(workOrderId)) {
            throw new RuntimeException("Work order not found");
        }

        return workOrderPartRepository.findByWorkOrderId(workOrderId);
    }

    @Transactional
    public TimeLog addTime(
            Long workOrderId,
            Double hours,
            String description,
            String loggedBy) {

        if (hours == null || hours <= 0) {
            throw new RuntimeException("Hours must be greater than zero");
        }

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        TimeLog timeLog =
                new TimeLog(
                        workOrder,
                        hours,
                        description,
                        loggedBy
                );

        return timeLogRepository.save(timeLog);
    }

    public List<TimeLog> getTimeLogs(Long workOrderId) {

        if (!workOrderRepository.existsById(workOrderId)) {
            throw new RuntimeException("Work order not found");
        }

        return timeLogRepository.findByWorkOrderId(workOrderId);
    }
}