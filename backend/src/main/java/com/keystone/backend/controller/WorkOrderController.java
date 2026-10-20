package com.keystone.backend.controller;

import com.keystone.backend.domain.WorkOrder;
import com.keystone.backend.domain.WorkOrderStatus;
import com.keystone.backend.domain.WorkOrderStatusHistory;
import com.keystone.backend.service.WorkOrderActivityService;
import com.keystone.backend.service.WorkOrderAssignmentService;
import com.keystone.backend.service.WorkOrderService;
import com.keystone.backend.service.WorkOrderStatusService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;
    private final WorkOrderAssignmentService assignmentService;
    private final WorkOrderStatusService statusService;
    private final WorkOrderActivityService activityService;

    public WorkOrderController(
            WorkOrderService workOrderService,
            WorkOrderAssignmentService assignmentService,
            WorkOrderStatusService statusService,
            WorkOrderActivityService activityService) {

        this.workOrderService = workOrderService;
        this.assignmentService = assignmentService;
        this.statusService = statusService;
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<?> createWorkOrder(
            @Valid @RequestBody WorkOrderRequest request) {

        try {
            WorkOrder workOrder = workOrderService.createWorkOrder(
                    request.title(),
                    request.description(),
                    request.priority(),
                    request.customerId(),
                    request.siteId(),
                    request.slaDueAt()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(workOrder);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<WorkOrder>> getAllWorkOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        if (page < 0) {
            page = 0;
        }

        if (size < 1 || size > 100) {
            size = 20;
        }

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(
                workOrderService.getAllWorkOrders(pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkOrder(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    workOrderService.getWorkOrderById(id)
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getByCustomer(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                workOrderService.getByCustomer(customerId)
        );
    }

    @GetMapping("/site/{siteId}")
    public ResponseEntity<?> getBySite(
            @PathVariable Long siteId) {

        return ResponseEntity.ok(
                workOrderService.getBySite(siteId)
        );
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<?> getByTechnician(
            @PathVariable Long technicianId) {

        return ResponseEntity.ok(
                workOrderService.getByTechnician(technicianId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody WorkOrderRequest request) {

        try {
            WorkOrder workOrder =
                    workOrderService.updateWorkOrder(
                            id,
                            request.title(),
                            request.description(),
                            request.priority(),
                            request.slaDueAt()
                    );

            return ResponseEntity.ok(workOrder);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId) {

        try {
            return ResponseEntity.ok(
                    assignmentService.assignTechnician(
                            id,
                            technicianId
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(
            @PathVariable Long id,
            @RequestParam WorkOrderStatus status,
            Authentication authentication) {

        try {
            return ResponseEntity.ok(
                    statusService.changeStatus(
                            id,
                            status,
                            authentication != null
                                    ? authentication.getName()
                                    : "SYSTEM"
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getHistory(
            @PathVariable Long id) {

        try {
            List<WorkOrderStatusHistory> history =
                    statusService.getHistory(id);

            return ResponseEntity.ok(history);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{id}/parts")
    public ResponseEntity<?> addPart(
            @PathVariable Long id,
            @RequestParam Long partId,
            @RequestParam Integer quantity) {

        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            activityService.addPart(
                                    id,
                                    partId,
                                    quantity
                            )
                    );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}/parts")
    public ResponseEntity<?> getParts(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    activityService.getParts(id)
            );
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{id}/time")
    public ResponseEntity<?> addTime(
            @PathVariable Long id,
            @RequestParam Double hours,
            @RequestParam String description,
            Authentication authentication) {

        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            activityService.addTime(
                                    id,
                                    hours,
                                    description,
                                    authentication != null
                                            ? authentication.getName()
                                            : "SYSTEM"
                            )
                    );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}/time")
    public ResponseEntity<?> getTimeLogs(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    activityService.getTimeLogs(id)
            );
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    public record WorkOrderRequest(

            @NotBlank(message = "Title is required")
            String title,

            String description,

            @NotBlank(message = "Priority is required")
            String priority,

            @NotNull(message = "Customer ID is required")
            Long customerId,

            @NotNull(message = "Site ID is required")
            Long siteId,

            LocalDateTime slaDueAt
    ) {
    }
}