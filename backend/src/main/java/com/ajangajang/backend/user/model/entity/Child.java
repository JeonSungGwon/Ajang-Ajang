package com.ajangajang.backend.user.model.entity;

import com.ajangajang.backend.board.model.entity.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Child {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate birthDate;

    private Gender gender;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Child(String name, LocalDate birthDate, Gender gender, User user) {
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.user = user;
    }

}
