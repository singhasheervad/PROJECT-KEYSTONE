package com.keystone.backend.service;

import com.keystone.backend.domain.Customer;
import com.keystone.backend.domain.Site;
import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.domain.WorkOrderStatus;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.SiteRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            CustomerRepository customerRepository,
            SiteRepository siteRepository) {
        this.workOrderRepository = workOrderRepository;
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
    }

    public WorkOrder createWorkOrder(
            String title,
            String description,
            String priority,
            Long customerId,
            Long siteId,
            LocalDateTime slaDueAt) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));

        if (!site.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Site does not belong to this customer");
        }

        WorkOrder workOrder = new WorkOrder();

        workOrder.setTitle(title);
        workOrder.setDescription(description);
        workOrder.setPriority(priority);
        workOrder.setCustomer(customer);
        workOrder.setSite(site);
        workOrder.setStatus(WorkOrderStatus.NEW);
        workOrder.setSlaDueAt(slaDueAt);

        return workOrderRepository.save(workOrder);
    }

    public Page<WorkOrder> getAllWorkOrders(Pageable pageable) {
        return workOrderRepository.findAll(pageable);
    }

    public WorkOrder getWorkOrderById(Long id) {
        return workOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work order not found"));
    }

    public List<WorkOrder> getByCustomer(Long customerId) {
        return workOrderRepository.findByCustomerId(customerId);
    }

    public List<WorkOrder> getBySite(Long siteId) {
        return workOrderRepository.findBySiteId(siteId);
    }

    public List<WorkOrder> getByTechnician(Long technicianId) {
        return workOrderRepository.findByAssignedTechnicianId(technicianId);
    }

    public WorkOrder updateWorkOrder(
            Long id,
            String title,
            String description,
            String priority,
            LocalDateTime slaDueAt) {

        WorkOrder workOrder = getWorkOrderById(id);

        if (workOrder.getStatus() == WorkOrderStatus.CLOSED
                || workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Closed or cancelled work orders cannot be edited"
            );
        }

        workOrder.setTitle(title);
        workOrder.setDescription(description);
        workOrder.setPriority(priority);
        workOrder.setSlaDueAt(slaDueAt);

        return workOrderRepository.save(workOrder);
    }
}