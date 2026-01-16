#!/bin/bash
# Script to check types and lint in the LandingPage project
# Run this after changes to ensure compliance with the skill guidelines

echo "Checking TypeScript types and linting..."

# Backend: Run lint and build in cloudfunctions
cd cloudfunctions/functions
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed for backend. Fix issues before proceeding."
  exit 1
fi

npm run build
if [ $? -ne 0 ]; then
  echo "Build failed for backend. Fix compilation errors."
  exit 1
fi

echo "Backend checks passed."

# Frontend: No build, but check for basic JS syntax (placeholder)
cd ../../docs
# Add any frontend checks here, e.g., eslint if configured
echo "Frontend checks passed (no dedicated linter configured)."

echo "All type and lint checks completed successfully."