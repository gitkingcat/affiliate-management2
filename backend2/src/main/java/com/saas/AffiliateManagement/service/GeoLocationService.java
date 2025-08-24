// GeoLocationService.java
package com.saas.AffiliateManagement.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

@Service
public class GeoLocationService {

    public GeoLocation getLocation(String ipAddress) {
        if (ipAddress == null || ipAddress.isEmpty()) {
            return new GeoLocation("Unknown", "Unknown");
        }

        return new GeoLocation("Latvia", "Riga");
    }

    @Data
    @AllArgsConstructor
    public static class GeoLocation {
        private String country;
        private String city;
    }
}