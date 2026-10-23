package com.keystone.backend.service;

import com.keystone.backend.domain.Customer;
import com.keystone.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer createCustomer(
            String name,
            String contactEmail,
            String phone
    ) {

        if (customerRepository.existsByName(name)) {
            throw new RuntimeException("Customer already exists");
        }

        Customer customer = new Customer();

        customer.setName(name);
        customer.setContactEmail(contactEmail);
        customer.setPhone(phone);

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {

        return customerRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found")
                );
    }

    public Customer updateCustomer(
            Long id,
            String name,
            String contactEmail,
            String phone
    ) {

        Customer customer = getCustomerById(id);

        customer.setName(name);
        customer.setContactEmail(contactEmail);
        customer.setPhone(phone);

        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {

        Customer customer = getCustomerById(id);

        customerRepository.delete(customer);
    }
}