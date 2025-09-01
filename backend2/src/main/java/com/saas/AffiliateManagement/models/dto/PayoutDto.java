package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayoutDto {

    private Long id;
    private LocalDateTime createdAt;
    private String partnerName;
    private String email;
    private String method;
    private LocalDate commissionStart;
    private LocalDate commissionEnd;
    private BigDecimal amount;
    private String status;
}