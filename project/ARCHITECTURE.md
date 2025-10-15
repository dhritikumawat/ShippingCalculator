# Project Architecture - MVC Design Pattern

This application follows the **Model-View-Controller (MVC)** design pattern, ensuring a clear separation between presentation logic and business logic.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                      VIEW LAYER                      │
│  (Presentation - React Components)                   │
│                                                       │
│  - src/components/AddBox.tsx                         │
│  - src/components/BoxList.tsx                        │
│  - src/components/Navbar.tsx                         │
│  - src/App.tsx                                       │
└────────────────────┬────────────────────────────────┘
                     │
                     │ User Interactions
                     ▼
┌─────────────────────────────────────────────────────┐
│                  CONTROLLER LAYER                    │
│  (Business Logic - Services)                         │
│                                                       │
│  - src/services/boxService.ts                        │
│  - src/services/shippingService.ts                   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Data Operations
                     ▼
┌─────────────────────────────────────────────────────┐
│                    MODEL LAYER                       │
│  (Data Layer - Database & Types)                     │
│                                                       │
│  - src/lib/supabase.ts                               │
│  - src/types/database.ts                             │
│  - src/types/index.ts                                │
│  - supabase/migrations/                              │
└─────────────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. MODEL Layer (Data)
**Location:** `src/lib/`, `src/types/`, `supabase/migrations/`

**Responsibilities:**
- Database schema definition and migrations
- Type definitions for data structures
- Supabase client configuration
- Data validation at the database level

**Files:**
- `src/lib/supabase.ts` - Database client singleton
- `src/types/database.ts` - Database schema types
- `src/types/index.ts` - Application domain types
- `supabase/migrations/*.sql` - Database schema with constraints and RLS policies

**Key Features:**
- Row Level Security (RLS) policies
- Database constraints for data integrity
- Type-safe database operations

---

### 2. CONTROLLER Layer (Business Logic)
**Location:** `src/services/`

**Responsibilities:**
- Business logic implementation
- Data transformation and calculations
- API calls and data persistence
- Format conversions (RGB, currency)

**Files:**

#### `src/services/boxService.ts`
- `saveBox()` - Saves box data to database with calculated shipping cost
- `fetchBoxes()` - Retrieves all boxes from database

#### `src/services/shippingService.ts`
- `calculateShippingCost()` - Calculates cost based on weight and destination
- `COUNTRIES` - Country configuration with multipliers
- `formatCurrency()` - Formats numbers as INR currency
- `rgbStringToObject()` - Converts RGB string to object
- `rgbObjectToString()` - Converts RGB values to string
- `getCountryName()` - Gets country name from code

**Key Features:**
- Pure business logic functions
- No UI dependencies
- Easily testable
- Reusable across components

---

### 3. VIEW Layer (Presentation)
**Location:** `src/components/`, `src/App.tsx`

**Responsibilities:**
- User interface rendering
- User input handling
- UI state management (local)
- Display formatting

**Files:**

#### `src/components/AddBox.tsx` (Form View)
- Form input handling
- Client-side validation
- Calls `boxService.saveBox()` for persistence
- Uses `shippingService` for cost estimation

#### `src/components/BoxList.tsx` (Table View)
- Data display in tabular format
- Calls `boxService.fetchBoxes()` for data
- Uses `shippingService` for formatting

#### `src/components/Navbar.tsx`
- Navigation between views
- Application routing

#### `src/App.tsx` (Main Controller)
- Application state management
- View routing logic
- Coordinates between views

**Key Features:**
- No business logic in components
- Delegates calculations to service layer
- Focuses purely on presentation

---

## Data Flow

### Adding a Box (Write Operation)
```
1. User fills form → AddBox.tsx (VIEW)
2. User clicks Save → Form validation (VIEW)
3. Form calls boxService.saveBox() → (CONTROLLER)
4. Service calculates shipping cost → shippingService.calculateShippingCost()
5. Service saves to database → supabase.from('boxes').insert() (MODEL)
6. Database validates constraints → (MODEL)
7. Success callback → Updates UI (VIEW)
8. Triggers refresh → Navigates to list view
```

### Viewing Boxes (Read Operation)
```
1. User navigates to list → App.tsx sets view state (VIEW)
2. BoxList component mounts → Calls boxService.fetchBoxes() (CONTROLLER)
3. Service queries database → supabase.from('boxes').select() (MODEL)
4. Data returned → Service returns to component (CONTROLLER)
5. Component formats display → Uses shippingService helpers (VIEW)
6. Renders table → User sees boxes (VIEW)
```

---

## Separation of Concerns

### What Each Layer CANNOT Do

**VIEW Layer:**
- ❌ Cannot perform calculations
- ❌ Cannot make direct database calls
- ❌ Cannot contain business rules
- ✅ Only handles UI and user interactions

**CONTROLLER Layer:**
- ❌ Cannot contain JSX or UI code
- ❌ Cannot manage React state
- ❌ Cannot directly manipulate DOM
- ✅ Only handles business logic and data operations

**MODEL Layer:**
- ❌ Cannot contain business logic
- ❌ Cannot format data for display
- ❌ Cannot handle user input
- ✅ Only defines data structure and persistence

---

## Benefits of This Architecture

1. **Maintainability**: Each layer has a single responsibility
2. **Testability**: Business logic can be tested without UI
3. **Reusability**: Services can be used by multiple components
4. **Scalability**: Easy to add new views or business rules
5. **Code Organization**: Clear structure for team collaboration
6. **Type Safety**: TypeScript types flow through all layers

---

## Example: Following MVC Pattern

### ❌ Bad Practice (No MVC)
```typescript
// Everything in the component
function AddBox() {
  const handleSubmit = async () => {
    const cost = weight * 7.35; // Business logic in view
    await supabase.from('boxes').insert({ ... }); // Direct DB call
  }
}
```

### ✅ Good Practice (MVC Pattern)
```typescript
// VIEW - Only UI concerns
function AddBox() {
  const handleSubmit = async () => {
    await saveBox(formData); // Delegates to controller
  }
}

// CONTROLLER - Business logic
export const saveBox = async (data) => {
  const cost = calculateShippingCost(data.weight, data.country);
  return await supabase.from('boxes').insert({ ...data, cost });
}
```

---

## State Management

**Application State (Global):**
- Current view ('form' | 'list')
- Refresh trigger for data refetch
- Managed in `App.tsx`

**Component State (Local):**
- Form input values
- Loading states
- Error messages
- Success messages
- Managed in individual components

**Server State (Database):**
- Boxes data
- Fetched via services
- Cached in component state

---

## Testing Strategy

Due to MVC separation, testing is straightforward:

1. **Model**: Test database constraints and migrations
2. **Controller**: Test business logic functions in isolation
3. **View**: Test component rendering and user interactions

Example:
```typescript
// Easy to test without UI
describe('calculateShippingCost', () => {
  it('calculates cost for Sweden', () => {
    expect(calculateShippingCost(10, 'SWEDEN')).toBe(73.5);
  });
});
```

---

## Conclusion

This MVC architecture ensures:
- Clear separation between UI and logic
- Easy to understand and maintain
- Professional, production-ready code structure
- Scalable for future enhancements
