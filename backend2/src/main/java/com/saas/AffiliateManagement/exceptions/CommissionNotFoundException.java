// CommissionNotFoundException.java
package com.saas.AffiliateManagement.exceptions;

public class CommissionNotFoundException extends RuntimeException {

    public CommissionNotFoundException(String message) {
        super(message);
    }

    public CommissionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}