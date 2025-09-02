package com.saas.AffiliateManagement;

import com.saas.AffiliateManagement.controller.ReferralRedirectController;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.service.ReferralRedirectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.LocalDateTime;

@SpringBootTest
public class ManualControllerTest {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AffiliateRepository affiliateRepository;

    @Autowired
    private ReferralRedirectService referralRedirectService;

    @Autowired
    private ReferralRedirectController referralRedirectController;

    @Test
    void testRedirectControllerDirectly() throws Exception {
        // Create test data
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

        Affiliate testAffiliate = Affiliate.builder()
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

        // Test the controller directly
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("User-Agent", "Mozilla/5.0 Test Browser");
        request.addHeader("Referer", "https://google.com");
        request.setRemoteAddr("127.0.0.1");

        MockHttpServletResponse response = new MockHttpServletResponse();

        System.out.println("Testing with affiliate: " + testAffiliate.getUniqueIdentifier());

        // Call controller method directly
        referralRedirectController.redirectAffiliate(
                testAffiliate.getUniqueIdentifier(),
                "test_campaign",
                request,
                response
        );

        System.out.println("Response status: " + response.getStatus());
        System.out.println("Response headers: " + response.getHeaderNames());
        System.out.println("Redirect location: " + response.getRedirectedUrl());
    }
}