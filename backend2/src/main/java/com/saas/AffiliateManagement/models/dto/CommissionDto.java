// CommissionDto.java
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
public class CommissionDto {
    private Long id;
    private Long affiliateId;
    private String affiliateName;
    private Long referralId;
    private String referralCode;
    private BigDecimal amount;
    private BigDecimal percentage;
    private String currency;
    private String status;
    private String type;
    private String description;
    private LocalDateTime earnedAt;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}