package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.ConversionRateDto;
import com.saas.AffiliateManagement.models.dto.ReferralCustomerDTO;
import com.saas.AffiliateManagement.models.dto.ReferralDto;
import com.saas.AffiliateManagement.models.requests.ReferralCreateRequest;
import com.saas.AffiliateManagement.models.requests.ReferralUpdateRequest;
import com.saas.AffiliateManagement.models.responses.ReferralTrackingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ReferralService {

    ReferralDto trackReferral(ReferralCreateRequest createRequest,
                              String userAgent, String ipAddress);

    ReferralDto getReferralById(Long referralId);

    ReferralDto getReferralByCode(String referralCode);

    Page<ReferralDto> searchReferrals(Optional<String> status,
                                      Optional<Long> affiliateId,
                                      Optional<String> referralCode,
                                      Pageable pageable);

    Page<ReferralDto> getReferralsByAffiliateId(Long affiliateId,
                                                Optional<String> status,
                                                Optional<LocalDateTime> startDate,
                                                Optional<LocalDateTime> endDate,
                                                Pageable pageable);

    ReferralDto updateReferral(Long referralId,
                               ReferralUpdateRequest updateRequest);

    void deleteReferral(Long referralId);

    ReferralDto convertReferral(Long referralId,
                                BigDecimal conversionValue,
                                Optional<String> orderId);

    ReferralDto cancelConversion(Long referralId);

    ReferralDto expireReferral(Long referralId);

    ReferralTrackingResponse getReferralStatistics(Long affiliateId,
                                                   Optional<LocalDateTime> startDate,
                                                   Optional<LocalDateTime> endDate);

    List<ReferralDto> getTopPerformingReferrals(Long affiliateId,
                                                Integer limit,
                                                Optional<LocalDateTime> startDate,
                                                Optional<LocalDateTime> endDate);

    ConversionRateDto getConversionRateAnalytics(Long affiliateId,
                                                 String period,
                                                 Optional<LocalDateTime> startDate,
                                                 Optional<LocalDateTime> endDate);

    BigDecimal calculateTotalRevenueForAffiliate(Long affiliateId,
                                                 LocalDateTime startDate,
                                                 LocalDateTime endDate);

    Page<ReferralDto> getPendingConversions(Optional<Long> affiliateId,
                                            Optional<Integer> daysOld,
                                            Pageable pageable);

    List<ReferralDto> trackBatchReferrals(List<ReferralCreateRequest> createRequests,
                                          String userAgent,
                                          String ipAddress);

    Map<String, Object> getReferralTrends(Integer days,
                                          Optional<Long> affiliateId);

    Map<String, Long> getReferralSourceAnalytics(Optional<Long> affiliateId,
                                                 Optional<LocalDateTime> startDate,
                                                 Optional<LocalDateTime> endDate);

    Page<ReferralCustomerDTO> searchReferralCustomersByClient(Long clientId, String search, Pageable pageable);

    Page<ReferralCustomerDTO> getReferralCustomersByClient(Long clientId, Pageable pageable);
}