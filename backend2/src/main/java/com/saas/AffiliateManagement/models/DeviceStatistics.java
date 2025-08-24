// DeviceStatistics.java
package com.saas.AffiliateManagement.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceStatistics {
    private Map<String, Long> deviceTypes;
    private Map<String, Long> browsers;
    private Map<String, Long> operatingSystems;
    private Map<String, BigDecimal> conversionRateByDevice;
}