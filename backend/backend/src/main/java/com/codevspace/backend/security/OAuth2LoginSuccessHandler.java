package com.codevspace.backend.security;


import com.codevspace.backend.model.User;
import com.codevspace.backend.model.enums.AuthProvider;
import com.codevspace.backend.repository.UserRepository;
import com.codevspace.backend.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend.oauth2.redirect-uri}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException{
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        String authorizedClientRegistrationId = oAuth2AuthenticationToken.getAuthorizedClientRegistrationId();
        OAuth2User oAuth2User=(OAuth2User)authentication.getPrincipal();
        Map<String, Object > attributes=oAuth2User.getAttributes();

        String email="";
        String name="";
        String avatarUrl="";
        String providerId="";
        AuthProvider authProvider;

        if("google".equals(authorizedClientRegistrationId)){
            name=(String) attributes.get("name");
            email=(String) attributes.get("email");
            providerId=(String) attributes.get("sub");
            avatarUrl=(String) attributes.get("picture");
            authProvider=AuthProvider.GOOGLE;
        }else if("github".equals(authorizedClientRegistrationId)){
            email=(String) attributes.get("email") !=null ? (String) attributes.get("email") : attributes.get("login") + "@github.com";
            name=(String) attributes.get("name");
            if(name==null){
                name=(String) attributes.get("login");
            }
            avatarUrl=(String) attributes.get("avatar_url");
            providerId=String.valueOf(attributes.get("id"));
            authProvider=AuthProvider.GITHUB;
        }else{
            throw new IllegalArgumentException("Unknown OAuth2 Provider : " + authorizedClientRegistrationId);
        }

        Optional<User> userOptional=userRepository.findByEmail(email);
        User user;

        if(userOptional.isPresent()){
            user=userOptional.get();
        }else{
            user=User.builder()
                    .email(email)
                    .name(name)
                    .avatarUrl(avatarUrl)
                    .authProvider(authProvider)
                    .providerId(providerId)
                    .isEmailVerified(true)
                    .roles(Set.of("ROLE_USER"))
                    .build();
            user=userRepository.save(user);
        }

        String jwtToken=jwtService.generateToken(user);
        String targetUrl=frontendRedirectUri + "?token="+jwtToken;
        getRedirectStrategy().sendRedirect(request,response,targetUrl);



    }

}
