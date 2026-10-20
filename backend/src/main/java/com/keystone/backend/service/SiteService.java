package com.keystone.backend.service;

import com.keystone.backend.domain.Customer;
import com.keystone.backend.domain.Site;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.SiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SiteService {

    private final SiteRepository siteRepository;
    private final CustomerRepository customerRepository;

    public SiteService(
            SiteRepository siteRepository,
            CustomerRepository customerRepository
    ) {
        this.siteRepository = siteRepository;
        this.customerRepository = customerRepository;
    }

    public Site createSite(
            Long customerId,
            String name,
            String address,
            String city,
            String postalCode
    ) {

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found")
                );

        Site site = new Site();

        site.setName(name);
        site.setAddress(address);
        site.setCity(city);
        site.setPostalCode(postalCode);
        site.setCustomer(customer);

        return siteRepository.save(site);
    }

    public List<Site> getSitesByCustomer(Long customerId) {

        if (!customerRepository.existsById(customerId)) {
            throw new RuntimeException("Customer not found");
        }

        return siteRepository.findByCustomerId(customerId);
    }

    public Site getSiteById(Long id) {

        return siteRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Site not found")
                );
    }

    public Site updateSite(
            Long id,
            String name,
            String address,
            String city,
            String postalCode
    ) {

        Site site = getSiteById(id);

        site.setName(name);
        site.setAddress(address);
        site.setCity(city);
        site.setPostalCode(postalCode);

        return siteRepository.save(site);
    }

    public void deleteSite(Long id) {

        Site site = getSiteById(id);

        siteRepository.delete(site);
    }
}