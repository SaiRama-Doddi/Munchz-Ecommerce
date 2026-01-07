package com.user.user_profile_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
		properties = {
				"spring.flyway.enabled=false",
				"spring.datasource.url=jdbc:h2:mem:testdb",
				"spring.datasource.driver-class-name=org.h2.Driver",
				"spring.datasource.username=sa",
				"spring.datasource.password=",
				"spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
		}
)
class UserProfileServiceApplicationTests {

	@Test
	void contextLoads() {
		// test passes if application context loads
	}
}
