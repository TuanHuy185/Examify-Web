package hcmut.examify.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import hcmut.examify.Models.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);

} 