package com.saas.AffiliateManagement.repository.test;

import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.models.entity.Commission;
import com.saas.AffiliateManagement.models.entity.Payment;
import com.saas.AffiliateManagement.models.entity.Referral;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.repository.CommissionRepository;
import com.saas.AffiliateManagement.repository.PaymentRepository;
import com.saas.AffiliateManagement.repository.ReferralRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
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
    private final PaymentRepository paymentRepository;

    private final Random random = new Random();
    private final Set<String> usedEmails = new HashSet<>();
    private final Set<String> usedReferralCodes = new HashSet<>();
    private final Set<String> usedTransactionIds = new HashSet<>();
    private final AtomicInteger emailCounter = new AtomicInteger(1);
    private final AtomicInteger codeCounter = new AtomicInteger(1);

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
        List<Commission> commissions = createCommissions(affiliates, referrals);
        createPayments(affiliates, commissions);
    }

    private List<Client> createClients() {
        log.info("Creating sample clients...");

        List<Client> clients = new ArrayList<>();

        String[] companies = {
                "TechFlow Solutions", "Digital Marketing Pro", "E-Commerce Plus",
                "SaaS Innovators", "Growth Hacker Corp", "Online Retail Masters",
                "Cloud Computing Inc", "Data Analytics Hub", "Mobile App Factory",
                "AI Solutions Ltd"
        };

        String[] industries = {"Technology", "Marketing", "E-commerce", "SaaS", "Retail",
                "Consulting", "Healthcare", "Finance", "Education", "Entertainment"};
        String[] sizes = {"1-10", "11-50", "51-200", "201-500", "500+"};
        String[] plans = {"BASIC", "PREMIUM", "ENTERPRISE"};
        String[] statuses = {"ACTIVE", "ACTIVE", "ACTIVE", "SUSPENDED", "PENDING"};

        for (int i = 0; i < companies.length; i++) {
            String companyName = companies[i];
            String cleanName = companyName.toLowerCase()
                    .replace(" ", "")
                    .replace("-", "")
                    .replace(".", "");

            Client client = Client.builder()
                    .companyName(companyName)
                    .name(companyName)
                    .email(generateUniqueEmail("contact", cleanName))
                    .contactFirstName("John")
                    .contactLastName("Manager" + (i + 1))
                    .phoneNumber("+1-555-" + String.format("%04d", random.nextInt(10000)))
                    .website("https://" + cleanName + ".com")
                    .address((random.nextInt(999) + 1) + " Business Street")
                    .city(getRandomCity())
                    .country("USA")
                    .postalCode(String.format("%05d", random.nextInt(100000)))
                    .industry(industries[i % industries.length])
                    .companySize(sizes[random.nextInt(sizes.length)])
                    .status(statuses[random.nextInt(statuses.length)])
                    .subscriptionPlan(plans[random.nextInt(plans.length)])
                    .businessDescription("Leading company in " + industries[i % industries.length].toLowerCase())
                    .notes("Sample client created for testing - Tier " + (i + 1))
                    .emailVerified(random.nextBoolean())
                    .emailVerificationToken(random.nextBoolean() ? null : UUID.randomUUID().toString())
                    .emailVerifiedAt(LocalDateTime.now().minusDays(random.nextInt(90)))
                    .subscriptionUpgradedAt(random.nextBoolean() ?
                            LocalDateTime.now().minusDays(random.nextInt(180)) : null)

                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(365)))
                    .updatedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .build();

            clients.add(client);
        }

        return clientRepository.saveAll(clients);
    }

    private List<Affiliate> createAffiliates(List<Client> clients) {
        log.info("Creating sample affiliates...");

        List<Affiliate> affiliates = new ArrayList<>();
        Set<String> usedIdentifiers = new HashSet<>();

        String[] firstNames = {"John", "Jane", "Mike", "Sarah", "David", "Lisa", "Tom", "Emily",
                "Chris", "Anna", "Mark", "Jessica", "Paul", "Amanda", "Steve",
                "Michelle", "Ryan", "Nicole", "Kevin", "Ashley", "Daniel", "Melissa",
                "Brian", "Jennifer", "Andrew", "Elizabeth", "Jason", "Mary", "William", "Linda"};

        String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
                "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
                "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
                "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez"};

        String[] companies = {"Digital Marketing Co", "Social Media Agency", "Content Creators LLC",
                "Influence Network", "Online Promotions", "Marketing Masters",
                "Brand Ambassadors", "Growth Partners", "SEO Experts", "PPC Specialists",
                "Affiliate Hub", "Revenue Boosters", "Lead Generation Pro", "Conversion Kings"};

        String[] statuses = {"ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "PENDING", "SUSPENDED"};
        String[] paymentMethods = {"PayPal", "Bank Transfer", "Stripe", "Wire Transfer", "Crypto"};
        String[] sources = {"Website", "Social Media", "Email Campaign", "Referral", "Advertisement"};
        String[] products = {"premium", "basic", "enterprise", "pro", "starter", "business", "team"};
        String[] paths = {"signup", "register", "join", "get-started", "pricing", "plans"};


        for (Client client : clients) {
            int affiliatesPerClient = 8 + random.nextInt(12); // 8-20 affiliates per client

            for (int i = 0; i < affiliatesPerClient; i++) {
                String firstName = firstNames[random.nextInt(firstNames.length)];
                String lastName = lastNames[random.nextInt(lastNames.length)];
                String email = generateUniqueEmail(firstName.toLowerCase(), lastName.toLowerCase());
                String status = statuses[random.nextInt(statuses.length)];
                // Generate unique identifier
                String uniqueIdentifier = generateUniqueAffiliateIdentifier(
                        firstName, lastName, client, usedIdentifiers, i);
                usedIdentifiers.add(uniqueIdentifier);

                // Generate target URL for this affiliate
                String targetUrl = generateAffiliateTargetUrl(client, products, paths);

                Affiliate affiliate = Affiliate.builder()
                        .client(client)
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .companyName(random.nextBoolean() ? companies[random.nextInt(companies.length)] : null)
                        .phoneNumber("+1-555-" + String.format("%04d", random.nextInt(10000)))
                        .status(status)
                        .paymentMethod(paymentMethods[random.nextInt(paymentMethods.length)])
                        .paymentDetails(generatePaymentDetails())
                        .website(random.nextBoolean() ?
                                "https://" + firstName.toLowerCase() + lastName.toLowerCase() + ".com" : null)
                        .socialMediaLinks(generateSocialMediaLinks(firstName, lastName))
                        .notes(random.nextBoolean() ?
                                "High-performing affiliate in " + sources[random.nextInt(sources.length)] : null)
                        .referralCode(generateUniqueReferralCode(firstName, lastName))
                        .rejectionReason(status.equals("SUSPENDED") ?
                                "Fraudulent activity detected" : null)
                        .createdAt(LocalDateTime.now().minusDays(random.nextInt(200)))
                        .updatedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                        .uniqueIdentifier(uniqueIdentifier)
                        .targetUrl(targetUrl)
                        .build();

                affiliates.add(affiliate);
            }
        }

        return affiliateRepository.saveAll(affiliates);
    }

    private String generateUniqueAffiliateIdentifier(String firstName, String lastName,
                                                     Client client, Set<String> usedIdentifiers, int index) {
        String baseIdentifier = firstName.toLowerCase() + "_" +
                client.getCompanyName()
                        .toLowerCase()
                        .replaceAll("[^a-z0-9]", "")
                        .replace("solutions", "sol")
                        .replace("corporation", "corp")
                        .replace("company", "co")
                        .replace("technologies", "tech")
                        .replace("services", "svc");

        // Ensure max 45 characters to leave room for suffix
        if (baseIdentifier.length() > 45) {
            baseIdentifier = baseIdentifier.substring(0, 45);
        }

        String identifier = baseIdentifier;
        int suffix = 1;

        // Ensure uniqueness
        while (usedIdentifiers.contains(identifier)) {
            identifier = baseIdentifier + suffix;
            suffix++;
            if (identifier.length() > 50) {
                identifier = baseIdentifier.substring(0, 47) + suffix;
            }
        }

        return identifier;
    }

    private String generateAffiliateTargetUrl(Client client, String[] products, String[] paths) {
        String companyDomain = client.getCompanyName()
                .toLowerCase()
                .replaceAll("[^a-z0-9]", "")
                .replace("solutions", "sol")
                .replace("corporation", "corp")
                .replace("company", "co");

        String product = products[random.nextInt(products.length)];
        String path = paths[random.nextInt(paths.length)];

        return "https://" + companyDomain + ".com/" + path + "/" + product + "?utm_source=affiliate";
    }

    private List<Referral> createReferrals(List<Affiliate> affiliates) {
        log.info("Creating sample referrals...");

        List<Referral> referrals = new ArrayList<>();

        String[] statuses = {"PENDING", "CONVERTED", "CONVERTED", "CONVERTED", "REJECTED", "EXPIRED"};
        String[] deviceTypes = {"DESKTOP", "MOBILE", "TABLET"};
        String[] browsers = {"Chrome", "Firefox", "Safari", "Edge", "Opera"};
        String[] operatingSystems = {"Windows", "macOS", "Linux", "iOS", "Android"};
        String[] countries = {"USA", "Canada", "UK", "Germany", "France", "Australia", "Japan", "Brazil"};
        String[] cities = {"New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
                "San Antonio", "San Diego", "Dallas", "San Jose"};
        String[] sources = {"Google Ads", "Facebook", "Instagram", "Twitter", "YouTube", "Blog", "Email", "Direct"};

        for (Affiliate affiliate : affiliates) {
            int referralsPerAffiliate = 5 + random.nextInt(20); // 5-25 referrals per affiliate

            for (int i = 0; i < referralsPerAffiliate; i++) {
                String firstName = generateRandomFirstName();
                String lastName = generateRandomLastName();
                String email = generateUniqueEmail(firstName.toLowerCase(), lastName.toLowerCase());
                String status = statuses[random.nextInt(statuses.length)];

                LocalDateTime clickedAt = LocalDateTime.now().minusDays(random.nextInt(90));
                LocalDateTime convertedAt = status.equals("CONVERTED") && random.nextBoolean() ?
                        clickedAt.plusHours(random.nextInt(72)) : null;

                BigDecimal conversionValue = status.equals("CONVERTED") ?
                        BigDecimal.valueOf(50 + random.nextDouble() * 950).setScale(2, RoundingMode.HALF_UP) :
                        null;

                Referral referral = Referral.builder()
                        .client(affiliate.getClient())
                        .affiliate(affiliate)
                        .referralCode(affiliate.getReferralCode())
                        .targetUrl("https://" + affiliate.getClient().getCompanyName().toLowerCase()
                                .replace(" ", "") + ".com/product")
                        .sourceUrl("https://affiliate-site.com/promote/" + affiliate.getReferralCode())
                        .status(status)
                        .userAgent(generateUserAgent())
                        .ipAddress(generateIpAddress())
                        .deviceType(deviceTypes[random.nextInt(deviceTypes.length)])
                        .browserName(browsers[random.nextInt(browsers.length)])
                        .operatingSystem(operatingSystems[random.nextInt(operatingSystems.length)])
                        .country(countries[random.nextInt(countries.length)])
                        .city(cities[random.nextInt(cities.length)])
                        .conversionValue(conversionValue)
                        .orderId(status.equals("CONVERTED") ? "ORD-" + System.currentTimeMillis() + "-" + i : null)
                        .metadataJson("{\"campaign\":\"Q4-2024\",\"source\":\"affiliate\"}")
                        .clickedAt(clickedAt)
                        .convertedAt(convertedAt)
                        .customerName(firstName + " " + lastName)
                        .customerEmail(email)
                        .source(sources[random.nextInt(sources.length)])
                        .totalPaid(conversionValue != null ? conversionValue : BigDecimal.ZERO)
                        .purchaseCount(status.equals("CONVERTED") ? 1 + random.nextInt(5) : 0)
                        .lastPurchaseDate(convertedAt)
                        .createdAt(clickedAt)
                        .updatedAt(LocalDateTime.now().minusDays(random.nextInt(7)))
                        .build();

                referrals.add(referral);
            }
        }

        return referralRepository.saveAll(referrals);
    }

    private List<Commission> createCommissions(List<Affiliate> affiliates, List<Referral> referrals) {
        log.info("Creating sample commissions...");

        List<Commission> commissions = new ArrayList<>();

        String[] statuses = {"PAID", "PAID", "PAID", "PENDING", "PENDING", "FAILED"};
        String[] types = {"SALE", "LEAD", "SUBSCRIPTION", "RENEWAL", "SIGNUP"};
        String[] currencies = {"USD", "EUR", "GBP", "CAD"};

        // Group referrals by affiliate for easier processing
        Map<Long, List<Referral>> referralsByAffiliate = new HashMap<>();
        for (Referral referral : referrals) {
            referralsByAffiliate.computeIfAbsent(referral.getAffiliate().getId(), k -> new ArrayList<>())
                    .add(referral);
        }

        for (Affiliate affiliate : affiliates) {
            List<Referral> affiliateReferrals = referralsByAffiliate.get(affiliate.getId());
            if (affiliateReferrals == null) continue;

            // Create commissions for converted referrals
            List<Referral> convertedReferrals = affiliateReferrals.stream()
                    .filter(r -> "CONVERTED".equals(r.getStatus()))
                    .toList();

            for (Referral referral : convertedReferrals) {
                if (referral.getConversionValue() != null) {
                    BigDecimal percentage = BigDecimal.valueOf(5 + random.nextDouble() * 15) // 5-20%
                            .setScale(2, RoundingMode.HALF_UP);

                    BigDecimal commissionAmount = referral.getConversionValue()
                            .multiply(percentage.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                            .setScale(2, RoundingMode.HALF_UP);

                    String status = statuses[random.nextInt(statuses.length)];
                    LocalDateTime earnedAt = LocalDateTime.now();
                    LocalDateTime paidAt = status.equals("PAID") && random.nextBoolean() ?
                            earnedAt.plusDays(random.nextInt(30)) : null;

                    Commission commission = Commission.builder()
                            .affiliate(affiliate)
                            .referralId(referral.getId())
                            .amount(commissionAmount)
                            .percentage(percentage)
                            .currency(currencies[random.nextInt(currencies.length)])
                            .status(status)
                            .type(types[random.nextInt(types.length)])
                            .description("Commission for " + referral.getCustomerName() +
                                    " purchase (" + referral.getOrderId() + ")")
                            .earnedAt(earnedAt)
                            .paidAt(paidAt)
                            .createdAt(earnedAt)
                            .updatedAt(paidAt != null ? paidAt : LocalDateTime.now().minusDays(random.nextInt(7)))
                            .build();

                    commissions.add(commission);
                }
            }
        }

        return commissionRepository.saveAll(commissions);
    }

    private void createPayments(List<Affiliate> affiliates, List<Commission> commissions) {
        log.info("Creating sample payments...");

        List<Payment> payments = new ArrayList<>();

        String[] statuses = {"COMPLETED", "COMPLETED", "COMPLETED", "PENDING", "FAILED", "PROCESSING"};
        String[] paymentMethods = {"PayPal", "Bank Transfer", "Stripe", "Wire Transfer", "Crypto", "Check"};
        String[] currencies = {"USD", "EUR", "GBP", "CAD"};

        // Group commissions by affiliate
        Map<Long, List<Commission>> commissionsByAffiliate = new HashMap<>();
        for (Commission commission : commissions) {
            commissionsByAffiliate.computeIfAbsent(commission.getAffiliate().getId(), k -> new ArrayList<>())
                    .add(commission);
        }

        for (Affiliate affiliate : affiliates) {
            List<Commission> affiliateCommissions = commissionsByAffiliate.get(affiliate.getId());
            if (affiliateCommissions == null) continue;

            // Create payments for paid commissions
            List<Commission> paidCommissions = affiliateCommissions.stream()
                    .filter(c -> "PAID".equals(c.getStatus()))
                    .toList();

            if (!paidCommissions.isEmpty()) {
                // Group payments by month to create batch payments
                Map<String, List<Commission>> commissionsByMonth = new HashMap<>();
                for (Commission commission : paidCommissions) {
                    String monthKey = commission.getEarnedAt().getYear() + "-" +
                            commission.getEarnedAt().getMonthValue();
                    commissionsByMonth.computeIfAbsent(monthKey, k -> new ArrayList<>())
                            .add(commission);
                }

                for (List<Commission> monthlyCommissions : commissionsByMonth.values()) {
                    BigDecimal totalAmount = monthlyCommissions.stream()
                            .map(Commission::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    String status = statuses[random.nextInt(statuses.length)];
                    LocalDateTime createdAt = LocalDateTime.now().minusDays(random.nextInt(60));
                    LocalDateTime processedAt = status.equals("COMPLETED") ?
                            LocalDateTime.now().plusDays(random.nextInt(3)) : null;

                    Payment payment = Payment.builder()
                            .affiliate(affiliate)
                            .amount(totalAmount)
                            .currency(currencies[random.nextInt(currencies.length)])
                            .paymentMethod(paymentMethods[random.nextInt(paymentMethods.length)])
                            .status(status)
                            .transactionId(generateUniqueTransactionId())
                            .description("Monthly commission payment for " + monthlyCommissions.size() + " referrals")
                            .cancellationReason(status.equals("FAILED") ?
                                    "Insufficient funds" : null)
                            .processedAt(processedAt)
                            .createdAt(createdAt)
                            .updatedAt(processedAt != null ? processedAt : LocalDateTime.now().minusDays(random.nextInt(7)))
                            .build();

                    payments.add(payment);
                }
            }

            // Add some additional standalone payments for variety
            if (random.nextBoolean() && !affiliateCommissions.isEmpty()) {
                String status = statuses[random.nextInt(statuses.length)];
                LocalDateTime createdAt = LocalDateTime.now().minusDays(random.nextInt(60));
                LocalDateTime processedAt = createdAt.plusDays(random.nextInt(5));

                Payment bonusPayment = Payment.builder()
                        .affiliate(affiliate)
                        .amount(BigDecimal.valueOf(100 + random.nextDouble() * 400).setScale(2, RoundingMode.HALF_UP))
                        .currency("USD")
                        .paymentMethod(paymentMethods[random.nextInt(paymentMethods.length)])
                        .status(status)
                        .transactionId(generateUniqueTransactionId())
                        .description("Bonus payment for exceptional performance")
                        .cancellationReason(status.equals("FAILED") ?
                                "Account verification required" : null)
                        .processedAt(processedAt)
                        .createdAt(createdAt)
                        .updatedAt(processedAt)
                        .build();

                payments.add(bonusPayment);
            }
        }

        paymentRepository.saveAll(payments);
    }

    private String generateUniqueEmail(String prefix, String suffix) {
        String baseEmail;
        int counter = 0;

        do {
            if (counter == 0) {
                baseEmail = prefix + "." + suffix + "@example.com";
            } else {
                baseEmail = prefix + "." + suffix + counter + "@example.com";
            }
            counter++;
        } while (usedEmails.contains(baseEmail));

        usedEmails.add(baseEmail);
        return baseEmail;
    }

    private String generateUniqueReferralCode(String firstName, String lastName) {
        String baseCode;
        int counter = 0;

        do {
            if (counter == 0) {
                baseCode = firstName.substring(0, Math.min(3, firstName.length())).toUpperCase() +
                        lastName.substring(0, Math.min(3, lastName.length())).toUpperCase() +
                        String.format("%03d", random.nextInt(1000));
            } else {
                baseCode = firstName.substring(0, Math.min(3, firstName.length())).toUpperCase() +
                        lastName.substring(0, Math.min(3, lastName.length())).toUpperCase() +
                        String.format("%03d", random.nextInt(1000)) + counter;
            }
            counter++;
        } while (usedReferralCodes.contains(baseCode));

        usedReferralCodes.add(baseCode);
        return baseCode;
    }

    private String generateUniqueTransactionId() {
        String transactionId;
        int counter = 0;

        do {
            transactionId = "TXN-" + System.currentTimeMillis() + "-" +
                    String.format("%04d", random.nextInt(10000)) +
                    (counter > 0 ? "-" + counter : "");
            counter++;
        } while (usedTransactionIds.contains(transactionId));

        usedTransactionIds.add(transactionId);
        return transactionId;
    }

    private String generatePaymentDetails() {
        String[] cardTypes = {"Visa", "MasterCard", "American Express"};
        String cardType = cardTypes[random.nextInt(cardTypes.length)];
        return cardType + " **** **** **** " + String.format("%04d", random.nextInt(10000));
    }

    private String generateSocialMediaLinks(String firstName, String lastName) {
        List<String> links = new ArrayList<>();
        if (random.nextBoolean()) links.add("https://twitter.com/" + firstName.toLowerCase() + lastName.toLowerCase());
        if (random.nextBoolean()) links.add("https://linkedin.com/in/" + firstName.toLowerCase() + "-" + lastName.toLowerCase());
        if (random.nextBoolean()) links.add("https://instagram.com/" + firstName.toLowerCase() + lastName.toLowerCase());
        return String.join(", ", links);
    }

    private String generateUserAgent() {
        String[] userAgents = {
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15"
        };
        return userAgents[random.nextInt(userAgents.length)];
    }

    private String generateIpAddress() {
        return (1 + random.nextInt(254)) + "." +
                (1 + random.nextInt(254)) + "." +
                (1 + random.nextInt(254)) + "." +
                (1 + random.nextInt(254));
    }

    private String getRandomCity() {
        String[] cities = {"New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
                "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville"};
        return cities[random.nextInt(cities.length)];
    }

    private String generateRandomFirstName() {
        String[] names = {"James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
                "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica"};
        return names[random.nextInt(names.length)];
    }

    private String generateRandomLastName() {
        String[] names = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas"};
        return names[random.nextInt(names.length)];
    }
}