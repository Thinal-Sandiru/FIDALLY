# FIDALLY – AI & Voice Plan

FIDALLY is a physical AI companion paired with a mobile app. This folder covers the AI and voice side: how the device listens, replies, and turns a conversation into a diary entry or reminder.

> **Status:** Planning (Sprint 1). Voice conversation is built in Sprint 2.
> Items marked **TBD** are decisions the team still needs to confirm.

## 1. Purpose

Give users someone to talk to, and turn what they share into something useful, but only with their approval. The AI part of FIDALLY must:

1. **Reply naturally** to spoken conversation.
2. **Create diary entries** from what the user shares.
3. **Create reminders** from spoken requests.
4. **Respond to modes** (Study, Sleep) and **music** requests.

## 2. Conversation-to-action workflow

This is FIDALLY's core idea. One conversation can lead to a user-approved outcome.

```
User speaks → Speech-to-text → Understand intent → Reply (text-to-speech)
                                      │
                       ┌──────────────┼───────────────┐
                    Chat only    Diary summary     Reminder
                                      │               │
                              Ask user to confirm → Save only if approved
                                      │
                              Visible in the mobile app
                         (review / edit / delete anytime)
```

**Rule:** nothing is saved without the user's approval.

## 3. Pipeline

| Stage | What it does | Options being considered |
|---|---|---|
| Wake / listen | Detects when the user is talking to FIDALLY | TBD |
| Speech-to-text (STT) | Converts speech to text | TBD (cloud AI service or on-device model) |
| Intent understanding | Decides: chat, diary, reminder, mode change, music | TBD (language model with a simple intent prompt) |
| Reply generation | Writes a friendly, natural reply | TBD (existing AI service) |
| Text-to-speech (TTS) | Speaks the reply through the speaker | TBD |
| Summariser | Turns a conversation into a short diary entry | TBD |
| Reminder parser | Extracts the task and time from a request | TBD |

## 4. Supported voice intents

| Intent | Example | Result |
|---|---|---|
| Chat | "I had a rough day." | Spoken reply |
| Diary | "Save that in my diary." | Draft summary → user confirms → saved |
| Reminder | "Remind me to call mum at 6 pm." | Draft reminder → user confirms → saved |
| Mode | "Switch to Sleep Mode." | Device changes mode |
| Music | "Play track 3." | Plays one of the 10 tracks |

## 5. Privacy rules for the AI

- Personal data stays in the device's local memory. The user chooses what is shared with the app.
- Diary and reminder data are kept separate from developer-controlled settings.
- No saving without confirmation.
- Be clear about what is sent to any external AI service, and send only what is needed.
- FIDALLY complements human relationships and professional support. It does not replace them.

## 6. Out of scope (for now)

Distress detection and safety responses, proactive check-ins and daily recaps, and automatic data-retention rules.

## 7. Plan by sprint

| Sprint | AI/voice work |
|---|---|
| 1 | Finalise this plan; choose STT, language model and TTS options |
| 2 | Voice conversation working on the device; device replies to speech |
| 3 | Diary summaries and reminder parsing, end to end |
| 4 | Mode and music voice commands; testing and polish |

## 8. Open questions

- [ ] Which STT / TTS / language model services will we use?
- [ ] Which languages must be supported (English only, or also Sinhala/Tamil)?
- [ ] What runs on the device and what runs in the cloud?
- [ ] How do we handle unclear speech or background noise?

## 9. Owner

Michelle (AI development)
