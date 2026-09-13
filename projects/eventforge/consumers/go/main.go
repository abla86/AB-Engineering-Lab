package main

import (
    "bufio"
    "encoding/json"
    "errors"
    "fmt"
    "os"
)

type Event struct {
    ID         string          `json:"id"`
    Type       string          `json:"type"`
    OccurredAt string          `json:"occurredAt"`
    Source     string          `json:"source"`
    Payload    json.RawMessage `json:"payload"`
}

func validateEvent(event Event) error {
    if event.ID == "" || event.Type == "" || event.OccurredAt == "" || event.Source == "" || len(event.Payload) == 0 {
        return errors.New("event is missing a required field")
    }
    if event.Type != "work.item.created" {
        return fmt.Errorf("unsupported event type: %s", event.Type)
    }

    var payload struct {
        ItemID string `json:"itemId"`
        Title  string `json:"title"`
    }
    if err := json.Unmarshal(event.Payload, &payload); err != nil {
        return fmt.Errorf("invalid payload: %w", err)
    }
    if payload.ItemID == "" || payload.Title == "" {
        return errors.New("payload is missing itemId or title")
    }
    return nil
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    for scanner.Scan() {
        var event Event
        if err := json.Unmarshal(scanner.Bytes(), &event); err != nil {
            fmt.Printf("REJECT invalid-json: %v\n", err)
            continue
        }
        if err := validateEvent(event); err != nil {
            fmt.Printf("REJECT: %v\n", err)
            continue
        }
        fmt.Printf("ACCEPT %s %s\n", event.ID, event.Type)
    }
    if err := scanner.Err(); err != nil {
        fmt.Fprintf(os.Stderr, "input error: %v\n", err)
        os.Exit(1)
    }
}
