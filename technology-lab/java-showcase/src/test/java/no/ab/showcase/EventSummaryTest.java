package no.ab.showcase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class EventSummaryTest {

    @Test
    void countsEventsByTypeAndTotalsBytes() {
        List<WorkEvent> events = List.of(
                new WorkEvent("e-1", WorkEvent.Type.CREATED, 512),
                new WorkEvent("e-2", WorkEvent.Type.UPDATED, 128),
                new WorkEvent("e-3", WorkEvent.Type.UPDATED, 256),
                new WorkEvent("e-4", WorkEvent.Type.DELETED, 0));

        EventSummary summary = EventSummary.of(events);

        assertEquals(4, summary.total());
        assertEquals(896L, summary.totalBytes());
        assertEquals(Map.of(
                WorkEvent.Type.CREATED, 1L,
                WorkEvent.Type.UPDATED, 2L,
                WorkEvent.Type.DELETED, 1L), summary.byType());
    }

    @Test
    void emptyInputGivesZeroCountsForEveryType() {
        EventSummary summary = EventSummary.of(List.of());

        assertEquals(0, summary.total());
        assertEquals(0L, summary.totalBytes());
        assertEquals(3, summary.byType().size());
    }

    @Test
    void rejectsInvalidEvents() {
        assertThrows(IllegalArgumentException.class, () -> new WorkEvent(" ", WorkEvent.Type.CREATED, 1));
        assertThrows(IllegalArgumentException.class, () -> new WorkEvent("e", null, 1));
        assertThrows(IllegalArgumentException.class, () -> new WorkEvent("e", WorkEvent.Type.CREATED, -1));
    }
}
