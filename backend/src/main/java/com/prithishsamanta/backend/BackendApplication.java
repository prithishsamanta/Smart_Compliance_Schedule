package com.prithishsamanta.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Set default timezone to US Eastern Time
		TimeZone.setDefault(TimeZone.getTimeZone("America/New_York"));
		SpringApplication.run(BackendApplication.class, args);
	}

}
