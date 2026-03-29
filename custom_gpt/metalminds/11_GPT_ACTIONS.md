# The Burro - Custom GPT Actions

## GitHub Integration for Memory Persistence

This file documents the OpenAPI actions that enable The Burro to remember conversations and log projects for Chuck and Susan.

---

## Action 1: Update Memory

**Name:** Update Memory
**Description:** Save notes, projects, and conversations to GitHub

**OpenAPI Schema:**
```yaml
openapi: 3.0.0
info:
  title: Burro Memory API
  version: 1.0.0
servers:
  - url: https://api.github.com
paths:
  /repos/voidrcb/Omega_Trader/dispatches:
    post:
      operationId: updateMemory
      summary: Update Burro memory via GitHub Actions
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - event_type
                - client_payload
              properties:
                event_type:
                  type: string
                  enum: [burro-memory-update]
                client_payload:
                  type: object
                  required:
                    - persona
                    - type
                  properties:
                    persona:
                      type: string
                      enum: [chuck, susan, shared]
                      description: Whose memory to update
                    type:
                      type: string
                      enum: [project, construction, equipment, conversation, decision, preference, delete]
                      description: Type of memory entry
                    entry:
                      type: object
                      description: The entry to append (for project/construction/equipment/conversation/decision)
                      properties:
                        timestamp:
                          type: string
                        title:
                          type: string
                        content:
                          type: string
                        tags:
                          type: array
                          items:
                            type: string
                    preference_update:
                      type: object
                      description: Preferences to merge (for type=preference)
                    delete_from:
                      type: string
                      description: File to delete from (for type=delete)
                    delete_pattern:
                      type: string
                      description: Pattern to match for deletion (for type=delete)
                    summary:
                      type: string
                      description: Short description for commit message
      responses:
        '204':
          description: Dispatch triggered successfully
      security:
        - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
```

---

## Action 2: Read Memory File

**Name:** Read Memory
**Description:** Read a memory file from GitHub

**OpenAPI Schema:**
```yaml
openapi: 3.0.0
info:
  title: Burro Memory Read API
  version: 1.0.0
servers:
  - url: https://api.github.com
paths:
  /repos/voidrcb/Omega_Trader/contents/{path}:
    get:
      operationId: readMemory
      summary: Read a memory file
      parameters:
        - name: path
          in: path
          required: true
          schema:
            type: string
          description: Path to file (e.g., "The Burro/memory/operator/chuck/projects.jsonl")
        - name: ref
          in: query
          schema:
            type: string
            default: main
      responses:
        '200':
          description: File content
          content:
            application/json:
              schema:
                type: object
                properties:
                  content:
                    type: string
                    description: Base64 encoded file content
                  sha:
                    type: string
                  name:
                    type: string
      security:
        - bearerAuth: []
```

---

## Entry Types

### Project Entry
```json
{
  "timestamp": "2026-03-21T10:00:00Z",
  "title": "Septic tank repair",
  "content": "Need to clear blockage near cabin 2. Parts ordered from Alpine.",
  "status": "in_progress",
  "tags": ["maintenance", "cabin-2", "priority-high"]
}
```

### Construction Entry
```json
{
  "timestamp": "2026-03-21T10:00:00Z",
  "title": "Tent platform foundation",
  "content": "16x16 platform with gravel base. Estimate 2 yards gravel needed.",
  "location": "east ridge",
  "materials": ["gravel", "pressure-treated lumber"],
  "status": "planning"
}
```

### Equipment Entry
```json
{
  "timestamp": "2026-03-21T10:00:00Z",
  "equipment": "Kubota KX040",
  "type": "maintenance",
  "content": "Changed oil and filters. Next service at 500 hours.",
  "hours": 423
}
```

### Conversation Entry
```json
{
  "timestamp": "2026-03-21T10:00:00Z",
  "topic": "Dark sky compliance",
  "summary": "Discussed outdoor lighting requirements. Need to replace porch lights with 2700K shielded fixtures.",
  "action_items": ["Order shielded lights from Amazon", "Check with IDA for compliance checklist"]
}
```

---

## Commands for Chuck and Susan

### To Remember Something
**Say:** "Remember this, Burro" or "Log this project"
**Action:** Creates a project or conversation entry

### To Record Equipment Notes
**Say:** "Log equipment note for the Kubota"
**Action:** Creates an equipment entry

### To Track Construction
**Say:** "Add construction note for the water cistern"
**Action:** Creates a construction entry

### To Remove Something
**Say:** "Remove the septic project from my list"
**Action:** Deletes matching entries

### To Check What's Stored
**Say:** "What projects do I have logged?"
**Action:** Reads and summarizes memory files

---

## Authentication Setup

1. In GPT Builder, add this action
2. Click "Authentication"
3. Select "API Key"
4. Auth Type: "Bearer"
5. Enter GitHub Personal Access Token with `repo` scope

---

## Memory Organization

```
The Burro/memory/operator/
├── chuck/
│   ├── projects.jsonl       # Active projects
│   ├── construction.jsonl   # Construction notes
│   ├── equipment.jsonl      # Equipment logs
│   ├── history.jsonl        # Conversation history
│   ├── decisions.jsonl      # Decisions made
│   └── preferences.json     # Preferences
├── susan/
│   └── (same structure)
└── shared/
    └── (shared notes for both)
```

---

*Actions configuration for The Burro Custom GPT*
