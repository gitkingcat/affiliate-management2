package com.saas.AffiliateManagement.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopLocation {
    private String country;
    private String city;
    private Long clicks;
    private Long conversions;
    private BigDecimal revenue;
}