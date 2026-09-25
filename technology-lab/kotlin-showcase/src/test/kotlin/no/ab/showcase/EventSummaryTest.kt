package no.ab.showcase

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class EventSummaryTest {
    @Test
    fun countsEventsByTypeAndTotalsBytes() {
        val events = listOf(
            WorkEvent("e-1", EventType.CREATED, 512),
            WorkEvent("e-2", EventType.UPDATED, 128),
            WorkEvent("e-3", EventType.UPDATED, 256),
            WorkEvent("e-4", EventType.DELETED, 0),
        )

        val summary = EventSummary.of(events)

        assertEquals(4, summary.total)
        assertEquals(896L, summary.totalBytes)
        assertEquals(mapOf(EventType.CREATED to 1, EventType.UPDATED to 2, EventType.DELETED to 1), summary.byType)
    }

    @Test
    fun emptyInputGivesZeroForEveryType() {
        val summary = EventSummary.of(emptyList())

        assertEquals(0, summary.total)
        assertEquals(EventType.entries.associateWith { 0 }, summary.byType)
    }

    @Test
    fun rejectsInvalidEvents() {
        assertFailsWith<IllegalArgumentException> { WorkEvent(" ", EventType.CREATED, 1) }
        assertFailsWith<IllegalArgumentException> { WorkEvent("e", EventType.CREATED, -1) }
    }
}
