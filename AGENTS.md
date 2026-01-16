# AGENTS.md - Development Guidelines for LandingPage

This document provides comprehensive guidelines for agentic coding assistants working on the LandingPage project, which consists of a Firebase Functions backend and a landing page frontend.

## Project Structure

```
LandingPage/
├── docs/                 # Landing page frontend (HTML/CSS/JS)
├── cloudfunctions/
│   ├── functions/        # Firebase Functions backend (TypeScript)
│   │   ├── src/         # Source code
│   │   ├── lib/         # Compiled JavaScript output
│   │   ├── package.json # Dependencies and scripts
│   │   ├── tsconfig.json # TypeScript configuration
│   │   └── .eslintrc.js  # ESLint configuration
│   └── firebase.json    # Firebase project configuration
```

## Build, Lint, and Test Commands

### Firebase Functions (Backend)

**Build Commands:**
- `npm run build` - Compile TypeScript to JavaScript (outputs to `lib/`)
- `npm run build:watch` - Watch mode for continuous compilation during development

**Lint Commands:**
- `npm run lint` - Run ESLint with full project analysis
- `npm run lint -- --fix` - Auto-fix ESLint issues where possible

**Development Commands:**
- `npm run serve` - Build and start Firebase emulators (functions + database)
- `npm run shell` - Build and start Firebase functions shell for testing
- `npm run deploy` - Deploy functions to production
- `npm run logs` - View production function logs

**Running Individual Tests:**
- No dedicated test framework configured
- Manual testing via `npm run shell` for interactive function testing
- Integration testing through Firebase emulators

### Frontend (docs/)

**Build Commands:**
- No build process configured (static HTML/CSS/JS)
- Files served directly from `docs/` directory

## Code Style Guidelines

### TypeScript/JavaScript

**Imports:**
```typescript
// Prefer named imports over default imports
import { onValueCreated } from "firebase-functions/v2/database";
import * as admin from "firebase-admin";

// Group imports: external libraries first, then internal modules
import { defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
```

**Naming Conventions:**
- **Variables/Functions:** camelCase (`emailData`, `sendWelcomeEmail`)
- **Constants:** UPPER_SNAKE_CASE (`BREVO_API_URL`, `API_KEY`)
- **Types/Interfaces:** PascalCase (`SubscriberData`, `EmailConfig`)
- **Files:** kebab-case for directories, camelCase for files (`index.ts`, `email-service.ts`)

**Formatting:**
- **Indentation:** 2 spaces (ESLint enforced)
- **Quotes:** Double quotes for strings (ESLint enforced)
- **Semicolons:** Required at end of statements
- **Line Length:** No strict limit, but prefer readable line breaks

**TypeScript Configuration:**
- Strict mode enabled (`"strict": true`)
- Target: ES2017 (`"target": "es2017"`)
- Module resolution: NodeNext (`"moduleResolution": "nodenext"`)
- Unused locals not allowed (`"noUnusedLocals": true`)

### Error Handling

**Firebase Functions Pattern:**
```typescript
try {
  // Function logic
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error("Error description:", error);
  throw error; // Re-throw to fail the function
}
```

**HTTP Requests:**
```typescript
const response = await fetch(url, options);
if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`API error: ${response.status} - ${errorText}`);
}
```

### Async/Await Patterns

**Always use async/await over Promises:**
```typescript
// Good
export const myFunction = async () => {
  try {
    const data = await fetchData();
    return processData(data);
  } catch (error) {
    console.error("Processing failed:", error);
    throw error;
  }
};

// Avoid
export const myFunction = () => {
  return fetchData()
    .then(processData)
    .catch(error => {
      console.error("Processing failed:", error);
      throw error;
    });
};
```

### Firebase Functions Best Practices

**Function Structure:**
```typescript
import { onValueCreated } from "firebase-functions/v2/database";

export const onSubscriberCreated = onValueCreated(
  "/path/{param}",
  async (event) => {
    const data = event.data.val();
    const param = event.params.param;

    // Function logic here
    return null; // Or processed result
  }
);
```

**Environment Variables:**
```typescript
import { defineString } from "firebase-functions/params";

const apiKey = defineString("API_KEY");
// Access with: apiKey.value()
```

### HTML/CSS/JavaScript (Frontend)

**HTML Structure:**
- Semantic HTML elements
- Proper accessibility attributes
- Mobile-responsive design (viewport meta tag)

**CSS Patterns:**
- CSS custom properties for theming
- Flexbox/Grid for layouts
- Mobile-first responsive design
- Consistent naming (BEM methodology encouraged)

**JavaScript:**
- Modern ES6+ features
- Async/await for asynchronous operations
- Proper error handling
- DOM manipulation best practices

### Security Considerations

**Never commit sensitive data:**
- API keys in `.env` files (not committed)
- Use Firebase Functions parameters for secrets
- Avoid logging sensitive information

**Input Validation:**
```typescript
// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error("Invalid email format");
}
```

### Git Workflow

**Commit Messages:**
- Use imperative mood: "Add user authentication", "Fix email validation"
- Keep first line under 50 characters
- Add detailed description for complex changes

**Branch Naming:**
- `feature/description` for new features
- `fix/issue-description` for bug fixes
- `refactor/component-name` for refactoring

### Testing Strategy

**Manual Testing:**
1. Use `npm run serve` to start emulators
2. Test functions via Firebase shell or direct emulator calls
3. Verify email sending functionality
4. Check database operations

**Integration Testing:**
- Test complete user flows (subscription → email sending)
- Verify error scenarios (API failures, invalid data)
- Check logging and monitoring

### Performance Considerations

**Firebase Functions:**
- Minimize cold start time
- Use appropriate memory allocation
- Optimize database queries
- Cache expensive operations when possible

**Frontend:**
- Optimize images and assets
- Minimize CSS/JS bundle size
- Use efficient DOM operations
- Implement lazy loading where appropriate

### Deployment Checklist

**Before Deploying Functions:**
- [ ] Run `npm run lint` - no ESLint errors
- [ ] Run `npm run build` - successful compilation
- [ ] Test functions in emulator environment
- [ ] Verify environment variables are configured
- [ ] Check function logs for errors

**Before Deploying Frontend:**
- [ ] Test all interactive elements
- [ ] Verify responsive design on multiple devices
- [ ] Check form validation
- [ ] Validate email collection functionality

This document should be updated as the project evolves. Always refer to the current codebase and configuration files for the most up-to-date requirements.</content>
<parameter name="filePath">E:\Workspace\LandingPage\AGENTS.md