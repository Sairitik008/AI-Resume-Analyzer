# Design System

## 1. Design Philosophy
The UI must deliver an enterprise-grade, modern, and visually appealing experience to users. 
- **Avoid generic AI-template looks**: No aggressive neons or "cyber" tropes. Earthy, professional, and warmly reassuring tones.
- **Mobile-First Responsive**: All components adapt intuitively down to 320px screens.
- **Consistent Feedback States**: Every asynchronous fetch operation clearly telegraphs loading, empty, and exception-fallback behaviors natively.

## 2. Color Palette
Variables defined globally in `_variables.scss` leveraging a unified aesthetic.
- **Light Theme**:
  - `--bg-primary` (`#F8FAF9`): Warm, soft-white application background.
  - `--bg-surface` (`#FFFFFF`): Pure white component/card panels.
  - `--text-primary` (`#1A2E2A`): High legibility slate-dark font.
  - `--color-primary` (`#2F4F4F`): Dark slate gray primary branding.
  - `--text-inverse` (`#FFFFFF`): Always-light text resolving against saturated buttons.
- **Dark Theme Variant**:
  - `--bg-primary` (`#121817`): Deep slate background enforcing low-eye strain.
  - `--bg-surface` (`#1E2624`): Elevated panel overlays.
  - `--text-primary` (`#E6EDE9`): Soft pastel reading copy.
  - `--color-primary` (`#5F9EA0`): Vibrant Cadet Blue for active calls to action.
  - `--text-inverse` (`#121817`): Always-dark text resolving cleanly against bright buttons.
- **System Constraints**:
  - `--color-success` (`#2E8B57`): Sea Green. Used for positive match indicators and low-severity informational feedback.
  - `--color-warning` (`#DAA520`): Goldenrod. Used for medium-severity, cautionary structural or quantitative alerts.
  - `--color-error` (`#B22222`): Firebrick. Used for critical priority, immediate-action required structural failures.

## 3. Typography Scale
- **Primary Interface**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Monospace/Data Points**: `'Fira Code', monospace`
- **Weights Used**: 
  - `400` (Regular Paragraph)
  - `500` (Medium Actionable Text)
  - `600` (Semi-Bold Identifiers)
  - `700` (Bold Headings)

## 4. Breakpoints
- **Mobile** (`$breakpoint-mobile`): `768px` (Stacks grids vertically, collapses Sidebars).
- **Tablet** (`$breakpoint-tablet`): `1024px` (Compresses margins, condenses lists).
- **Desktop** (`$breakpoint-desktop`): `1280px` (Max layout bounds).

## 5. Component Inventory
- **`Button`**: Standardized trigger block encapsulating internal loading spinners and multiple sizing variants (primary, secondary, danger).
- **`Card`**: Standard surface wrapper binding shadow structures cleanly.
- **`Modal`**: Interactive dialog overlay shifting the Z-index mapping.
- **`ConfirmDialog`**: A pre-arranged `Modal` variant enforcing user acceptance on destructive inputs.
- **`TextInput`**: Generic `<input />` wrapper binding semantic valid/invalid highlight borders.
- **`Textarea`**: Scaled version for block string generation.
- **`SelectDropdown`**: Customized, visually consistent variant over standard `<select>`.
- **`ProgressBar`**: Animated block visualizing internal progress sequences natively.
- **`EmptyState`**: Filler graphic displaying when array lengths evaluate to 0 intuitively.
- **`Toast`**: A transient notification pop-up confirming async results utilizing dynamic `--text-inverse` colors.
- **`ScoreGauge`**: Circular SVG tracker mapping match percentages elegantly.
- **`SkillTag`**: Bubble pill representations of parsed regex array skills.
- **`MultiStepLoader`**: Orchestrated sequential messages resolving during heavy backend embeddings.
- **`ChecklistItem`**: A reusable, highly legible list subcomponent equipped with explicit success, warning, and failure indicators (using lucide-react) for structural ATS metrics.

## 6. Layout Composition Patterns
- **High-Priority Prominence**: Critical top-level sections (e.g., the "Your Top Priorities" segment) are sequenced immediately below Hero blocks, employing visual severity badging (using the `--color-error`, `--color-warning` palettes) to focus user attention on immediate action.
- **Supplementary Details**: Complementary systems like "Suggested Next Steps" for certifications deploy more subdued container boxing and muted secondary typography, ensuring they remain beneficial without visually overpowering the immediate diagnostic feedback.
