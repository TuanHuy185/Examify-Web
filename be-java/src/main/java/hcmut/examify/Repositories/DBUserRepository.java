package hcmut.examify.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hcmut.examify.Models.DBUser;
import java.time.LocalDate;

@Repository
public interface DBUserRepository extends JpaRepository<DBUser, Long> {
    // Tìm người dùng theo email
    DBUser findByEmail(String email);
    
    // Phương thức mặc định để tạo và lưu một DBUser mới
    default DBUser createAndSaveUser(String name, String email, LocalDate dob) {
        DBUser newUser = DBUser.builder()
                .name(name)
                .email(email)
                .dob(dob)
                .build();
        return save(newUser);
    }
    
    // Tìm kiếm user theo id
    @Query("SELECT u.id FROM DBUser u WHERE u.email = :email")
    Long findIdByEmail(@Param("email") String email);
} 