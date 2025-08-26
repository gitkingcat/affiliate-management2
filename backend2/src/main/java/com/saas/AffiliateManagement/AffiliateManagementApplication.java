package com.saas.AffiliateManagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AffiliateManagementApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(AffiliateManagementApplication.class);
		app.setAdditionalProfiles("dev");
		app.run(args);
	}

}
