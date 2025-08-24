package com.saas.AffiliateManagement.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
public class DeviceDetector {

    public DeviceInfo detectDevice(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return new DeviceInfo("Unknown", "Unknown", "Unknown");
        }

        String deviceType = detectDeviceType(userAgent);
        String browserName = detectBrowser(userAgent);
        String operatingSystem = detectOS(userAgent);

        return new DeviceInfo(deviceType, browserName, operatingSystem);
    }

    private String detectDeviceType(String userAgent) {
        if (userAgent.contains("Mobile") || userAgent.contains("Android")) {
            return "Mobile";
        } else if (userAgent.contains("Tablet") || userAgent.contains("iPad")) {
            return "Tablet";
        }
        return "Desktop";
    }

    private String detectBrowser(String userAgent) {
        if (userAgent.contains("Chrome")) return "Chrome";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("Safari")) return "Safari";
        if (userAgent.contains("Edge")) return "Edge";
        return "Other";
    }

    private String detectOS(String userAgent) {
        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Mac")) return "macOS";
        if (userAgent.contains("Linux")) return "Linux";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iOS")) return "iOS";
        return "Other";
    }

    @Data
    @AllArgsConstructor
    public static class DeviceInfo {
        private String deviceType;
        private String browserName;
        private String operatingSystem;
    }
}