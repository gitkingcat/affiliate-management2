package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.ReferralTrackingInfo;
import com.saas.AffiliateManagement.models.dto.TrackingData;

public interface ReferralRedirectService {

    String processReferralClick(String affiliateIdentifier, String campaign, TrackingData trackingData);

    ReferralTrackingInfo getTrackingInfo(String referralCode);
}