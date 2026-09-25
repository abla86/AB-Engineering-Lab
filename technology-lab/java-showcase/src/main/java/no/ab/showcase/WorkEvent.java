package no.ab.showcase;

/** Immutable work event. Validation happens in the compact canonical constructor. */
public record WorkEvent(String id, Type type, int bytes) {

    public enum Type { CREATED, UPDATED, DELETED }

    public WorkEvent {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("id must not be blank");
        }
        if (type == null) {
            throw new IllegalArgumentException("type must not be null");
        }
        if (bytes < 0) {
            throw new IllegalArgumentException("bytes must not be negative");
        }
    }
}
