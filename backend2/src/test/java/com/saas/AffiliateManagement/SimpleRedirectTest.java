package com.saas.AffiliateManagement;

import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.repository.ReferralRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class SimpleRedirectTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AffiliateRepository affiliateRepository;

    @Autowired
    private ReferralRepository referralRepository;

    private Affiliate testAffiliate;

    @BeforeEach
    void setUp() {
        createTestData();
    }

    @Test
    void testRedirectAffiliate_Success() throws Exception {
        System.out.println("Testing affiliate: " + testAffiliate.getUniqueIdentifier());
        System.out.println("Target URL: " + testAffiliate.getTargetUrl());

        mockMvc.perform(get("/r/{affiliateIdentifier}", testAffiliate.getUniqueIdentifier())
                        .header("User-Agent", "Mozilla/5.0 Test Browser")
                        .header("Referer", "https://google.com"))
                .andDo(print()); // Just print everything, don't expect anything yet

        // Check what was created in database
        long referralCount = referralRepository.count();
        System.out.println("Referrals created: " + referralCount);
    }

    private void createTestData() {
        Client testClient = Client.builder()
                .companyName("Test Company")
                .name("test-company")
                .email("test@company.com")
                .contactFirstName("John")
                .contactLastName("Doe")
                .status("ACTIVE")
                .subscriptionPlan("PRO")
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .build();

        testClient = clientRepository.save(testClient);

        testAffiliate = Affiliate.builder()
                .client(testClient)
                .uniqueIdentifier("john_testco")
                .email("john@affiliate.com")
                .firstName("John")
                .lastName("Smith")
                .status("ACTIVE")
                .targetUrl("https://testclient.com/product/premium")
                .createdAt(LocalDateTime.now())
                .build();

        testAffiliate = affiliateRepository.save(testAffiliate);

        System.out.println("Created test affiliate with ID: " + testAffiliate.getId());
        System.out.println("Unique identifier: " + testAffiliate.getUniqueIdentifier());
    }
}