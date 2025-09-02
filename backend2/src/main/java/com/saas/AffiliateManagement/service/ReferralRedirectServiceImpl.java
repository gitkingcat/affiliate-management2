package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.exceptions.AffiliateNotFoundException;
import com.saas.AffiliateManagement.exceptions.ReferralNotFoundException;
import com.saas.AffiliateManagement.models.dto.ReferralTrackingInfo;
import com.saas.AffiliateManagement.models.dto.TrackingData;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Referral;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.ReferralRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReferralRedirectServiceImpl implements ReferralRedirectService {

    private final AffiliateRepository affiliateRepository;
    private final ReferralRepository referralRepository;

    @Override
    @Transactional
    public String processReferralClick(String affiliateIdentifier, String campaign, TrackingData trackingData) {

        Affiliate affiliate = findAffiliateByIdentifier(affiliateIdentifier);

        if (!isAffiliateActive(affiliate)) {
            log.warn("Inactive affiliate attempted access: {}", affiliateIdentifier);
            throw new AffiliateNotFoundException("Affiliate is not active: " + affiliateIdentifier);
        }

        String referralCode = generateUniqueReferralCode();

        Referral referral = createReferralRecord(affiliate, referralCode, campaign, trackingData);

        referralRepository.save(referral);

        log.info("Created referral tracking record: {} for affiliate: {}", referralCode, affiliate.getId());

        return buildRedirectUrl(affiliate, referralCode, campaign);
    }

    @Override
    @Transactional(readOnly = true)
    public ReferralTrackingInfo getTrackingInfo(String referralCode) {

        Referral referral = referralRepository.findByReferralCode(referralCode)
                .orElseThrow(() -> new ReferralNotFoundException("Referral not found: " + referralCode));

        return buildTrackingInfo(referral);
    }

    private Affiliate findAffiliateByIdentifier(String identifier) {
        return affiliateRepository.findByUniqueIdentifier(identifier)
                .or(() -> affiliateRepository.findById(parseIdIfNumeric(identifier)))
                .orElseThrow(() -> new AffiliateNotFoundException("Affiliate not found: " + identifier));
    }

    private Long parseIdIfNumeric(String identifier) {
        try {
            return Long.parseLong(identifier);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private boolean isAffiliateActive(Affiliate affiliate) {
        return "ACTIVE".equalsIgnoreCase(affiliate.getStatus());
    }

    private String generateUniqueReferralCode() {
        String code;
        int attempts = 0;
        do {
            code = "REF_" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
            attempts++;
        } while (referralRepository.existsByReferralCode(code) && attempts < 5);

        if (attempts >= 5) {
            code = "REF_" + System.currentTimeMillis();
        }

        return code;
    }

    private Referral createReferralRecord(Affiliate affiliate, String referralCode,
                                          String campaign, TrackingData trackingData) {

        return Referral.builder()
                .affiliate(affiliate)
                .client(affiliate.getClient())
                .referralCode(referralCode)
                .targetUrl(affiliate.getTargetUrl())
                .sourceUrl(trackingData.getRefererUrl())
                .status("CLICKED")
                .userAgent(trackingData.getUserAgent())
                .ipAddress(trackingData.getIpAddress())
                .deviceType(trackingData.getDeviceType())
                .browserName(trackingData.getBrowserName())
                .operatingSystem(trackingData.getOperatingSystem())
                .country(trackingData.getCountry())
                .city(trackingData.getCity())
                .clickedAt(LocalDateTime.now())
                .customerEmail(affiliate.getEmail())
                .customerName(affiliate.getClient().getName())
                .source(campaign)
                .build();
    }

    private String buildRedirectUrl(Affiliate affiliate, String referralCode, String campaign) {

        String baseUrl = affiliate.getTargetUrl();

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("ref", referralCode)
                .queryParam("affiliate", affiliate.getUniqueIdentifier());

        if (campaign != null && !campaign.trim().isEmpty()) {
            builder.queryParam("campaign", campaign);
        }

        return builder.build().toUriString();
    }

    private ReferralTrackingInfo buildTrackingInfo(Referral referral) {

        TrackingData trackingData = TrackingData.builder()
                .userAgent(referral.getUserAgent())
                .ipAddress(referral.getIpAddress())
                .refererUrl(referral.getSourceUrl())
                .deviceType(referral.getDeviceType())
                .browserName(referral.getBrowserName())
                .operatingSystem(referral.getOperatingSystem())
                .country(referral.getCountry())
                .city(referral.getCity())
                .build();

        return ReferralTrackingInfo.builder()
                .referralCode(referral.getReferralCode())
                .affiliateId(referral.getAffiliate().getUniqueIdentifier())
                .affiliateName(referral.getAffiliate().getFirstName() + " " + referral.getAffiliate().getLastName())
                .clientName(referral.getClient().getCompanyName())
                .status(referral.getStatus())
                .targetUrl(referral.getTargetUrl())
                .campaign(referral.getSource())
                .clickedAt(referral.getClickedAt())
                .convertedAt(referral.getConvertedAt())
                .conversionValue(referral.getConversionValue())
                .customerEmail(referral.getCustomerEmail())
                .trackingData(trackingData)
                .build();
    }
}