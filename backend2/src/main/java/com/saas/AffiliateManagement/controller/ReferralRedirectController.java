package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.models.dto.ReferralTrackingInfo;
import com.saas.AffiliateManagement.models.dto.TrackingData;
import com.saas.AffiliateManagement.service.ReferralRedirectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/r")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Referral Redirect", description = "Affiliate referral redirect endpoints")
public class ReferralRedirectController {

    private final ReferralRedirectService referralRedirectService;

    @GetMapping("/{affiliateIdentifier}")
    @Operation(
            summary = "Redirect affiliate referral",
            description = "Handles affiliate referral clicks and redirects to client service with tracking"
    )
    public void redirectAffiliate(
            @PathVariable
            @Parameter(description = "Our generated affiliate unique identifier")
            String affiliateIdentifier,

            @RequestParam(required = false)
            @Parameter(description = "Campaign or source identifier")
            String campaign,

            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

        log.info("Processing referral redirect for affiliate: {}", affiliateIdentifier);

        String redirectUrl = referralRedirectService.processReferralClick(
                affiliateIdentifier,
                campaign,
                extractTrackingData(request)
        );

        log.info("Redirecting to: {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/track/{referralCode}")
    @Operation(
            summary = "Get referral tracking info",
            description = "Retrieves tracking information for a referral code"
    )
    public ReferralTrackingInfo getTrackingInfo(
            @PathVariable String referralCode) {

        return referralRedirectService.getTrackingInfo(referralCode);
    }

    private TrackingData extractTrackingData(HttpServletRequest request) {
        return TrackingData.builder()
                .userAgent(request.getHeader("User-Agent"))
                .ipAddress(getClientIpAddress(request))
                .refererUrl(request.getHeader("Referer"))
                .build();
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}