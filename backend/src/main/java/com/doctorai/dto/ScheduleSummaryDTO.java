package com.doctorai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleSummaryDTO {
    private int total;
    private int completed;
    private int inProgress;
    private int upcoming;
    private int cancelled;
}
