// Global type declarations for Jest and testing-library
import '@testing-library/jest-dom';

declare namespace NodeJS {
  interface Global {
    document: Document;
    window: Window;
    navigator: Navigator;
  }
}
