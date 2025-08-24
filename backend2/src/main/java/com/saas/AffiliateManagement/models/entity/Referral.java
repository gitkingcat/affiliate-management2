package com.saas.AffiliateManagement.models.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "referrals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliate_id", nullable = false)
    private Affiliate affiliate;

    @Column(name = "referral_code", nullable = false, length = 100)
    private String referralCode;

    @Column(name = "target_url", nullable = false, length = 2000)
    private String targetUrl;

    @Column(name = "source_url", length = 2000)
    private String sourceUrl;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "browser_name", length = 50)
    private String browserName;

    @Column(name = "operating_system", length = 50)
    private String operatingSystem;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String city;

    @Column(name = "conversion_value", precision = 10, scale = 2)
    private BigDecimal conversionValue;

    @Column(name = "order_id", length = 100)
    private String orderId;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @Column(name = "clicked_at")
    private LocalDateTime clickedAt;

    @Column(name = "converted_at")
    private LocalDateTime convertedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private Map<String, Object> metadata = new HashMap<>();

    public Map<String, Object> getMetadata() {
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata != null ? metadata : new HashMap<>();
    }
}