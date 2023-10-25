New Note Diagram:

```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Enter note
    user->>browser: Save note
    browser -->> user: push new note to note list

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
```
