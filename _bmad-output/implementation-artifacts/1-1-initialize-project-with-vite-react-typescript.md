# Story 1.1: Initialize Project with Vite + React + TypeScript

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to set up the project with Vite + React + TypeScript,
So that I have a modern, optimized foundation for building the price comparison platform.

## Acceptance Criteria

**Given** a new project is to be created for Retail-recommendation-system
**When** I run the Vite initialization commands
**Then** a React 19 + TypeScript project is created successfully
**And** MUI v6 and Emotion are installed and configured
**And** Jest and React Testing Library are installed with manual Vite configuration
**And** the project structure follows type-based organization
**And** a separate `__tests__/` directory is created mirroring `src/`
**And** Vite configuration is set up for bundle optimization
**And** the development server starts successfully on port 5173

## Tasks / Subtasks

- [x] Task 1: Create Vite + React + TypeScript project (AC: 1, 8)
  - [x] Run `npm create vite@latest retail-recommendation-system -- --template react-ts`
  - [x] Navigate into project directory: `cd retail-recommendation-system`
  - [x] Run `npm install` to install base dependencies
  - [x] Verify development server starts: `npm run dev` (should start on port 5173)

- [x] Task 2: Install MUI v6 and Emotion (AC: 2)
  - [x] Run `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`
  - [x] Run `npm install @fontsource/roboto` for Roboto font
  - [x] Verify MUI is installed by checking package.json dependencies

- [x] Task 3: Install Jest and testing dependencies (AC: 3)
  - [x] Run `npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest identity-obj-proxy`
  - [x] Create `jest.config.cjs` file with proper Vite configuration
  - [x] Configure moduleNameMapper for CSS/asset mocking using identity-obj-proxy
  - [x] Configure transform for TypeScript files using ts-jest
  - [x] Add test script to package.json: `"test": "jest"`
  - [x] Install `jest-environment-jsdom` (additional dependency discovered during testing)

- [x] Task 4: Set up type-based project structure (AC: 4, 5)
  - [x] Create `src/components/` directory (PascalCase.tsx files)
  - [x] Create `src/hooks/` directory (usePascalCase.ts files)
  - [x] Create `src/services/` directory (camelCase.ts files)
  - [x] Create `src/utils/` directory (camelCase.ts files)
  - [x] Create `src/types/` directory (PascalCase.types.ts files)
  - [x] Create `src/context/` directory (PascalCaseContext.tsx files)
  - [x] Create `src/constants/` directory (camelCase.ts files)
  - [x] Create `src/assets/` directory for static assets
  - [x] Create `src/theme/` directory for MUI theme configuration
  - [x] Create `__tests__/` directory mirroring src/ structure
    - [x] `__tests__/components/`
    - [x] `__tests__/hooks/`
    - [x] `__tests__/services/`
    - [x] `__tests__/utils/`
  - [x] Create `__mocks__/` directory for test mocks

- [x] Task 5: Configure Vite for bundle optimization (AC: 6, 7)
  - [x] Update `vite.config.ts` with build optimization settings
  - [x] Set target bundle size: < 200KB initial bundle
  - [x] Enable code splitting with build.rollupOptions.output.manualChunks
  - [x] Configure asset optimization (images, fonts)
  - [x] Verify build output: `npm run build` ✅ (181.96 KB for main bundle, under 200KB target)

- [x] Task 6: Verify all configurations work together (AC: 1-8)
  - [x] Run `npm run dev` - verify dev server starts on port 5173 ✅
  - [x] Run `npm run build` - verify production build succeeds ✅
  - [x] Run `npm run test` - verify Jest configuration works ✅
  - [x] Check that all required directories exist ✅
  - [x] Verify TypeScript compiles without errors: `npx tsc --noEmit` ✅

## Dev Notes

### Architecture Compliance (from Architecture Document)

**Critical Technology Stack Decisions:**
- **Frontend Framework:** React 19 (latest)
- **Build Tool:** Vite 6+ (recommended over deprecated CRA)
- **Language:** TypeScript with strict mode enabled
- **UI Library:** MUI v7 + Emotion (CSS-in-JS)
- **Testing:** Jest + React Testing Library (manual Vite configuration required)

**Starter Template Commands (MUST FOLLOW EXACTLY):**
```bash
npm create vite@latest retail-recommendation-system -- --template react-ts
cd retail-recommendation-system
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest identity-obj-proxy
```

**Why This Approach:**
- Create React App is officially deprecated (February 2025) and broken with React 19
- Vite is the React team's recommended alternative with 10-100x faster HMR
- MUI v7 provides WCAG AA compliant components (accessibility requirement)
- Jest requires manual configuration to work with Vite (Vitest is default but user prefers Jest)

### Project Structure Notes

