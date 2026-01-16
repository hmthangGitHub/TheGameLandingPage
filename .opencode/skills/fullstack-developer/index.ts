// Helper utilities for fullstack development in LandingPage
// This file provides common functions and types that the agent can use

export interface EmailData {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailResult {
  messageId: string;
  // Add other Brevo API response fields as needed
}

export async function validateEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeEmailForKey(email: string): string {
  return email.replace(/[.#$\[\]]/g, '_');
}

// Frontend utility for DOM safety
export function safeGetElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

// Example async function wrapper for frontend
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}