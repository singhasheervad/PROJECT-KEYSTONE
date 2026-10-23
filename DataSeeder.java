package com.keystone.backend.config;

import com.keystone.backend.domain.Customer;
import com.keystone.backend.domain.Part;
import com.keystone.backend.domain.Site;
import com.keystone.backend.domain.User;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.PartRepository;
import com.keystone.backend.repository.SiteRepository;
import com.keystone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            SiteRepository siteRepository,
            PartRepository partRepository,
            PasswordEncoder passwordEncoder,
            @Value("${keystone.seed.technician-password}") String technicianPassword,
            @Value("${keystone.seed.dispatcher-password}") String dispatcherPassword,
            @Value("${keystone.seed.customer-password}") String customerPassword) {

        return args -> {

            createUser(
                    userRepository,
                    passwordEncoder,
                    "KEYSTONE Technician",
                    "technician@keystone.com",
                    technicianPassword,
                    "TECHNICIAN"
            );

            createUser(
                    userRepository,
                    passwordEncoder,
                    "KEYSTONE Dispatcher",
                    "dispatcher@keystone.com",
                    dispatcherPassword,
                    "DISPATCHER"
            );

            createUser(
                    userRepository,
                    passwordEncoder,
                    "KEYSTONE Customer",
                    "customer@keystone.com",
                    customerPassword,
                    "CUSTOMER"
            );

            Customer customer =
                    customerRepository.findByName("ABC Facilities Ltd")
                            .orElseGet(() ->
                                    customerRepository.save(
                                            new Customer(
                                                    "ABC Facilities Ltd",
                                                    "manager@abc.com",
                                                    "9876543210"
                                            )
                                    )
                            );

            if (siteRepository.findByCustomerId(customer.getId()).isEmpty()) {

                Site site = new Site(
                        "Delhi Office",
                        "Connaught Place, New Delhi",
                        "New Delhi",
                        "110001",
                        customer
                );

                siteRepository.save(site);
            }

            createPart(
                    partRepository,
                    "Air Filter",
                    50
            );

            createPart(
                    partRepository,
                    "Compressor",
                    10
            );

            createPart(
                    partRepository,
                    "Fan Motor",
                    15
            );
        };
    }

    private void createUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String name,
            String email,
            String password,
            String role) {

        if (!userRepository.existsByEmail(email)) {

            User user = new User();

            user.setName(name);
            user.setEmail(email);
            user.setPassword(
                    passwordEncoder.encode(password)
            );
            user.setRole(role);

            userRepository.save(user);
        }
    }

    private void createPart(
            PartRepository partRepository,
            String name,
            Integer stock) {

        if (partRepository.findAll()
                .stream()
                .noneMatch(part ->
                        part.getName().equalsIgnoreCase(name))) {

            partRepository.save(
                    new Part(
                            name,
                            stock
                    )
            );
        }
    }
}