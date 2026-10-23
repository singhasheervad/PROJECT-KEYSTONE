package com.keystone.backend.controller;

import com.keystone.backend.domain.Customer;
import com.keystone.backend.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(
            @RequestBody Customer customer
    ) {

        try {

            Customer created = customerService.createCustomer(
                    customer.getName(),
                    customer.getContactEmail(),
                    customer.getPhone()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(created);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {

        return ResponseEntity.ok(
                customerService.getAllCustomers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(
            @PathVariable Long id
    ) {

        try {

            return ResponseEntity.ok(
                    customerService.getCustomerById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer
    ) {

        try {

            Customer updated =
                    customerService.updateCustomer(
                            id,
                            customer.getName(),
                            customer.getContactEmail(),
                            customer.getPhone()
                    );

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(
            @PathVariable Long id
    ) {

        try {

            customerService.deleteCustomer(id);

            return ResponseEntity.ok(
                    "Customer deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}