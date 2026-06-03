//package com.food.Online_Food_Ordering.Config;
//
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
//import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.filter.CommonsRequestLoggingFilter;
//
//
//import java.util.Arrays;
//import java.util.Collections;
//
//@Configuration
//@EnableWebSecurity
//public class AppConfig {
//
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeRequests(authorize -> authorize
//                        .requestMatchers(new AntPathRequestMatcher("/api/admin/**")).hasAnyRole("RESTAURANT_OWNER", "ADMIN")
//                        .requestMatchers(new AntPathRequestMatcher("/api/admin/events")).hasAnyRole("ROLE_CUSTOMER", "RESTAURANT_OWNER", "ADMIN")
//                        .requestMatchers(new AntPathRequestMatcher("/api/**")).authenticated()
//                        .requestMatchers("/api/payments/callback").permitAll()
//                        .requestMatchers("/api/payments").permitAll()
//                        .anyRequest().permitAll()
//                )
//                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
//                .csrf(csrf -> csrf.disable())
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()));
//
//        return http.build();  // Return the SecurityFilterChain instance correctly
//    }
//
//    private CorsConfigurationSource corsConfigurationSource() {
//        return new CorsConfigurationSource() {
//            @Override
//            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//                CorsConfiguration cfg = new CorsConfiguration();
//                cfg.setAllowedOrigins(Arrays.asList(
//                        "https://zosh-food.vercel.app",
//                        "http://localhost:3000"
//                ));
//                cfg.setAllowedMethods(Collections.singletonList("*"));
//                cfg.setAllowCredentials(true);
//                cfg.setAllowedHeaders(Collections.singletonList("*"));
//                cfg.setExposedHeaders(Arrays.asList("Authorization"));
//                cfg.setMaxAge(3600L);
//                return cfg;
//            }
//        };
//    }
//
//    @Bean
//    PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
////    @Bean
////    public CommonsRequestLoggingFilter logFilter() {
////        CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
////        filter.setIncludePayload(true);
////        filter.setMaxPayloadLength(10000);
////        return filter;
////    }
//
//}

package com.food.Online_Food_Ordering.Config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // ✅ PUBLIC endpoints FIRST
                        .requestMatchers("/api/payments/callback").permitAll()
                        .requestMatchers("/api/payments").permitAll()
                        .requestMatchers("/api/auth/**", "/api/public/**").permitAll()

                        // ✅ ADMIN/OWNER restricted routes
                        .requestMatchers("/api/admin/**").hasAnyRole("RESTAURANT_OWNER", "ADMIN")

                        // ✅ Everything else requires authentication
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class);

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration cfg = new CorsConfiguration();
            cfg.setAllowedOrigins(Arrays.asList(
                    "http://localhost:3000",
                    "https://zosh-food.vercel.app"
            ));
            cfg.setAllowedMethods(Collections.singletonList("*"));
            cfg.setAllowCredentials(true);
            cfg.setAllowedHeaders(Collections.singletonList("*"));
            cfg.setExposedHeaders(Arrays.asList("Authorization"));
            cfg.setMaxAge(3600L);
            return cfg;
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

