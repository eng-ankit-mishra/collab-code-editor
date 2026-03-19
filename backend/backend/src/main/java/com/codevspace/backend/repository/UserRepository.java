package com.codevspace.backend.repository;


import com.codevspace.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {

    Optional<User> findById(String id);

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);
}
