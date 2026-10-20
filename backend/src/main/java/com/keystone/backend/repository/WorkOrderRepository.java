package com.keystone.backend.repository;

import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.domain.WorkOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    List<WorkOrder> findByCustomerId(Long customerId);

    List<WorkOrder> findBySiteId(Long siteId);

    List<WorkOrder> findByStatus(WorkOrderStatus status);

    List<WorkOrder> findByAssignedTechnicianId(Long technicianId);

    Page<WorkOrder> findAll(Pageable pageable);

    long countByStatus(WorkOrderStatus status);
}