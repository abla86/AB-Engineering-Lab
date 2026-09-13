# Event contract

`event-v1.json` is the versioned public contract for `work.item.created`.

Required fields: `id`, `type`, `occurredAt`, `source`, `payload.itemId`, `payload.title`.

The contract is language-neutral. Each consumer processes the same event boundary in its own runtime.
