package main

import (
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
}
