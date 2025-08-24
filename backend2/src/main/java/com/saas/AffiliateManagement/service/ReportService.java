// ReportService.java
package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.entity.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    public byte[] generatePaymentReport(List<Payment> payments, String format) {
        return switch (format.toUpperCase()) {
            case "PDF" -> generatePdfReport(payments);
            case "CSV" -> generateCsvReport(payments);
            case "EXCEL" -> generateExcelReport(payments);
            default -> throw new IllegalArgumentException("Unsupported format: " + format);
        };
    }

    private byte[] generatePdfReport(List<Payment> payments) {
        log.info("Generating PDF report for {} payments", payments.size());
        return "PDF report content".getBytes();
    }

    private byte[] generateCsvReport(List<Payment> payments) {
        log.info("Generating CSV report for {} payments", payments.size());
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Affiliate,Amount,Currency,Status,Created At\n");

        payments.forEach(payment ->
                csv.append(String.format("%d,%s,%.2f,%s,%s,%s\n",
                        payment.getId(),
                        payment.getAffiliate().getName(),
                        payment.getAmount(),
                        payment.getCurrency(),
                        payment.getStatus(),
                        payment.getCreatedAt()))
        );

        return csv.toString().getBytes();
    }

    private byte[] generateExcelReport(List<Payment> payments) {
        log.info("Generating Excel report for {} payments", payments.size());
        return "Excel report content".getBytes();
    }
}