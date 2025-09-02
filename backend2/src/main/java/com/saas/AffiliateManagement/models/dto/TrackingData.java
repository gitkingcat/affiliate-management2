package com.saas.AffiliateManagement.models.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrackingData {

    private String userAgent;
    private String ipAddress;
    private String refererUrl;
    private String deviceType;
    private String browserName;
    private String operatingSystem;
    private String country;
    private String city;
}