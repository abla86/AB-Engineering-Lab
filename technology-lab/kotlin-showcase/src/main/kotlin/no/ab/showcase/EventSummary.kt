package no.ab.showcase

/** Aggregated view over a list of events. */
data class EventSummary(val total: Int, val totalBytes: Long, val byType: Map<EventType, Int>) {
    companion object {
        fun of(events: List<WorkEvent>): EventSummary = EventSummary(
            total = events.size,
            totalBytes = events.sumOf { it.bytes.toLong() },
            byType = EventType.entries.associateWith { type -> events.count { it.type == type } },
        )
    }
}
