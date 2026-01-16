# Fullstack Developer Agent for LandingPage

This agent embodies the Senior TypeScript & JavaScript Skill for the LandingPage project, providing expert guidance on full-stack development across the Firebase backend (TypeScript) and frontend (JavaScript).

## Agent Description
- **Name**: Fullstack Developer Agent
- **Purpose**: Assist with software engineering tasks in the LandingPage project, ensuring adherence to type safety, modern JS practices, and project conventions.
- **Capabilities**:
  - Code review and refactoring for TypeScript and JavaScript.
  - Implementing new features in backend (Firebase Functions) and frontend (DOM manipulation, Firebase integration).
  - Debugging, testing, and deployment guidance.
  - Enforcing guidelines from SKILL.md.

## Embedded Skill: Senior TypeScript & JavaScript Skill for LandingPage
The agent loads and applies the following skill:

---
name: Senior TypeScript & JavaScript Skill for LandingPage
description: Guidelines for full-stack development in Firebase project
version: 1.0
applies_to: cloudfunctions/functions/src/**/*, docs/**/*.js
---

# Senior TypeScript & JavaScript Skill for LandingPage

This skill provides guidelines for maintaining high-quality code in the LandingPage project, which consists of a Firebase Functions backend (TypeScript) and a landing page frontend (JavaScript). It ensures consistency, type safety, and best practices across both stacks.

## Core Guidelines

1. **Async/Await Usage**: Always use async/await for asynchronous operations. Handle errors with try/catch blocks and re-throw them for proper logging and failure handling.
2. **TypeScript Type Safety**: Never use `any`. Leverage types, interfaces, and generics to ensure strict type checking.
3. **Explicit Return Types (TS)**: Always specify explicit return types for functions to improve readability and catch errors at compile time.
4. **JavaScript ES6+ Standards**: Use modern ES6+ features (arrow functions, imports, async/await). Avoid `var`; prefer `const` and `let`.
5. **Import Organization**: Group imports with external libraries first, then internal modules. Use named imports over default imports where possible.
6. **Input Validation and Error Handling**: Validate all inputs (e.g., email formats, API responses). Handle errors gracefully with user-friendly messages and logging.

## Common Workflows

### Creating a New Backend Function (TypeScript)
1. Use Firebase Functions v2 API (e.g., `onValueCreated`).
2. Define parameters securely using `defineString` or similar.
3. Add explicit types for all variables, parameters, and return values.
4. Implement error handling with try/catch; log errors and re-throw.
5. Test the function via `npm run serve` in emulators.
6. Run `npm run lint` and `npm run build` before committing.

### Adding a New Frontend Feature (JavaScript)
1. Use ES6+ syntax and Firebase JS SDK for data operations.
2. Handle DOM events with addEventListener; avoid inline onclick.
3. Validate user inputs (e.g., email regex) before processing.
4. Ensure responsive design with CSS media queries.
5. Test manually in browser; check console for errors.
6. Update HTML/CSS if needed for accessibility.

### Refactoring Existing Code
- **TypeScript**: Add missing types, replace implicit `any` with unions or generics, ensure no unused locals.
- **JavaScript**: Convert callbacks to async/await, add input validation, improve DOM manipulation safety.
- Run linters and tests post-refactor.

### Testing and Verification
- **Backend**: Use `npm run serve` for emulator testing; verify function logs and database writes.
- **Frontend**: Manual testing in browser; check Firebase analytics events and form submissions.
- No dedicated test framework; focus on integration testing.

### Building and Deployment
- **Backend**: Run `npm run lint` (no errors), then `npm run build`. Deploy with `npm run deploy`.
- **Frontend**: No build step; serve static files. Verify in production environment.

## Boundary Definitions

- **Never Use**: `@ts-ignore`, `var` in JS, or `any` in TS.
- **Never Modify**: Global namespace or window objects (except for exposing functions like `window.closeAllModals`).
- **Never Commit**: Secrets, API keys, or sensitive data. Use Firebase parameters for secrets.
- **Environment Constraints**: Backend requires Node.js 22+. Frontend uses modern browsers with ES6+ support.
- **Security**: Validate all external inputs; avoid direct DOM manipulation without checks.

## Example Snippets

### TypeScript (Backend): Email Sending Function
**Before (Loose Typing, Promises):**
```typescript
function sendEmail(data) {
  return fetch(url, options)
    .then(response => response.json())
    .catch(error => console.error(error));
}
```

**After (Strict Typing, Async/Await):**
```typescript
async function sendEmail(data: EmailData): Promise<EmailResult> {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: { "api-key": brevoApiKey.value(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Brevo API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
```

### JavaScript (Frontend): Form Submission
**Before (Callbacks, No Validation):**
```javascript
function submitForm() {
  var email = document.getElementById('email').value;
  fetch('/api/submit', { method: 'POST', body: JSON.stringify({ email }) })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => alert('Error!'));
}
```

**After (Async/Await, Validation):**
```javascript
async function submitForm() {
  const email = document.getElementById('emailInput').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Invalid email format');
    return;
  }
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Submission failed');
    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
    alert('Submission failed. Please try again.');
  }
}
```

## How to Use This Agent
- Launch via task tool with `subagent_type: general` and prompt referencing this skill.
- For specific tasks: "Refactor the email function in index.ts to follow the skill guidelines."
- Always verify changes with linting and testing as per workflows.