**Type-based organization (per Architecture):**
```
src/
├── components/      # React components (PascalCase.tsx)
├── hooks/           # Custom hooks (usePascalCase.ts)
├── services/        # API/DB clients (camelCase.ts)
├── utils/           # Pure utilities (camelCase.ts)
├── types/           # TypeScript interfaces (PascalCase.types.ts)
├── context/         # React contexts (PascalCaseContext.tsx)
├── constants/       # Constants (camelCase.ts)
└── assets/          # Static assets

__tests__/            # Separate test directory (mirrors src/)
├── components/
├── hooks/
├── services/
└── utils/
```

**Naming Conventions (MUST FOLLOW):**
- Component files: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Custom hooks: `usePascalCase.ts` (e.g., `useSearch.ts`)
- Utility files: `camelCase.ts` (e.g., `apiClient.ts`)
- Type files: `PascalCase.types.ts` (e.g., `Product.types.ts`)
- Constant exports: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

### Jest Configuration for Vite

**Critical: Manual jest.config.cjs Required**
Vite doesn't include Jest by default. Create `jest.config.cjs`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ]
};
```

### Vite Configuration

**Bundle Optimization Settings (vite.config.ts):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'react-vendor': ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 200 // Warn if chunks exceed 200KB
  }
});
```

### Performance Requirements

**Bundle Size Targets (from Architecture NFR-PERF-03):**
- Initial bundle: < 200KB compressed
- Code splitting enabled by default
- Tree shaking with Rollup
- Lazy loading for routes (React.lazy)

**Development Server:**
- Default port: 5173 (Vite default)
- Hot Module Replacement: Instant updates
- Fast Refresh: Preserves component state

### Testing Standards

**Jest + React Testing Library:**
- Unit tests for utilities, hooks, services
- Component tests for React components
- Test file location: `__tests__/` (not co-located)
- Test naming: `SourceName.test.tsx`

**Test Scripts (package.json):**
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### MUI Configuration

**Theme Setup (src/theme/index.ts):**
```typescript
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Body text minimum 16px (WCAG AA requirement)
    body1: { fontSize: '1rem' } // 16px
  }
});

theme = responsiveFontSizes(theme);
export default theme;
```

### TypeScript Configuration

**tsconfig.json (from Vite template):**
- Strict mode enabled by default
- Target: ES2020
- Module resolution: Node
- JSX: React-jsx
- Path aliases: Can be configured for cleaner imports (@components, etc.)

### Accessibility Considerations

**WCAG AA Compliance (from UX Design):**
- MUI components provide built-in accessibility (keyboard nav, ARIA, focus management)
- Minimum body text: 16px (configured in theme)
- High contrast ratios: Verify colors meet 4.5:1 for normal text, 3:1 for large text
- Touch targets: 44x44px minimum (MUI Button components meet this)

### Dependencies to Install

**Production Dependencies:**
```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
```

