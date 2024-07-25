import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Suppress act() warnings
configure({ asyncUtilTimeout: 5000 });

// Suppress specific console warnings if needed
const originalError = console.error;
console.error = (...args) => {
  if (/Warning: ReactDOM.render is no longer supported in React 18./.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};