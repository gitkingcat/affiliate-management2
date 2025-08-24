// ReferralTrackingResponse.java
package com.saas.AffiliateManagement.models.responses;

import com.saas.AffiliateManagement.models.DeviceStatistics;
import com.saas.AffiliateManagement.models.GeographicStatistics;
import com.saas.AffiliateManagement.models.TopPerformingLink;
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
public class ReferralTrackingResponse {
    private Long affiliateId;
    private String affiliateName;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private Long totalClicks;
    private Long totalConversions;
    private BigDecimal conversionRate;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
    private Long uniqueVisitors;
    private Map<String, Long> clicksByDay;
    private Map<String, Long> conversionsByDay;
    private List<TopPerformingLink> topLinks;
    private Map<String, BigDecimal> revenueBySource;
    private DeviceStatistics deviceStats;
    private GeographicStatistics geoStats;
}