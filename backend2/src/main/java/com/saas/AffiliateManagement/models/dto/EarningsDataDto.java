package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EarningsDataDto {
    private String period;
    private BigDecimal desktop;
    private BigDecimal mobile;
    private BigDecimal total;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
}

