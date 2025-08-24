package com.saas.AffiliateManagement.models.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralUpdateRequest {

    @Size(max = 2000, message = "Target URL cannot exceed 2000 characters")
    private String targetUrl;

    @Size(max = 2000, message = "Source URL cannot exceed 2000 characters")
    private String sourceUrl;

    @Size(max = 20, message = "Status cannot exceed 20 characters")
    private String status;

    private BigDecimal conversionValue;

    @Size(max = 100, message = "Order ID cannot exceed 100 characters")
    private String orderId;

    private Map<String, Object> metadata;
}