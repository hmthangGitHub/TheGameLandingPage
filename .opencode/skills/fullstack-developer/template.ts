// Template file for common types in LandingPage project
// Copy this to your source files and customize as needed

export interface SubscriberData {
  email: string;
  landing_page_version?: string;
  timestamp?: number;
  createdAt?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface Metadata {
  title: string;
  developer: string;
  about: string;
  screenshotCount: number;
}

// Add more interfaces as the project grows