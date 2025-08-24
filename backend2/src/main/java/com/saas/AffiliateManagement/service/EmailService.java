package com.saas.AffiliateManagement.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    public void sendVerificationEmail(String email, String verificationToken) {
        log.info("Sending verification email to: {} with token: {}", email, verificationToken);
    }

    public void sendActivationNotification(String email) {
        log.info("Sending activation notification to: {}", email);
    }

    public void sendSuspensionNotification(String email, String reason) {
        log.info("Sending suspension notification to: {} with reason: {}", email, reason);
    }

    public void sendSubscriptionUpgradeNotification(String email, String oldPlan, String newPlan) {
        log.info("Sending subscription upgrade notification to: {} from {} to {}", email, oldPlan, newPlan);
    }

    public void sendSubscriptionDowngradeNotification(String email, String oldPlan, String newPlan) {
        log.info("Sending subscription downgrade notification to: {} from {} to {}", email, oldPlan, newPlan);
    }

    public void sendAccountDeletionNotification(String email) {
        log.info("Sending account deletion notification to: {}", email);
    }

    public void sendAffiliateRegistrationNotification(String email, String affiliateName) {
        log.info("Sending affiliate registration notification to: {} for affiliate: {}", email, affiliateName);
    }

    public void sendAffiliateActivationNotification(String email) {
        log.info("Sending affiliate activation notification to: {}", email);
    }

    public void sendAffiliateDeactivationNotification(String email) {
        log.info("Sending affiliate deactivation notification to: {}", email);
    }

    public void sendAffiliateApprovalNotification(String email, String referralCode) {
        log.info("Sending affiliate approval notification to: {} with referral code: {}", email, referralCode);
    }

    public void sendAffiliateRejectionNotification(String email, String reason) {
        log.info("Sending affiliate rejection notification to: {} with reason: {}", email, reason);
    }

    public void sendAffiliateAccountDeletionNotification(String email) {
        log.info("Sending affiliate account deletion notification to: {}", email);
    }
}