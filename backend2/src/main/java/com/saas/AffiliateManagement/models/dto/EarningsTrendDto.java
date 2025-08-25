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
public class EarningsTrendDto {
    private Long affiliateId;
    private String affiliateName;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private BigDecimal totalDesktop;
    private BigDecimal totalMobile;
    private BigDecimal totalEarnings;
    private BigDecimal growthRate;
    private List<EarningsDataDto> data;
}
