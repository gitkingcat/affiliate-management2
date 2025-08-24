package com.saas.AffiliateManagement.models.dto;

import com.saas.AffiliateManagement.models.ConversionTrend;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversionRateDto {
    private Long affiliateId;
    private String period;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal overallConversionRate;
    private Map<String, BigDecimal> conversionRateByPeriod;
    private Map<String, Long> clicksByPeriod;
    private Map<String, Long> conversionsByPeriod;
    private Map<String, BigDecimal> revenueByPeriod;
    private List<ConversionTrend> trends;
    private BigDecimal projectedRevenue;
    private BigDecimal growthRate;
}