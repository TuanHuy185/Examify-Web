package hcmut.examify.Models;

import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class PersonalInformation {
    @Column(name= "last_name")
    private String last_name;

    @Column(name= "middle_name")
    private String middle_name;

    @Column(name= "first_name")
    private String first_name;

    @Column(name= "date_of_birth")
    private Date date;

    @Column(name= "phone_number")
    private String phone_number;
}
