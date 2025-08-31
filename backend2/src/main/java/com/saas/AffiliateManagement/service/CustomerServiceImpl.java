package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.exceptions.InvalidReferralDataException;
import com.saas.AffiliateManagement.exceptions.ReferralNotFoundException;
import com.saas.AffiliateManagement.models.*;
import com.saas.AffiliateManagement.models.dto.ConversionRateDto;
import com.saas.AffiliateManagement.models.dto.PaymentDto;
import com.saas.AffiliateManagement.models.dto.ReferralCustomerDTO;
import com.saas.AffiliateManagement.models.dto.ReferralDto;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Payment;
import com.saas.AffiliateManagement.models.entity.Referral;
import com.saas.AffiliateManagement.models.requests.ReferralCreateRequest;
import com.saas.AffiliateManagement.models.requests.ReferralUpdateRequest;
import com.saas.AffiliateManagement.models.responses.ReferralTrackingResponse;
import com.saas.AffiliateManagement.repository.AffiliateRepository;

import com.saas.AffiliateManagement.repository.PaymentRepository;
import com.saas.AffiliateManagement.repository.ReferralRepository;
import com.saas.AffiliateManagement.service.mappers.ReferralMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final ReferralRepository referralRepository;
    private final AffiliateRepository affiliateRepository;
    private final ReferralMapper referralMapper;
    private final DeviceDetector deviceDetector;
    private final GeoLocationService geoLocationService;
    private final PaymentRepository paymentRepository;


    @Override
    public ReferralDto trackReferral(ReferralCreateRequest createRequest,
                                     String userAgent, String ipAddress) {

        validateAffiliateExists(createRequest.getAffiliateId());

        if (referralRepository.existsByReferralCodeAndStatus(
                createRequest.getReferralCode(), "ACTIVE")) {
            throw new InvalidReferralDataException(
                    "Referral code already exists and is active");
        }

        Referral referral = referralMapper.toEntity(createRequest);
        enrichReferralData(referral, userAgent, ipAddress);

        referral.setStatus("CLICKED");
        referral.setClickedAt(LocalDateTime.now());

        Referral savedReferral = referralRepository.save(referral);
        log.info("Tracked referral: {}", savedReferral.getId());

        return referralMapper.toDto(savedReferral);
    }

    @Override
    public ReferralDto getReferralById(Long referralId) {
        Referral referral = findReferralOrThrow(referralId);
        return referralMapper.toDto(referral);
    }

    @Override
    public ReferralDto getReferralByCode(String referralCode) {
        Referral referral = referralRepository.findByReferralCode(referralCode)
                .orElseThrow(() -> new ReferralNotFoundException(
                        "Referral not found with code: " + referralCode));
        return referralMapper.toDto(referral);
    }

    @Override
    public Page<ReferralDto> searchReferrals(Optional<String> status,
                                             Optional<Long> affiliateId,
                                             Optional<String> referralCode,
                                             Pageable pageable) {

        Page<Referral> referrals = referralRepository.searchReferrals(
                status.orElse(null),
                affiliateId.orElse(null),
                referralCode.orElse(null),
                pageable);

        return referrals.map(referralMapper::toDto);
    }

    @Override
    public Page<ReferralDto> getReferralsByAffiliateId(Long affiliateId,
                                                       Optional<String> status,
                                                       Optional<LocalDateTime> startDate,
                                                       Optional<LocalDateTime> endDate,
                                                       Pageable pageable) {

        validateAffiliateExists(affiliateId);

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(1));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        Page<Referral> referrals = referralRepository
                .findByAffiliateIdAndDateRange(affiliateId, status.orElse(null),
                        start, end, pageable);

        return referrals.map(referralMapper::toDto);
    }

    @Override
    public ReferralDto updateReferral(Long referralId,
                                      ReferralUpdateRequest updateRequest) {

        Referral referral = findReferralOrThrow(referralId);

        Optional.ofNullable(updateRequest.getTargetUrl())
                .ifPresent(referral::setTargetUrl);
        Optional.ofNullable(updateRequest.getSourceUrl())
                .ifPresent(referral::setSourceUrl);
        Optional.ofNullable(updateRequest.getStatus())
                .ifPresent(referral::setStatus);
        Optional.ofNullable(updateRequest.getConversionValue())
                .ifPresent(referral::setConversionValue);
        Optional.ofNullable(updateRequest.getOrderId())
                .ifPresent(referral::setOrderId);
        Optional.ofNullable(updateRequest.getMetadata())
                .ifPresent(referral::setMetadata);

        referral.setUpdatedAt(LocalDateTime.now());
        Referral updatedReferral = referralRepository.save(referral);

        log.info("Updated referral: {}", referralId);
        return referralMapper.toDto(updatedReferral);
    }

    @Override
    public void deleteReferral(Long referralId) {
        if (!referralRepository.existsById(referralId)) {
            throw new ReferralNotFoundException(
                    "Referral not found with ID: " + referralId);
        }
        referralRepository.deleteById(referralId);
        log.info("Deleted referral: {}", referralId);
    }

    @Override
    public ReferralDto convertReferral(Long referralId,
                                       BigDecimal conversionValue,
                                       Optional<String> orderId) {

        Referral referral = findReferralOrThrow(referralId);

        if ("CONVERTED".equals(referral.getStatus())) {
            throw new InvalidReferralDataException(
                    "Referral has already been converted");
        }

        referral.setStatus("CONVERTED");
        referral.setConvertedAt(LocalDateTime.now());
        referral.setConversionValue(conversionValue);
        orderId.ifPresent(referral::setOrderId);

        Referral convertedReferral = referralRepository.save(referral);
        log.info("Converted referral: {} with value: {}",
                referralId, conversionValue);

        return referralMapper.toDto(convertedReferral);
    }

    @Override
    public ReferralDto cancelConversion(Long referralId) {
        Referral referral = findReferralOrThrow(referralId);

        if (!"CONVERTED".equals(referral.getStatus())) {
            throw new InvalidReferralDataException(
                    "Only converted referrals can be cancelled");
        }

        referral.setStatus("CANCELLED");
        referral.setConversionValue(BigDecimal.ZERO);
        referral.setUpdatedAt(LocalDateTime.now());

        Referral cancelledReferral = referralRepository.save(referral);
        log.info("Cancelled conversion for referral: {}", referralId);

        return referralMapper.toDto(cancelledReferral);
    }

    @Override
    public ReferralDto expireReferral(Long referralId) {
        Referral referral = findReferralOrThrow(referralId);

        referral.setStatus("EXPIRED");
        referral.setUpdatedAt(LocalDateTime.now());

        Referral expiredReferral = referralRepository.save(referral);
        log.info("Expired referral: {}", referralId);

        return referralMapper.toDto(expiredReferral);
    }

    @Override
    @Transactional(readOnly = true)
    public ReferralTrackingResponse getReferralStatistics(Long affiliateId,
                                                          Optional<LocalDateTime> startDate,
                                                          Optional<LocalDateTime> endDate) {

        validateAffiliateExists(affiliateId);

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(1));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        List<Referral> referrals = referralRepository
                .findByAffiliateIdAndClickedAtBetween(affiliateId, start, end);

        return buildTrackingResponse(affiliateId, referrals, start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReferralDto> getTopPerformingReferrals(Long affiliateId,
                                                       Integer limit,
                                                       Optional<LocalDateTime> startDate,
                                                       Optional<LocalDateTime> endDate) {

        validateAffiliateExists(affiliateId);

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(1));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        Pageable pageable = PageRequest.of(0, limit,
                Sort.by(Sort.Direction.DESC, "conversionValue"));

        Page<Referral> topReferrals = referralRepository
                .findTopPerformingByAffiliateId(affiliateId, start, end, pageable);

        return topReferrals.stream()
                .map(referralMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ConversionRateDto getConversionRateAnalytics(Long affiliateId,
                                                        String period,
                                                        Optional<LocalDateTime> startDate,
                                                        Optional<LocalDateTime> endDate) {

        validateAffiliateExists(affiliateId);

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(1));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        List<Referral> referrals = referralRepository
                .findByAffiliateIdAndClickedAtBetween(affiliateId, start, end);

        return buildConversionRateAnalytics(affiliateId, referrals,
                period, start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal calculateTotalRevenueForAffiliate(Long affiliateId,
                                                        LocalDateTime startDate,
                                                        LocalDateTime endDate) {

        validateAffiliateExists(affiliateId);

        return referralRepository.calculateTotalRevenue(
                        affiliateId, startDate, endDate)
                .orElse(BigDecimal.ZERO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReferralDto> getPendingConversions(Optional<Long> affiliateId,
                                                   Optional<Integer> daysOld,
                                                   Pageable pageable) {

        LocalDateTime cutoffDate = LocalDateTime.now()
                .minusDays(daysOld.orElse(30));

        Page<Referral> pendingReferrals = referralRepository
                .findPendingConversions(affiliateId.orElse(null),
                        cutoffDate, pageable);

        return pendingReferrals.map(referralMapper::toDto);
    }

    @Override
    public List<ReferralDto> trackBatchReferrals(List<ReferralCreateRequest> createRequests,
                                                 String userAgent,
                                                 String ipAddress) {

        List<Referral> referrals = createRequests.stream()
                .map(request -> {
                    validateAffiliateExists(request.getAffiliateId());
                    Referral referral = referralMapper.toEntity(request);
                    enrichReferralData(referral, userAgent, ipAddress);
                    referral.setStatus("CLICKED");
                    referral.setClickedAt(LocalDateTime.now());
                    return referral;
                })
                .collect(Collectors.toList());

        List<Referral> savedReferrals = referralRepository.saveAll(referrals);
        log.info("Tracked {} referrals in batch", savedReferrals.size());

        return savedReferrals.stream()
                .map(referralMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReferralTrends(Integer days,
                                                 Optional<Long> affiliateId) {

        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime endDate = LocalDateTime.now();

        List<Referral> referrals = affiliateId
                .map(id -> referralRepository.findByAffiliateIdAndClickedAtBetween(
                        id, startDate, endDate))
                .orElseGet(() -> referralRepository.findByClickedAtBetween(
                        startDate, endDate));

        return buildTrendAnalysis(referrals, days);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getReferralSourceAnalytics(Optional<Long> affiliateId,
                                                        Optional<LocalDateTime> startDate,
                                                        Optional<LocalDateTime> endDate) {

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(1));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        List<Referral> referrals = affiliateId
                .map(id -> referralRepository.findByAffiliateIdAndClickedAtBetween(
                        id, start, end))
                .orElseGet(() -> referralRepository.findByClickedAtBetween(
                        start, end));

        return referrals.stream()
                .filter(r -> r.getSourceUrl() != null)
                .collect(Collectors.groupingBy(
                        r -> extractDomain(r.getSourceUrl()),
                        Collectors.counting()));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReferralCustomerDTO> searchReferralCustomersByClient(Long clientId, String searchTerm, Pageable pageable) {
        return referralRepository.searchByClientIdAndTerm(clientId, searchTerm, pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReferralCustomerDTO> getReferralCustomersByClient(Long clientId, Pageable pageable) {
        return referralRepository.findByClientId(clientId, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<PaymentDto> getTransactionsByClient(
            Long clientId,
            String search,
            Optional<String> status,
            Optional<String> paymentMethod,
            Optional<LocalDateTime> startDate,
            Optional<LocalDateTime> endDate,
            Pageable pageable) {

        Page<Payment> paymentsPage = paymentRepository.findTransactionsByClientWithFilters(
                clientId,
                search,
                status.orElse(null),
                paymentMethod.orElse(null),
                startDate.orElse(null),
                endDate.orElse(null),
                pageable
        );

        return paymentsPage.map(payment -> PaymentDto.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .description(payment.getDescription())
                .cancellationReason(payment.getCancellationReason())
                .processedAt(payment.getProcessedAt())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .affiliateId(payment.getAffiliate().getId())
                .build());
    }

    private void validateAffiliateExists(Long affiliateId) {
        if (!affiliateRepository.existsById(affiliateId)) {
            throw new InvalidReferralDataException(
                    "Affiliate not found with ID: " + affiliateId);
        }
    }

    private Referral findReferralOrThrow(Long referralId) {
        return referralRepository.findById(referralId)
                .orElseThrow(() -> new ReferralNotFoundException(
                        "Referral not found with ID: " + referralId));
    }

    private void enrichReferralData(Referral referral,
                                    String userAgent,
                                    String ipAddress) {
        referral.setUserAgent(userAgent);
        referral.setIpAddress(ipAddress);

        DeviceDetector.DeviceInfo deviceInfo =
                deviceDetector.detectDevice(userAgent);
        referral.setDeviceType(deviceInfo.getDeviceType());
        referral.setBrowserName(deviceInfo.getBrowserName());
        referral.setOperatingSystem(deviceInfo.getOperatingSystem());

        GeoLocationService.GeoLocation geoLocation =
                geoLocationService.getLocation(ipAddress);
        referral.setCountry(geoLocation.getCountry());
        referral.setCity(geoLocation.getCity());
    }

    private ReferralTrackingResponse buildTrackingResponse(Long affiliateId,
                                                           List<Referral> referrals,
                                                           LocalDateTime start,
                                                           LocalDateTime end) {

        Affiliate affiliate = affiliateRepository.findById(affiliateId)
                .orElseThrow();

        long totalClicks = referrals.size();
        long totalConversions = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()))
                .count();

        BigDecimal conversionRate = totalClicks > 0
                ? BigDecimal.valueOf(totalConversions)
                .divide(BigDecimal.valueOf(totalClicks), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        BigDecimal totalRevenue = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()))
                .map(Referral::getConversionValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgOrderValue = totalConversions > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalConversions),
                2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        long uniqueVisitors = referrals.stream()
                .map(Referral::getIpAddress)
                .distinct()
                .count();

        Map<String, Long> clicksByDay = groupByDay(referrals, false);
        Map<String, Long> conversionsByDay = groupByDay(referrals, true);
        List<TopPerformingLink> topLinks = getTopLinks(referrals);
        Map<String, BigDecimal> revenueBySource = getRevenueBySource(referrals);
        DeviceStatistics deviceStats = buildDeviceStatistics(referrals);
        GeographicStatistics geoStats = buildGeographicStatistics(referrals);

        return ReferralTrackingResponse.builder()
                .affiliateId(affiliateId)
                .affiliateName(affiliate.getName())
                .periodStart(start)
                .periodEnd(end)
                .totalClicks(totalClicks)
                .totalConversions(totalConversions)
                .conversionRate(conversionRate)
                .totalRevenue(totalRevenue)
                .averageOrderValue(avgOrderValue)
                .uniqueVisitors(uniqueVisitors)
                .clicksByDay(clicksByDay)
                .conversionsByDay(conversionsByDay)
                .topLinks(topLinks)
                .revenueBySource(revenueBySource)
                .deviceStats(deviceStats)
                .geoStats(geoStats)
                .build();
    }

    private ConversionRateDto buildConversionRateAnalytics(Long affiliateId,
                                                                                            List<Referral> referrals,
                                                                                            String period,
                                                                                            LocalDateTime start,
                                                                                            LocalDateTime end) {

        Map<String, List<Referral>> groupedReferrals =
                groupReferralsByPeriod(referrals, period);

        Map<String, BigDecimal> conversionRateByPeriod = new HashMap<>();
        Map<String, Long> clicksByPeriod = new HashMap<>();
        Map<String, Long> conversionsByPeriod = new HashMap<>();
        Map<String, BigDecimal> revenueByPeriod = new HashMap<>();

        groupedReferrals.forEach((periodKey, periodReferrals) -> {
            long clicks = periodReferrals.size();
            long conversions = periodReferrals.stream()
                    .filter(r -> "CONVERTED".equals(r.getStatus()))
                    .count();

            BigDecimal revenue = periodReferrals.stream()
                    .filter(r -> "CONVERTED".equals(r.getStatus()))
                    .map(Referral::getConversionValue)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal rate = clicks > 0
                    ? BigDecimal.valueOf(conversions)
                    .divide(BigDecimal.valueOf(clicks), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            clicksByPeriod.put(periodKey, clicks);
            conversionsByPeriod.put(periodKey, conversions);
            revenueByPeriod.put(periodKey, revenue);
            conversionRateByPeriod.put(periodKey, rate);
        });

        BigDecimal overallRate = calculateOverallConversionRate(referrals);
        List<ConversionTrend> trends = buildConversionTrends(groupedReferrals);
        BigDecimal projectedRevenue = calculateProjectedRevenue(revenueByPeriod);
        BigDecimal growthRate = calculateGrowthRate(revenueByPeriod);

        return ConversionRateDto.builder()
                .affiliateId(affiliateId)
                .period(period)
                .startDate(start)
                .endDate(end)
                .overallConversionRate(overallRate)
                .conversionRateByPeriod(conversionRateByPeriod)
                .clicksByPeriod(clicksByPeriod)
                .conversionsByPeriod(conversionsByPeriod)
                .revenueByPeriod(revenueByPeriod)
                .trends(trends)
                .projectedRevenue(projectedRevenue)
                .growthRate(growthRate)
                .build();
    }

    private Map<String, Long> groupByDay(List<Referral> referrals,
                                         boolean conversionsOnly) {
        return referrals.stream()
                .filter(r -> !conversionsOnly || "CONVERTED".equals(r.getStatus()))
                .collect(Collectors.groupingBy(
                        r -> r.getClickedAt().toLocalDate().toString(),
                        Collectors.counting()));
    }

    private List<TopPerformingLink> getTopLinks(List<Referral> referrals) {
        return referrals.stream()
                .collect(Collectors.groupingBy(Referral::getReferralCode))
                .entrySet().stream()
                .map(entry -> {
                    List<Referral> linkReferrals = entry.getValue();
                    long clicks = linkReferrals.size();
                    long conversions = linkReferrals.stream()
                            .filter(r -> "CONVERTED".equals(r.getStatus()))
                            .count();
                    BigDecimal revenue = linkReferrals.stream()
                            .filter(r -> "CONVERTED".equals(r.getStatus()))
                            .map(Referral::getConversionValue)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal rate = clicks > 0
                            ? BigDecimal.valueOf(conversions)
                            .divide(BigDecimal.valueOf(clicks),
                                    4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            : BigDecimal.ZERO;

                    return TopPerformingLink.builder()
                            .referralCode(entry.getKey())
                            .targetUrl(linkReferrals.get(0).getTargetUrl())
                            .clicks(clicks)
                            .conversions(conversions)
                            .conversionRate(rate)
                            .revenue(revenue)
                            .build();
                })
                .sorted((a, b) -> b.getRevenue().compareTo(a.getRevenue()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private Map<String, BigDecimal> getRevenueBySource(List<Referral> referrals) {
        return referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()) &&
                        r.getSourceUrl() != null)
                .collect(Collectors.groupingBy(
                        r -> extractDomain(r.getSourceUrl()),
                        Collectors.reducing(BigDecimal.ZERO,
                                Referral::getConversionValue,
                                BigDecimal::add)));
    }

    private DeviceStatistics buildDeviceStatistics(List<Referral> referrals) {
        Map<String, Long> deviceTypes = referrals.stream()
                .filter(r -> r.getDeviceType() != null)
                .collect(Collectors.groupingBy(
                        Referral::getDeviceType,
                        Collectors.counting()));

        Map<String, Long> browsers = referrals.stream()
                .filter(r -> r.getBrowserName() != null)
                .collect(Collectors.groupingBy(
                        Referral::getBrowserName,
                        Collectors.counting()));

        Map<String, Long> operatingSystems = referrals.stream()
                .filter(r -> r.getOperatingSystem() != null)
                .collect(Collectors.groupingBy(
                        Referral::getOperatingSystem,
                        Collectors.counting()));

        Map<String, BigDecimal> conversionRateByDevice =
                calculateConversionRateByDevice(referrals);

        return DeviceStatistics.builder()
                .deviceTypes(deviceTypes)
                .browsers(browsers)
                .operatingSystems(operatingSystems)
                .conversionRateByDevice(conversionRateByDevice)
                .build();
    }

    private GeographicStatistics buildGeographicStatistics(List<Referral> referrals) {
        Map<String, Long> clicksByCountry = referrals.stream()
                .filter(r -> r.getCountry() != null)
                .collect(Collectors.groupingBy(
                        Referral::getCountry,
                        Collectors.counting()));

        Map<String, Long> conversionsByCountry = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()) &&
                        r.getCountry() != null)
                .collect(Collectors.groupingBy(
                        Referral::getCountry,
                        Collectors.counting()));

        Map<String, BigDecimal> revenueByCountry = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()) &&
                        r.getCountry() != null)
                .collect(Collectors.groupingBy(
                        Referral::getCountry,
                        Collectors.reducing(BigDecimal.ZERO,
                                Referral::getConversionValue,
                                BigDecimal::add)));

        List<TopLocation> topLocations = buildTopLocations(referrals);

        return GeographicStatistics.builder()
                .clicksByCountry(clicksByCountry)
                .conversionsByCountry(conversionsByCountry)
                .revenueByCountry(revenueByCountry)
                .topLocations(topLocations)
                .build();
    }

    private List<TopLocation> buildTopLocations(List<Referral> referrals) {
        return referrals.stream()
                .filter(r -> r.getCountry() != null && r.getCity() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getCountry() + ":" + r.getCity()))
                .entrySet().stream()
                .map(entry -> {
                    String[] location = entry.getKey().split(":");
                    List<Referral> locationReferrals = entry.getValue();

                    long clicks = locationReferrals.size();
                    long conversions = locationReferrals.stream()
                            .filter(r -> "CONVERTED".equals(r.getStatus()))
                            .count();
                    BigDecimal revenue = locationReferrals.stream()
                            .filter(r -> "CONVERTED".equals(r.getStatus()))
                            .map(Referral::getConversionValue)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return TopLocation.builder()
                            .country(location[0])
                            .city(location[1])
                            .clicks(clicks)
                            .conversions(conversions)
                            .revenue(revenue)
                            .build();
                })
                .sorted((a, b) -> b.getRevenue().compareTo(a.getRevenue()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private Map<String, List<Referral>> groupReferralsByPeriod(List<Referral> referrals,
                                                               String period) {
        return referrals.stream()
                .collect(Collectors.groupingBy(r -> {
                    LocalDateTime date = r.getClickedAt();
                    return switch (period.toLowerCase()) {
                        case "daily" -> date.toLocalDate().toString();
                        case "weekly" -> date.toLocalDate()
                                .minusDays(date.getDayOfWeek().getValue() - 1)
                                .toString();
                        case "monthly" -> date.getYear() + "-" +
                                String.format("%02d", date.getMonthValue());
                        case "yearly" -> String.valueOf(date.getYear());
                        default -> date.toLocalDate().toString();
                    };
                }));
    }

    private BigDecimal calculateOverallConversionRate(List<Referral> referrals) {
        long totalClicks = referrals.size();
        long totalConversions = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()))
                .count();

        return totalClicks > 0
                ? BigDecimal.valueOf(totalConversions)
                .divide(BigDecimal.valueOf(totalClicks), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;
    }

    private List<ConversionTrend> buildConversionTrends(Map<String, List<Referral>> groupedReferrals) {
        List<ConversionTrend> trends = new ArrayList<>();
        BigDecimal previousRevenue = null;

        for (Map.Entry<String, List<Referral>> entry :
                new TreeMap<>(groupedReferrals).entrySet()) {

            List<Referral> periodReferrals = entry.getValue();
            long clicks = periodReferrals.size();
            long conversions = periodReferrals.stream()
                    .filter(r -> "CONVERTED".equals(r.getStatus()))
                    .count();

            BigDecimal revenue = periodReferrals.stream()
                    .filter(r -> "CONVERTED".equals(r.getStatus()))
                    .map(Referral::getConversionValue)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal rate = clicks > 0
                    ? BigDecimal.valueOf(conversions)
                    .divide(BigDecimal.valueOf(clicks), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            String trendDirection = "STABLE";
            BigDecimal changePercentage = BigDecimal.ZERO;

            if (previousRevenue != null && previousRevenue.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal change = revenue.subtract(previousRevenue);
                changePercentage = change.divide(previousRevenue, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
                trendDirection = change.compareTo(BigDecimal.ZERO) > 0 ? "UP" :
                        change.compareTo(BigDecimal.ZERO) < 0 ? "DOWN" : "STABLE";
            }

            trends.add(ConversionTrend.builder()
                    .date(periodReferrals.get(0).getClickedAt())
                    .conversionRate(rate)
                    .clicks(clicks)
                    .conversions(conversions)
                    .revenue(revenue)
                    .trendDirection(trendDirection)
                    .changePercentage(changePercentage)
                    .build());

            previousRevenue = revenue;
        }

        return trends;
    }

    private BigDecimal calculateProjectedRevenue(Map<String, BigDecimal> revenueByPeriod) {
        if (revenueByPeriod.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal avgRevenue = revenueByPeriod.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(revenueByPeriod.size()),
                        2, RoundingMode.HALF_UP);

        return avgRevenue.multiply(BigDecimal.valueOf(12));
    }

    private BigDecimal calculateGrowthRate(Map<String, BigDecimal> revenueByPeriod) {
        if (revenueByPeriod.size() < 2) {
            return BigDecimal.ZERO;
        }

        List<BigDecimal> revenues = new ArrayList<>(
                new TreeMap<>(revenueByPeriod).values());

        BigDecimal firstRevenue = revenues.get(0);
        BigDecimal lastRevenue = revenues.get(revenues.size() - 1);

        if (firstRevenue.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return lastRevenue.subtract(firstRevenue)
                .divide(firstRevenue, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    private Map<String, BigDecimal> calculateConversionRateByDevice(List<Referral> referrals) {
        return referrals.stream()
                .filter(r -> r.getDeviceType() != null)
                .collect(Collectors.groupingBy(Referral::getDeviceType))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            List<Referral> deviceReferrals = entry.getValue();
                            long clicks = deviceReferrals.size();
                            long conversions = deviceReferrals.stream()
                                    .filter(r -> "CONVERTED".equals(r.getStatus()))
                                    .count();
                            return clicks > 0
                                    ? BigDecimal.valueOf(conversions)
                                    .divide(BigDecimal.valueOf(clicks),
                                            4, RoundingMode.HALF_UP)
                                    .multiply(BigDecimal.valueOf(100))
                                    : BigDecimal.ZERO;
                        }));
    }

    private Map<String, Object> buildTrendAnalysis(List<Referral> referrals, Integer days) {
        Map<String, Object> trends = new HashMap<>();

        long totalClicks = referrals.size();
        long totalConversions = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()))
                .count();

        BigDecimal totalRevenue = referrals.stream()
                .filter(r -> "CONVERTED".equals(r.getStatus()))
                .map(Referral::getConversionValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgDailyClicks = BigDecimal.valueOf(totalClicks)
                .divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);

        BigDecimal avgDailyRevenue = totalRevenue
                .divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);

        Map<String, Long> dailyClicks = referrals.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getClickedAt().toLocalDate().toString(),
                        Collectors.counting()));

        trends.put("totalClicks", totalClicks);
        trends.put("totalConversions", totalConversions);
        trends.put("totalRevenue", totalRevenue);
        trends.put("averageDailyClicks", avgDailyClicks);
        trends.put("averageDailyRevenue", avgDailyRevenue);
        trends.put("dailyClicks", dailyClicks);
        trends.put("periodDays", days);

        return trends;
    }

    private String extractDomain(String url) {
        if (url == null || url.isEmpty()) {
            return "direct";
        }

        try {
            String domain = url.replaceFirst("^(https?://)?(www\\.)?", "");
            int slashIndex = domain.indexOf('/');
            if (slashIndex > 0) {
                domain = domain.substring(0, slashIndex);
            }
            return domain;
        } catch (Exception e) {
            return "unknown";
        }
    }

    private ReferralCustomerDTO convertToDTO(Referral referral) {
        return ReferralCustomerDTO.builder()
                .id(referral.getId())
                .customerName(referral.getCustomerName())
                .customerEmail(referral.getCustomerEmail())
                .clientId(referral.getClient().getId())
                .clientName(referral.getClient().getName())
                .clientEmail(referral.getClient().getEmail())
                .totalPaid(referral.getTotalPaid())
                .totalCommission(referral.getTotalCommission())
                .status(referral.getStatus())
                .createdAt(referral.getCreatedAt())
                .lastPurchaseDate(referral.getLastPurchaseDate())
                .purchaseCount(referral.getPurchaseCount())
                .referralCode(referral.getReferralCode())
                .source(referral.getSource())
                .build();
    }
}
