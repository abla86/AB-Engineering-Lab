# ChangeStory Web Demo

This is the visual, interactive browser demo for ChangeStory.

It is deliberately dependency-free so the demo can be opened as static files and reviewed without a backend.

## Interactions

- Executive / Technical view switch
- Source filtering on the timeline
- Evidence-level grouping
- Dependency-path visualization
- Investigation action checklist
- Reset state

The demo data is deterministic and is designed to show the product behavior before external integrations are added.

For production, this UI should consume the core story API rather than embedding demo data.
