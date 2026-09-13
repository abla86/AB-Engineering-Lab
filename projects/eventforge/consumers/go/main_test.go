package main

import "testing"

func TestValidateEvent(t *testing.T) {
    event := Event{
        ID:         "evt-1",
        Type:       "work.item.created",
        OccurredAt: "2026-09-13T00:00:00Z",
        Source:     "eventforge-api",
        Payload:    []byte(`{"itemId":"item-1","title":"Build EventForge"}`),
    }
    if err := validateEvent(event); err != nil {
        t.Fatalf("expected valid event, got %v", err)
    }
}

func TestValidateEventRejectsWrongType(t *testing.T) {
    event := Event{
        ID:         "evt-1",
        Type:       "work.item.updated",
        OccurredAt: "2026-09-13T00:00:00Z",
        Source:     "eventforge-api",
        Payload:    []byte(`{"itemId":"item-1","title":"Build EventForge"}`),
    }
    if err := validateEvent(event); err == nil {
        t.Fatal("expected unsupported event type to be rejected")
    }
}

func TestValidateEventRejectsMissingPayloadField(t *testing.T) {
    event := Event{
        ID:         "evt-1",
        Type:       "work.item.created",
        OccurredAt: "2026-09-13T00:00:00Z",
        Source:     "eventforge-api",
        Payload:    []byte(`{"itemId":"item-1"}`),
    }
    if err := validateEvent(event); err == nil {
        t.Fatal("expected missing title to be rejected")
    }
}
