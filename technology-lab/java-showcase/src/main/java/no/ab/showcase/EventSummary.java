package no.ab.showcase;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Aggregated view over a list of events, computed with streams. */
public record EventSummary(int total, long totalBytes, Map<WorkEvent.Type, Long> byType) {

    public static EventSummary of(List<WorkEvent> events) {
        Map<WorkEvent.Type, Long> counted = new EnumMap<>(WorkEvent.Type.class);
        for (WorkEvent.Type type : WorkEvent.Type.values()) {
            counted.put(type, 0L);
        }
        counted.putAll(events.stream().collect(Collectors.groupingBy(WorkEvent::type, Collectors.counting())));

        long totalBytes = events.stream().mapToLong(WorkEvent::bytes).sum();
        return new EventSummary(events.size(), totalBytes, Map.copyOf(counted));
    }
}
