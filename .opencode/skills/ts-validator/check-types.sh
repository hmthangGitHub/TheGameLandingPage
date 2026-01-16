#!/bin/bash
# Script to check TypeScript types
# Usage: ./check-types.sh

echo "Running TypeScript type check..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
  echo "Type check passed!"
else
  echo "Type errors found."
  exit 1
fi