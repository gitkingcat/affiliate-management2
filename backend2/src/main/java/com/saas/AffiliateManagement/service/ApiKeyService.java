package com.saas.AffiliateManagement.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiKeyService {

    public List<String> generateApiKeys(Long clientId) {
        String apiKey = "ak_" + UUID.randomUUID().toString().replace("-", "");
        String secretKey = "sk_" + UUID.randomUUID().toString().replace("-", "");

        log.info("Generated API keys for client: {}", clientId);

        return List.of(apiKey, secretKey);
    }

    public void revokeExistingKeys(Long clientId) {
        log.info("Revoked existing API keys for client: {}", clientId);
    }
}