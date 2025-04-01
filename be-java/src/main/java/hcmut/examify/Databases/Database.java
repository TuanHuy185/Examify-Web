// package hcmut.examify.Databases;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

// import hcmut.examify.Models.Role;
// import hcmut.examify.Models.User;
// import hcmut.examify.Repositories.UserRepository;

// @Configuration
// public class Database {
//     // Logger is used to print information to terminal
//     private static final Logger logger = LoggerFactory.getLogger(Database.class);

//     @Autowired
//     PasswordEncoder passwordEncoder;

//     // CommandLineRunner is used to initialize data for Database (For testing)
//     @Bean
//     CommandLineRunner initDatabase(UserRepository userRepository) {
//         return new CommandLineRunner() {
//             @Override
//             public void run(String... args) throws Exception {
//                 User user1 = new User("user", passwordEncoder.encode("1245"), "1", Role.STUDENT);
//                 logger.info("insert user account: " + userRepository.save(user1));
//                 User admin = new User("admin", passwordEncoder.encode("1245"), "2", Role.TEACHER);
//                 logger.info("insert admin account: " + userRepository.save(admin));
//             }
//         };
//     }
// }

