package com.ajangajang.backend.claude.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PromptConditionDto {

    private String item;
    private int price;
    private String usagePeriod;
    private String itemCondition;

}
