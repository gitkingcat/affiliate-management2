package com.saas.AffiliateManagement.config;

import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.models.entity.Payout;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.repository.PayoutRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class PayoutDataInitializer {

    private final Random random = new Random();

    @Bean
    CommandLineRunner initPayoutData(
            PayoutRepository payoutRepository,
            AffiliateRepository affiliateRepository,
            ClientRepository clientRepository) {

        return args -> {
            if (payoutRepository.count() == 0) {
                log.info("Initializing payout data...");

                Client client = createOrGetClient(clientRepository);
                List<Affiliate> affiliates = createOrGetAffiliates(affiliateRepository, client);
                List<Payout> payouts = createPayouts(affiliates);

                payoutRepository.saveAll(payouts);
                log.info("Created {} payout records", payouts.size());
            }
        };
    }

    private Client createOrGetClient(ClientRepository clientRepository) {
        return clientRepository.findAll().stream().findFirst()
                .orElseGet(() -> clientRepository.save(Client.builder()
                        .companyName("TechCorp Solutions")
                        .email("admin@techcorp.com")
                        .contactFirstName("John")
                        .contactLastName("Smith")
                        .phoneNumber("+1-555-0100")
                        .website("https://techcorp.com")
                        .address("123 Tech Street")
                        .city("San Francisco")
                        .country("USA")
                        .postalCode("94105")
                        .industry("Technology")
                        .companySize("100-500")
                        .status("ACTIVE")
                        .subscriptionPlan("PROFESSIONAL")
                        .emailVerified(true)
                        .emailVerifiedAt(LocalDateTime.now().minusMonths(6))
                        .createdAt(LocalDateTime.now().minusMonths(6))
                        .updatedAt(LocalDateTime.now())
                        .build()));
    }

    private List<Affiliate> createOrGetAffiliates(
            AffiliateRepository affiliateRepository,
            Client client) {

        List<Affiliate> existingAffiliates = affiliateRepository.findByClientId(
                client.getId(), null).getContent();

        if (!existingAffiliates.isEmpty()) {
            return existingAffiliates;
        }

        List<Affiliate> affiliates = List.of(
                createAffiliate(client, "Sarah", "Johnson", "sarah.johnson@email.com",
                        "PayPal", "sarah@paypal.com", "ACTIVE"),
                createAffiliate(client, "Michael", "Chen", "michael.chen@email.com",
                        "Wire", "ACC-12345678", "ACTIVE"),
                createAffiliate(client, "Emma", "Wilson", "emma.wilson@email.com",
                        "Wise", "emma.wise@email.com", "ACTIVE"),
                createAffiliate(client, "James", "Anderson", "james.anderson@email.com",
                        "Crypto", "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", "ACTIVE"),
                createAffiliate(client, "Olivia", "Martinez", "olivia.martinez@email.com",
                        "PayPal", "olivia@paypal.com", "SUSPENDED")
        );

        return affiliateRepository.saveAll(affiliates);
    }

    private Affiliate createAffiliate(Client client, String firstName,
                                      String lastName, String email, String paymentMethod,
                                      String paymentDetails, String status) {

        return Affiliate.builder()
                .client(client)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .companyName(firstName + "'s Marketing Agency")
                .phoneNumber("+1-555-" + String.format("%04d", random.nextInt(10000)))
                .status(status)
                .paymentMethod(paymentMethod)
                .paymentDetails(paymentDetails)
                .website("https://" + firstName.toLowerCase() + "-marketing.com")
                .referralCode(firstName.toUpperCase() + random.nextInt(1000))
                .createdAt(LocalDateTime.now().minusMonths(random.nextInt(12) + 1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private List<Payout> createPayouts(List<Affiliate> affiliates) {
        List<Payout> payouts = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();

        String[] statuses = {"pending", "processing", "completed", "failed", "cancelled"};
        String[] methods = {"PayPal", "Wire", "Wise", "Crypto", "ACH"};

        for (Affiliate affiliate : affiliates) {
            int payoutCount = random.nextInt(8) + 3;

            for (int i = 0; i < payoutCount; i++) {
                LocalDate commissionEnd = currentDate.minusMonths(i);
                LocalDate commissionStart = commissionEnd.minusMonths(1).plusDays(1);

                String status = i == 0 ? "pending" :
                        statuses[random.nextInt(statuses.length)];

                BigDecimal baseAmount = BigDecimal.valueOf(
                        500 + random.nextDouble() * 4500);
                BigDecimal amount = baseAmount.setScale(2, BigDecimal.ROUND_HALF_UP);

                Payout payout = Payout.builder()
                        .affiliate(affiliate)
                        .method(affiliate.getPaymentMethod())
                        .commissionStart(commissionStart)
                        .commissionEnd(commissionEnd)
                        .amount(amount)
                        .status(status)
                        .transactionId(generateTransactionId(status))
                        .paymentReference(generatePaymentReference(affiliate, i))
                        .notes(generateNotes(status, amount))
                        .processedAt(status.equals("completed") ?
                                LocalDateTime.now().minusMonths(i).minusDays(random.nextInt(5)) : null)
                        .createdAt(LocalDateTime.now().minusMonths(i))
                        .updatedAt(LocalDateTime.now().minusMonths(i).plusDays(random.nextInt(3)))
                        .build();

                payouts.add(payout);
            }
        }

        return payouts;
    }

    private String generateTransactionId(String status) {
        if (status.equals("pending") || status.equals("cancelled")) {
            return null;
        }
        return "TXN-" + System.currentTimeMillis() + "-" + random.nextInt(10000);
    }

    private String generatePaymentReference(Affiliate affiliate, int index) {
        return String.format("PAY-%s-%d-%04d",
                affiliate.getFirstName().substring(0, 3).toUpperCase(),
                LocalDate.now().getYear(),
                random.nextInt(10000));
    }

    private String generateNotes(String status, BigDecimal amount) {
        switch (status) {
            case "completed":
                return "Payment processed successfully. Amount: $" + amount;
            case "failed":
                return "Payment failed due to insufficient funds or invalid account details";
            case "cancelled":
                return "Payment cancelled by administrator";
            case "processing":
                return "Payment is being processed by the payment provider";
            case "pending":
                return "Awaiting approval for payout amount: $" + amount;
            default:
                return null;
        }
    }
}