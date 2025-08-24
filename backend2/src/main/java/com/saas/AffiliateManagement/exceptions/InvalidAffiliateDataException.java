package com.saas.AffiliateManagement.exceptions;

public class InvalidAffiliateDataException extends RuntimeException {

    public InvalidAffiliateDataException(String message) {
        super(message);
    }

    public InvalidAffiliateDataException(String message, Throwable cause) {
        super(message, cause);
    }
}