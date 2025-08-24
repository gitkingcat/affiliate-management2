package com.saas.AffiliateManagement.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeographicStatistics {
    private Map<String, Long> clicksByCountry;
    private Map<String, Long> conversionsByCountry;
    private Map<String, BigDecimal> revenueByCountry;
    private List<TopLocation> topLocations;
}