package com.keystone.backend.controller;

import com.keystone.backend.domain.Site;
import com.keystone.backend.service.SiteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/{customerId}/sites")
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    @PostMapping
    public ResponseEntity<?> createSite(
            @PathVariable Long customerId,
            @RequestBody Site site
    ) {
        try {
            Site createdSite = siteService.createSite(
                    customerId,
                    site.getName(),
                    site.getAddress(),
                    site.getCity(),
                    site.getPostalCode()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdSite);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getSites(
            @PathVariable Long customerId
    ) {
        try {
            List<Site> sites =
                    siteService.getSitesByCustomer(customerId);

            return ResponseEntity.ok(sites);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSite(
            @PathVariable Long customerId,
            @PathVariable Long id
    ) {
        try {
            Site site = siteService.getSiteById(id);

            // Make sure the site actually belongs to this customer.
            if (!site.getCustomer().getId().equals(customerId)) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Site not found");
            }

            return ResponseEntity.ok(site);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}