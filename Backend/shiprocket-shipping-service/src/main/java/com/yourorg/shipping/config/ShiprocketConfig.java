
package com.yourorg.shipping.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ShiprocketConfig {

 @Bean
 public RestTemplate restTemplate(){
  return new RestTemplate();
 }

}
