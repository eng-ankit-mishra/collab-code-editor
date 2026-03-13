package com.codevspace.backend.repository;


import com.codevspace.backend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByCollaboratorsUserId(String userId);
}
