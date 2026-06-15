# Phase 24A Report — Saved Dietary Preferences and Allergen Settings

## Phase Goal

Add a real user-facing product feature to AI Food Passport: local dietary preferences and allergen settings.

This lets the user configure what they avoid (allergens, dietary restrictions), and those preferences are used to highlight or warn about matching allergenes in analyzed dishes.

---

## Feature Summary

Users can now:
- Open **ProfileScreen** → tap **"Dietary Preferences"**
- Toggle common allergenes (gluten, dairy, eggs, nuts, peanuts, soy, fish, shellfish)
- Toggle dietary restrictions (vegetarian, vegan, pork-free, alcohol-free, shellfish-free)
- Preferences persist across app restarts (via `shared_preferences`)
- When a scanned dish contains a user-selected allergen, a **"Matches your avoid list"** warning badge appears in the result card
- A yellow disclaimer banner reminds users that this is not a medical diagnosis

---

## Files Changed

### Modified (5)

1. `lib/app/router/route_names.dart` — added `dietaryPreferences` route name
2. `lib/app/router/app_router.dart` — added `/dietary-preferences` route
3. `lib/core/widgets/result_card.dart` — converted to `ConsumerWidget`, added allergen match warning UI
4. `lib/features/passport/presentation/screens/profile_screen.dart` — added "Dietary Preferences" navigation tile
5. `lib/features/shared/domain/models/models.dart` — added export for `DietaryPreferencesModel`

### Created (5)

1. `lib/features/shared/domain/models/dietary_preferences_model.dart` — dietary preferences data model
2. `lib/features/shared/data/dietary_preferences_provider.dart` — Riverpod provider with `shared_preferences` persistence
3. `lib/features/dietary/presentation/screens/dietary_preferences_screen.dart` — preferences editing screen
4. `test/features/shared/domain/models/dietary_preferences_model_test.dart` — model unit tests (15 tests)
5. `test/features/shared/data/dietary_preferences_provider_test.dart` — provider unit tests (6 tests)
6. `test/core/widgets/result_card_allergen_warning_test.dart` — widget tests for allergen warning UI (2 tests)

---

## Persistence Behavior

✅ **Persistent across app restarts**

- Uses `shared_preferences` (already in `pubspec.yaml`: `^2.3.5`, resolved to `2.5.5`)
- Storage key: `dietary_preferences`
- JSON format: `{"selectedAllergens": [...], "dietaryRestrictions": [...]}`
- Loads automatically when app starts (in `DietaryPreferencesNotifier` constructor)

---

## User-Facing Behavior

1. **ProfileScreen** has a new **"Dietary Preferences"** row
2. Tapping it opens **DietaryPreferencesScreen**
3. Allergen grid shows 8 common allergens with toggle buttons
4. Dietary restrictions list shows 5 options with checkmarks
5. Clear button appears when preferences are active (with confirmation dialog)
6. Disclaimer banner at top of preferences screen
7. **ResultsScreen** — when a dish contains user's selected allergens:
   - A orange **"Matches your avoid list"** badge appears in the dish's `ResultCard`
   - Yellow **"Contains: [allergen]"** container appears above the recommendation reason

---

## How Preferences Affect Scan Results

In `ResultCard.build()`:

```dart
final dietaryPreferences = ref.watch(dietaryPreferencesProvider);
final hasAllergenMatch = dietaryPreferences.matchesDishAllergens(dish.allergens);
```

- `matchesDishAllergens()` does **case-insensitive** intersection check
- Matching allergens are shown in the UI
- If no preferences selected → no warning (behavior unchanged)

---

## Safety Wording Used

- Disclaimer banner: *"This app provides information for reference only. Always verify ingredients and consult with restaurant staff about allergens. This is not a medical diagnosis."*
- Badge text: **"Matches your avoid list"** (not "dangerous" or "unsafe")
- Allergen match text: **"Contains: [allergen]"** (factual, not alarming)

---

## Tests Added

### `dietary_preferences_model_test.dart` (15 tests)

- Creates empty preferences by default
- `copyWith` updates selected fields
- `toggleAllergen` adds/removes allergen
- `toggleDietaryRestriction` adds/removes restriction
- `matchesDishAllergens` returns correct boolean
- `matchesDishAllergens` is case-insensitive
- `getMatchingAllergens` returns correct matches
- `toJson` and `fromJson` preserve data
- Equality works correctly

### `dietary_preferences_provider_test.dart` (6 tests)

- Starts with empty preferences
- `toggleAllergen` adds allergen
- `toggleAllergen` removes allergen when already present
- `toggleDietaryRestriction` adds restriction
- `clear` removes all preferences
- `update` replaces all preferences

### `result_card_allergen_warning_test.dart` (2 tests)

- Shows no allergen warning when no preferences selected
- Shows allergen warning when dish matches user preferences

---

## Flutter Test Result

✅ **96/96 tests pass**

- Original tests: 73
- New tests: 23
- All passing

---

## Verification Checklist

| Check | Result |
|-------|--------|
| `git status --short` | 5 modified, 6 new files |
| `git diff --name-status` | Only `lib/` and `test/` files modified |
| `git diff --check` | No whitespace errors |
| iOS config changed | ❌ No |
| Backend code changed | ❌ No |
| `pubspec.yaml` changed | ❌ No (shared_preferences already present) |
| Render config changed | ❌ No |
| App icon/launch screen changed | ❌ No |
| Secrets/API keys added | ❌ No |
| Firebase added | ❌ No |
| `productionReady` changed | ❌ No |
| Real providers enabled | ❌ No |

---

## Files NOT Modified (Confirmed)

- `ios/`
- `backend/`
- `.env`
- Firebase files
- App icon assets
- Launch screen assets
- `pubspec.yaml`
- `lib/config/` (backend config files)

---

## Next Recommended Phase

**Phase 24B: Dietary Preferences UI Polish & Edge Cases**

Potential improvements:
- Add a "Select All" / "Clear All" shortcut in DietaryPreferencesScreen
- Show a summary of active preferences in ProfileScreen's "Dietary Preferences" row
- Animate the allergen warning badge in ResultCard
- Add a "Why am I seeing this?" info dialog for the allergen match warning
- Write widget tests for DietaryPreferencesScreen (requires `pumpRoute` or router setup)

---

## Summary

✅ Phase 24A is **code-complete and test-complete**.

- **Feature works**: User can set allergen preferences, and matching dishes are flagged in scan results.
- **Persistent**: Preferences survive app restarts via `shared_preferences`.
- **Safe**: Disclaimer present, wording is not medical/diagnostic.
- **Tested**: 96/96 tests pass (73 existing + 23 new).
- **No forbidden changes**: No iOS, backend, secrets, or provider changes.

---

**Do NOT commit automatically** — user will commit manually.
