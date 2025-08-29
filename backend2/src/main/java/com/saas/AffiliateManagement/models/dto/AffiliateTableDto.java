package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffiliateTableDto {
    private Long id;
    private String name;
    private String email;
    private LocalDateTime signupDate;
    private String status;
    private BigDecimal revenue;
    private BigDecimal earnings;
    private Integer clicks;
    private Integer leads;
    private Integer customers;
}