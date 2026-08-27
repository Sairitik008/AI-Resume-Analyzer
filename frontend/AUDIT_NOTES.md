# Frontend Audit Notes

## Findings & Fixes
- **Stray API Calls**: Discovered `UploadResumePage.tsx` using inline `api.post` and raw `<button>` HTML elements. Refactored it to use the centralized `resumeService.ts` method `uploadResume()` and standard `Button.tsx` component. Added a rigid 5MB file size limit check `if (file.size > MAX_FILE_SIZE)` on the client side before execution.
- **Theme Color Consistency**: Identified numerous files (`RegisterPage.module.scss`, `LoginPage.module.scss`, `ProfilePage.module.scss`, `DashboardPage.module.scss`, `Button.module.scss`) using hardcoded hex color `#fff` for text over colored backgrounds. Created a CSS variable `--text-inverse` defaulting to `#FFFFFF` in Light Theme and `#121817` in Dark Theme. Applied this variable globally to ensure WCAG compliant contrast without arbitrary hex breaking dynamic themes.
- **Toast Styling Refactor**: The Toast notification system `Toast.module.scss` was using hardcoded un-themeable HEX values (`#1e3d2e`, `#3d1e1e`). Rewrote classes to use dynamic `rgba(R, G, B, 0.15)` alpha layers along with `var(--color-success)` and `var(--color-error)` variables.
- **Response Types Synchronization**: Verified `analysisService.ts` and `jobDescriptionService.ts`. All endpoints correctly anticipate the `ApiSuccessResponse` root envelope (`data`, `message`, `status_code`) mapped accurately to the Python backend refactor.
- **State Handling Validation**: Verified main application pages contain proper Loader handling, fallback strings, and error boundaries integrated securely without logging critical session keys.

## Outcome
The React frontend layer strictly enforces generic styling variables, aligns synchronously with the central component ecosystem, prevents arbitrary API usage, and mitigates arbitrary big data uploads efficiently at the client border.
