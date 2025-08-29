package com.saas.AffiliateManagement.repository.test;

import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.models.entity.Commission;
import com.saas.AffiliateManagement.models.entity.Referral;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.repository.CommissionRepository;
import com.saas.AffiliateManagement.repository.ReferralRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final AffiliateRepository affiliateRepository;
    private final ReferralRepository referralRepository;
    private final CommissionRepository commissionRepository;
    private final Random random = new Random();
    private final Set<String> usedEmails = new HashSet<>();
    private final AtomicInteger emailCounter = new AtomicInteger(1);

    @Override
    public void run(String... args) {
        if (clientRepository.count() == 0) {
            log.info("Seeding database with sample data...");
            seedDatabase();
            log.info("Database seeding completed!");
        } else {
            log.info("Database already contains data, skipping seeding.");
        }
    }

    private void seedDatabase() {
        List<Client> clients = createClients();
        List<Affiliate> affiliates = createAffiliates(clients);
        List<Referral> referrals = createReferrals(affiliates);
        createCommissions(affiliates, referrals);
    }

    private List<Client> createClients() {
        log.info("Creating sample clients...");

        List<Client> clients = new ArrayList<>();

        String[] companies = {
                "TechFlow Solutions", "Digital Marketing Pro", "E-Commerce Plus",
                "SaaS Innovators", "Growth Hacker Corp", "Online Retail Masters"
        };

        String[] industries = {"Technology", "Marketing", "E-commerce", "SaaS", "Retail", "Consulting"};
        String[] sizes = {"1-10", "11-50", "51-200", "201-500", "500+"};
        String[] plans = {"BASIC", "PREMIUM", "ENTERPRISE"};

        for (int i = 0; i < companies.length; i++) {
            String companyName = companies[i];
            String cleanName = companyName.toLowerCase().replace(" ", "");

            Client client = Client.builder()
                    .companyName(companyName)
                    .name(companyName)
                    .email("contact@" + cleanName + ".com")
                    .contactFirstName("John")
                    .contactLastName("Manager" + (i + 1))
                    .phoneNumber("+1-555-" + String.format("%04d", random.nextInt(10000)))
                    .website("https://" + cleanName + ".com")
                    .address((random.nextInt(999) + 1) + " Business Street")
                    .city("New York")
                    .country("USA")
                    .postalCode(String.format("%05d", random.nextInt(100000)))
                    .industry(industries[i % industries.length])
                    .companySize(sizes[random.nextInt(sizes.length)])
                    .status("ACTIVE")
                    .subscriptionPlan(plans[random.nextInt(plans.length)])
                    .businessDescription("Leading company in " + industries[i % industries.length].toLowerCase())
                    .notes("Sample client created for testing")
                    .emailVerified(true)
                    .emailVerificationToken(null)
                    .suspensionReason(null)
                    .emailVerifiedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .subscriptionUpgradedAt(random.nextBoolean() ? LocalDateTime.now().minusDays(random.nextInt(60)) : null)
                    .suspendedAt(null)
                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(90)))
                    .updatedAt(LocalDateTime.now().minusDays(random.nextInt(7)))
                    .build();

            clients.add(client);
        }

        return clientRepository.saveAll(clients);
    }

    private List<Affiliate> createAffiliates(List<Client> clients) {
        log.info("Creating sample affiliates...");

        List<Affiliate> affiliates = new ArrayList<>();

        String[] firstNames = {"John", "Jane", "Mike", "Sarah", "David", "Lisa", "Tom", "Emily", "Chris", "Anna",
                "Mark", "Jessica", "Paul", "Amanda", "Steve", "Michelle", "Ryan", "Nicole", "Kevin", "Ashley"};

        String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"};

        String[] companies = {"Digital Marketing Co", "Social Media Agency", "Content Creators LLC", "Influence Network",
                "Online Promotions", "Marketing Masters", "Brand Ambassadors", "Growth Partners"};

        String[] statuses = {"ACTIVE", "PENDING", "ACTIVE", "ACTIVE", "SUSPENDED", "ACTIVE"};
        String[] paymentMethods = {"PayPal", "Bank Transfer", "Stripe", "Wire Transfer"};

        for (Client client : clients) {
            int affiliatesPerClient = 10 + random.nextInt(5);

            for (int i = 0; i < affiliatesPerClient; i++) {
                String firstName = firstNames[random.nextInt(firstNames.length)];
                String lastName = lastNames[random.nextInt(lastNames.length)];
                String email = generateUniqueEmail(firstName, lastName);

                Affiliate affiliate = Affiliate.builder()
                        .client(client)
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .companyName(random.nextBoolean() ? companies[random.nextInt(companies.length)] : null)
                        .phoneNumber("+1-555-" + String.format("%04d", random.nextInt(10000)))
                        .status(statuses[random.nextInt(statuses.length)])
                        .paymentMethod(paymentMethods[random.nextInt(paymentMethods.length)])
                        .paymentDetails("**** **** **** " + String.format("%04d", random.nextInt(10000)))
                        .website(random.nextBoolean() ? "https://" + firstName.toLowerCase() + lastName.toLowerCase() + ".com" : null)
                        .socialMediaLinks("@" + firstName.toLowerCase() + lastName.toLowerCase())
                        .notes("Experienced affiliate marketer with focus on " + client.getIndustry().toLowerCase())
                        .referralCode(generateReferralCode(firstName, lastName))
                        .rejectionReason(null)
                        .createdAt(LocalDateTime.now().minusDays(random.nextInt(60)))
                        .updatedAt(LocalDateTime.now().minusDays(random.nextInt(7)))
                        .build();

                affiliates.add(affiliate);
            }
        }

        return affiliateRepository.saveAll(affiliates);
    }

    private List<Referral> createReferrals(List<Affiliate> affiliates) {
        log.info("Creating sample referrals...");

        List<Referral> referrals = new ArrayList<>();
        String[] deviceTypes = {"DESKTOP", "MOBILE", "TABLET"};
        String[] browsers = {"Chrome", "Firefox", "Safari", "Edge"};
        String[] operatingSystems = {"Windows", "macOS", "iOS", "Android", "Linux"};
        String[] countries = {"USA", "Canada", "UK", "Germany", "France", "Australia", "Japan"};
        String[] cities = {"New York", "Los Angeles", "London", "Toronto", "Berlin", "Paris", "Tokyo"};
        String[] statuses = {"CLICKED", "CONVERTED", "CLICKED", "CLICKED", "CONVERTED"};
        String[] sources = {"Facebook", "Instagram", "YouTube", "Blog", "Email", "Direct"};

        String[] customerFirstNames = {"Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah",
                "Isaac", "Julia", "Kevin", "Laura", "Michael", "Nancy", "Oscar", "Patricia", "Quinn", "Rachel",
                "Samuel", "Tina", "Uma", "Victor", "Wendy", "Xavier", "Yvonne", "Zachary"};

        String[] customerLastNames = {"Brown", "Davis", "Evans", "Fisher", "Green", "Harris", "King", "Lewis",
                "Miller", "Nelson", "O'Connor", "Parker", "Quinn", "Roberts", "Stone", "Turner", "Underwood",
                "Vincent", "Walker", "Young", "Zhang", "Adams", "Baker", "Clark", "Edwards", "Foster"};

        for (Affiliate affiliate : affiliates) {
            int referralsCount = 10 + random.nextInt(20);

            for (int i = 0; i < referralsCount; i++) {
                LocalDateTime clickedAt = LocalDateTime.now().minusDays(random.nextInt(180));
                String status = statuses[random.nextInt(statuses.length)];
                String customerFirstName = customerFirstNames[random.nextInt(customerFirstNames.length)];
                String customerLastName = customerLastNames[random.nextInt(customerLastNames.length)];

                String uniqueCustomerEmail = generateUniqueCustomerEmail(customerFirstName, customerLastName);

                Referral referral = Referral.builder()
                        .client(affiliate.getClient())
                        .affiliate(affiliate)
                        .referralCode(affiliate.getReferralCode() + "-" + String.format("%06d", emailCounter.getAndIncrement()))
                        .targetUrl("https://example.com/product/" + random.nextInt(100))
                        .sourceUrl("https://affiliate-site.com/promo")
                        .status(status)
                        .userAgent("Mozilla/5.0 (compatible)")
                        .ipAddress(generateRandomIP())
                        .deviceType(deviceTypes[random.nextInt(deviceTypes.length)])
                        .browserName(browsers[random.nextInt(browsers.length)])
                        .operatingSystem(operatingSystems[random.nextInt(operatingSystems.length)])
                        .country(countries[random.nextInt(countries.length)])
                        .city(cities[random.nextInt(cities.length)])
                        .conversionValue("CONVERTED".equals(status) ?
                                BigDecimal.valueOf(50 + random.nextDouble() * 450) : null)
                        .orderId("CONVERTED".equals(status) ? "ORD-" + System.currentTimeMillis() + i : null)
                        .metadataJson(null)
                        .clickedAt(clickedAt)
                        .convertedAt("CONVERTED".equals(status) ?
                                clickedAt.plusHours(random.nextInt(48)) : null)
                        .customerName(customerFirstName + " " + customerLastName)
                        .customerEmail(uniqueCustomerEmail)
                        .source(sources[random.nextInt(sources.length)])
                        .totalPaid("CONVERTED".equals(status) ?
                                BigDecimal.valueOf(50 + random.nextDouble() * 450) : BigDecimal.ZERO)
                        .totalCommission("CONVERTED".equals(status) ?
                                BigDecimal.valueOf(5 + random.nextDouble() * 45) : BigDecimal.ZERO)
                        .lastPurchaseDate("CONVERTED".equals(status) ? clickedAt : null)
                        .purchaseCount("CONVERTED".equals(status) ? random.nextInt(5) + 1 : 0)
                        .createdAt(clickedAt)
                        .updatedAt(clickedAt)
                        .build();

                referrals.add(referral);
            }
        }

        return referralRepository.saveAll(referrals);
    }

    private void createCommissions(List<Affiliate> affiliates, List<Referral> referrals) {
        log.info("Creating sample commissions...");

        List<Commission> commissions = new ArrayList<>();
        String[] statuses = {"PENDING", "PAID", "PENDING", "PAID"};
        String[] types = {"SALE", "LEAD", "SUBSCRIPTION", "RENEWAL"};
        String[] currencies = {"USD", "EUR", "GBP"};

        List<Referral> convertedReferrals = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()))
                .toList();

        for (Referral referral : convertedReferrals) {
            BigDecimal commissionRate = BigDecimal.valueOf(0.05 + random.nextDouble() * 0.15);
            BigDecimal amount = referral.getConversionValue().multiply(commissionRate);

            LocalDateTime earnedAt = referral.getConvertedAt();
            String status = statuses[random.nextInt(statuses.length)];

            Commission commission = Commission.builder()
                    .affiliate(referral.getAffiliate())
                    .referralId(referral.getId())
                    .amount(amount)
                    .percentage(commissionRate.multiply(BigDecimal.valueOf(100)))
                    .currency(currencies[random.nextInt(currencies.length)])
                    .status(status)
                    .type(types[random.nextInt(types.length)])
                    .description("Commission for " + referral.getReferralCode())
                    .earnedAt(earnedAt)
                    .paidAt("PAID".equals(status) ? earnedAt.plusDays(random.nextInt(30)) : null)
                    .createdAt(earnedAt)
                    .updatedAt(earnedAt)
                    .build();

            commissions.add(commission);
        }

        for (Affiliate affiliate : affiliates) {
            if (!"ACTIVE".equals(affiliate.getStatus())) continue;

            for (int month = 1; month <= 12; month++) {
                int commissionsThisMonth = random.nextInt(3) + 1;

                for (int i = 0; i < commissionsThisMonth; i++) {
                    LocalDateTime earnedAt = LocalDateTime.of(2024, Month.of(month),
                            1 + random.nextInt(28), random.nextInt(24), random.nextInt(60));

                    BigDecimal amount = BigDecimal.valueOf(25 + random.nextDouble() * 475);
                    String status = statuses[random.nextInt(statuses.length)];

                    Commission commission = Commission.builder()
                            .affiliate(affiliate)
                            .referralId(1000L + random.nextLong(9000))
                            .amount(amount)
                            .percentage(BigDecimal.valueOf(5 + random.nextDouble() * 15))
                            .currency("USD")
                            .status(status)
                            .type(types[random.nextInt(types.length)])
                            .description("Monthly commission #" + i)
                            .earnedAt(earnedAt)
                            .paidAt("PAID".equals(status) ? earnedAt.plusDays(random.nextInt(30)) : null)
                            .createdAt(earnedAt)
                            .updatedAt(earnedAt)
                            .build();

                    commissions.add(commission);
                }
            }
        }

        commissionRepository.saveAll(commissions);
    }

    private String generateUniqueEmail(String firstName, String lastName) {
        String baseEmail = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        String email = baseEmail;
        int counter = 1;

        while (usedEmails.contains(email)) {
            email = firstName.toLowerCase() + "." + lastName.toLowerCase() + counter + "@gmail.com";
            counter++;
        }

        usedEmails.add(email);
        return email;
    }

    private String generateUniqueCustomerEmail(String firstName, String lastName) {
        String email;
        int attempts = 0;

        do {
            int randomSuffix = emailCounter.getAndIncrement();
            email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "." + randomSuffix + "@customer.com";
            attempts++;
        } while (usedEmails.contains(email) && attempts < 100);

        usedEmails.add(email);
        return email;
    }

    private String generateReferralCode(String firstName, String lastName) {
        return (firstName.substring(0, Math.min(3, firstName.length())) +
                lastName.substring(0, Math.min(3, lastName.length())) +
                String.format("%04d", random.nextInt(10000))).toUpperCase();
    }

    private String generateRandomIP() {
        return random.nextInt(256) + "." + random.nextInt(256) + "." +
                random.nextInt(256) + "." + random.nextInt(256);
    }
}