**Development Dependencies:**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest identity-obj-proxy
```

**Why These Versions:**
- MUI v7: Latest stable with React 19 support and WCAG AA compliance
- Emotion: MUI's native styling engine (avoids conflicts)
- Jest 30+: Industry standard testing framework
- React Testing Library 16+: Encourages testing user behavior, not implementation
- identity-obj-proxy: Mocks CSS modules for Jest

### References

**Source: Architecture Document**
- Section: "Starter Template Evaluation" - Vite selection rationale
- Section: "Implementation Patterns & Consistency Rules" - Naming conventions
- Section: "Project Structure & Boundaries" - Complete directory structure
- Section: "Testing Strategy" - Jest configuration requirements
- File: `_bmad-output/planning-artifacts/architecture.md`

**Source: PRD**
- NFR-PERF-03: Application initial bundle size must not exceed 200KB (compressed)
- NFR-A11Y-07: Body text must be minimum 16px font size
- File: `_bmad-output/planning-artifacts/prd.md`

**Source: UX Design Specification**
- WCAG AA compliance requirements
- MUI v6 design system
- File: `_bmad-output/planning-artifacts/ux-design-specification.md`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Implementation Plan

**Phase 1: Project Initialization**
- Used Vite create command with react-ts template
- Moved files from temp directory to project root
- Updated package.json name to retail-recommendation-system

**Phase 2: Dependencies Installation**
- Installed base dependencies via npm install
- Installed MUI v7.3.7, Emotion, and related packages
- Installed Jest 30.2.0 and testing libraries
- Added jest-environment-jsdom for Jest 28+ compatibility

**Phase 3: Configuration**
- Created jest.config.cjs with proper Vite configuration
- Updated vite.config.ts with bundle optimization settings
- Added test scripts to package.json
- Created MUI theme with WCAG AA compliance

**Phase 4: Directory Structure**
- Created type-based organization per Architecture document
- Created separate __tests__/ directory
- Created __mocks__/ for test asset mocking

**Phase 5: Validation**
- Verified dev server starts on port 5173
- Verified production build succeeds (181.96 KB bundle)
- Verified Jest configuration works
- Verified TypeScript compilation

### Debug Log References

None - Initial project setup story

### Completion Notes List

**Implementation Summary:**
1. ✅ Created Vite + React + TypeScript project successfully (React 19.2.0, Vite 7.3.1, TypeScript 5.9.3)
2. ✅ Installed MUI v7.3.7 and Emotion styling engine
3. ✅ Configured Jest 30.2.0 with React Testing Library for Vite compatibility
4. ✅ Set up type-based project structure per Architecture document
5. ✅ Created separate `__tests__/` directory (not co-located with source)
6. ✅ Configured Vite bundle optimization with manual chunks (mui-vendor, react-vendor)
7. ✅ Verified bundle size: 181.96 KB (under 200KB target per NFR-PERF-03)
8. ✅ Created MUI theme with WCAG AA compliance (16px body text per NFR-A11Y-07)

**Validation Results:**
- ✅ Dev server starts on port 5173
- ✅ Production build succeeds (2.29s)
- ✅ Jest tests pass (1/1 passed)
- ✅ TypeScript compiles without errors
- ✅ All required directories created

**Additional Dependencies Added:**
- `jest-environment-jsdom` - Required for Jest 28+ compatibility

**Next Steps:**
- Story 1.2 (Implement Product Search UI) can now begin with the project foundation in place

**Code Review Fixes Applied (2026-02-03):**
- ✅ Committed all project files to git (commit b3467d7)
- ✅ Updated story documentation to reflect MUI v7 (was incorrectly documented as v6)
- ✅ Created .env.example template for environment variables

## Change Log

**2026-02-03 - Story Implementation Completed**
- Created Vite + React + TypeScript project foundation
- Installed all required dependencies (MUI v7, Jest 30, testing libraries)
- Set up type-based project structure per Architecture document
- Configured Jest with Vite compatibility
- Configured Vite bundle optimization for < 200KB target
- Created MUI theme with WCAG AA compliance (16px body text)
- All acceptance criteria verified and passing

### File List

**Configuration Files Created/Modified:**
- `package.json` - Dependencies and scripts (updated name to retail-recommendation-system, added test scripts)
- `tsconfig.json` - TypeScript configuration (from Vite template)
- `tsconfig.app.json` - TypeScript app configuration (from Vite template)
- `tsconfig.node.json` - TypeScript node configuration (from Vite template)
- `vite.config.ts` - Vite build configuration with bundle optimization (updated)
- `jest.config.cjs` - Jest configuration for Vite compatibility (created)

**Source Files Created:**
- `src/setupTests.ts` - Jest test setup file (created)
- `src/theme/index.ts` - MUI theme configuration with WCAG AA compliance (created)

**Test Files Created:**
- `__tests__/utils/example.test.ts` - Example test to verify Jest configuration (created)
- `__mocks__/fileMock.js` - Mock file for asset imports in tests (created)

**Directory Structure Created:**
- `src/components/` - React components (PascalCase.tsx)
- `src/hooks/` - Custom hooks (usePascalCase.ts)
- `src/services/` - API clients (camelCase.ts)
- `src/utils/` - Utilities (camelCase.ts)
- `src/types/` - TypeScript interfaces (PascalCase.types.ts)
- `src/context/` - React contexts (PascalCaseContext.tsx)
- `src/constants/` - Constants (camelCase.ts)
- `src/assets/` - Static assets
- `src/theme/` - MUI theme configuration
- `__tests__/components/` - Component tests
- `__tests__/hooks/` - Hook tests
- `__tests__/services/` - Service tests
- `__tests__/utils/` - Utility tests
- `__mocks__/` - Test mocks

**Template Files (from Vite):**
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Root component
- `src/App.css` - App styles (from Vite template)
- `src/index.css` - Global styles (from Vite template)
- `src/assets/` - Static assets (from Vite template)
- `index.html` - HTML template
- `public/vite.svg` - Vite logo
- `.gitignore` - Git ignore patterns (from Vite template)
- `eslint.config.js` - ESLint configuration (from Vite template)

**Environment Configuration:**
- `.env.example` - Environment variables template (created during code review)

**Git Commits:**
- Commit b3467d7: "feat: initialize Vite + React + TypeScript project with MUI v7 and Jest"

**Additional Notes:**
- Added `jest-environment-jsdom` dependency (required for Jest 28+)
- Updated `package.json` name from "vite-temp" to "retail-recommendation-system"
- Added test scripts: `test`, `test:watch`, `test:coverage`
- Bundle size after build: 181.96 KB (well under 200KB target)
