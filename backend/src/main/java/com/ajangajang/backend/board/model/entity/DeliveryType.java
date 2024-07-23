package com.ajangajang.backend.board.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class DeliveryType {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String type;

    public DeliveryType(String type) {
        this.type = type;
    }
}
