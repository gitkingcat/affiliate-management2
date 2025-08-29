package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralCustomerDTO {

    private Long id;
    private String customerName;
    private String customerEmail;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private BigDecimal totalPaid;
    private BigDecimal totalCommission;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastPurchaseDate;
    private Integer purchaseCount;
    private String referralCode;
    private String source;
}
