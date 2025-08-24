package com.saas.AffiliateManagement.exceptions;

public class InvalidPaymentDataException extends RuntimeException {

    public InvalidPaymentDataException(String message) {
        super(message);
    }

    public InvalidPaymentDataException(String message, Throwable cause) {
        super(message, cause);
    }
}
