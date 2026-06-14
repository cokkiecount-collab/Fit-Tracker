# Database Design

## Users

| Field | Type |
|---------|---------|
| id | UUID |
| email | String |
| created_at | Timestamp |

---

## Exercises

| Field | Type |
|---------|---------|
| id | UUID |
| name | String |
| muscle_group | String |

### Examples

- Bench Press
- EZ Preacher Curl
- Leg Press
- Chest Fly

---

## Workouts

| Field | Type |
|---------|---------|
| id | UUID |
| user_id | UUID |
| date | Timestamp |
| notes | Text |

---

## Workout Exercises

| Field | Type |
|---------|---------|
| id | UUID |
| workout_id | UUID |
| exercise_id | UUID |

---

## Sets

| Field | Type |
|---------|---------|
| id | UUID |
| workout_exercise_id | UUID |
| weight | Decimal |
| reps | Integer |
| set_number | Integer |

---

## Statistics

Derived from workout data:

- Total tonnage
- Personal records
- Most trained exercises
- Weekly volume
- Monthly volume

---

## Core Feature

When logging an exercise, the app should always display:

Last workout:
75 kg × 8 reps

This is one of the primary features of Fit-Tracker.
