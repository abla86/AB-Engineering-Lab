package no.ab.showcase

enum class EventType { CREATED, UPDATED, DELETED }

/** Immutable work event; invalid values are rejected at construction time. */
data class WorkEvent(val id: String, val type: EventType, val bytes: Int) {
    init {
        require(id.isNotBlank()) { "id must not be blank" }
        require(bytes >= 0) { "bytes must not be negative" }
    }
}
