package main

import (
portfolio/role-skill-showcase
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

	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/segmentio/kafka-go"
)

type EventPayload struct {
	ItemID string `json:"itemId"`
	Title  string `json:"title"`
}

type WorkEvent struct {
	ID         string      `json:"id"`
	Type       string      `json:"type"`
	OccurredAt string      `json:"occurredAt"`
	Source     string      `json:"source"`
	Payload    EventPayload `json:"payload"`
}

func main() {
	broker := envOrDefault("KAFKA_BROKER", "localhost:9092")
	topic := envOrDefault("KAFKA_TOPIC", "work-events")
	groupID := envOrDefault("KAFKA_GROUP", "eventforge-go")

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{broker},
		Topic:    topic,
		GroupID:  groupID,
		MinBytes: 1,
		MaxBytes: 10e6,
	})
	defer reader.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	log.Printf("GO consumer listening on %s/%s as %s", broker, topic, groupID)

	for {
		message, err := reader.ReadMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				return
			}
			log.Printf("read error: %v", err)
			continue
		}

		var event WorkEvent
		if err := json.Unmarshal(message.Value, &event); err != nil {
			log.Printf("GO REJECTED invalid JSON: %v", err)
			continue
		}

		if event.Type == "work.item.created" && event.Payload.Title != "" {
			fmt.Printf("GO CONSUMED %s: %s\n", event.Payload.ItemID, event.Payload.Title)
		} else {
			fmt.Println("GO REJECTED event")
		}
	}
}

func envOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
 main
}
