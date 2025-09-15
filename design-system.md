# TutorPad Design System

This document outlines the design system for the TutorPad application. The goal is to ensure a consistent, accessible, and high-quality user experience across all modules.

## 1. Color Palette

Colors are managed via CSS variables to support both light and dark themes.

### Primary Brand Color

The primary brand color is used for active states, links, and key call-to-action buttons.

| Variable              | Light Mode | Dark Mode | Usage                                         |
| --------------------- | ---------- | --------- | --------------------------------------------- |
| `--color-brand`       | `blueviolet` | `#c471f5` | Main accent, active sidebar item, main buttons. |
| `--color-brand-hover` | `#9a4dff`   | `#d98dff` | Hover states for brand-colored elements.      |

### Background Colors

Background colors define the visual hierarchy of the layout.

| Variable                | Light Mode | Dark Mode | Usage                                       |
| ----------------------- | ---------- | --------- | ------------------------------------------- |
| `--color-bg-primary`    | `#f4f7fa`  | `#111827` | Main application background (content area). |
| `--color-bg-secondary`  | `#f9fafb`  | `#1f2937` | Secondary background, like item hovers.     |
| `--color-bg-tertiary`   | `#fff`      | `#262c3a` | Card backgrounds, sidebar, modals.          |

### Text Colors

Text colors are chosen for optimal readability against the background colors.

| Variable                 | Light Mode | Dark Mode | Usage                               |
| ------------------------ | ---------- | --------- | ----------------------------------- |
| `--color-text-primary`   | `#111827`  | `#e5e7eb` | Headings and primary body text.     |
| `--color-text-secondary` | `#6b7280`  | `#d1d5db` | Subheadings, descriptions, meta text. |

### Borders and Shadows

Borders and shadows are used to create separation and depth.

| Variable               | Light Mode          | Dark Mode         | Usage                                       |
| ---------------------- | ------------------- | ----------------- | ------------------------------------------- |
| `--color-border`       | `#e5e7eb`           | `#374151`         | Component borders, dividers.                |
| `--color-shadow`       | `rgba(0,0,0,0.05)`  | `rgba(0,0,0,0.2)` | Default shadow for cards and popovers.      |
| `--color-shadow-hover` | `rgba(0,0,0,0.1)`   | `rgba(0,0,0,0.3)` | Elevated shadow for hovered interactive elements. |

## 2. Typography

The typography is designed to be clear, legible, and hierarchical.

-   **Primary Font Family**: `Inter`
-   **Fallback Font**: `sans-serif`

### Font Weights

-   **Regular**: 400
-   **Medium**: 500 (Used for buttons and active states)
-   **Semi-bold**: 600 (Used for subheadings)
-   **Bold**: 700 (Used for main headings)

### Typographic Scale

| Element        | Font Size | Font Weight | Usage Example                      |
| -------------- | --------- | ----------- | ---------------------------------- |
| Heading 1 (h1) | `2rem`    | 700 (Bold)  | `Tutorpanel` (in Tutorpanel)       |
| Heading 2 (h2) | `1.5rem`  | 600 (Semi-bold) | `TutorPad` (in Sidebar), Modals    |
| Heading 3 (h3) | `1.3rem`  | 600 (Semi-bold) | Section titles, Lesson content   |
| Heading 4 (h4) | `1.2rem`  | 600 (Semi-bold) | Card titles                      |
| Body (p)       | `1rem`    | 400 (Regular) | Standard paragraph text          |
| Small Text     | `0.9rem`  | 400 (Regular) | Meta-information, breadcrumbs    |

## 3. Spacing & Layout

A consistent spacing scale based on a `4px` grid is used to maintain rhythm and alignment.

-   **Base Unit**: `4px`
-   **Small Gap**: `8px` (2 units) - Gaps within components (e.g., icon and text).
-   **Medium Gap**: `16px` (4 units) - Gaps between components.
-   **Large Gap**: `24px` (6 units) - Gaps between layout sections.
-   **Padding**: `16px` or `24px` for main containers and cards.

## 4. Components

Standardized components ensure a predictable user experience.

### Buttons

-   **Primary Button**: Solid background (`--color-brand`), white text. Used for main actions.
-   **Secondary Button**: Transparent background, border (`--color-border`), primary text color. Used for secondary actions.
-   **Border Radius**: `8px` for standard buttons, `999px` (pill-shaped) for prompt bar buttons.
-   **Transitions**: Smooth `background-color` and `transform` transitions on hover.

### Cards

-   **Background**: `--color-bg-tertiary`
-   **Border**: `1px solid --color-border`
-   **Border Radius**: `12px`
-   **Shadow**: `--color-shadow` on default, transitioning to `--color-shadow-hover` on hover.
-   **Hover Effect**: `transform: translateY(-4px)` for a subtle lift.

### Input Fields

-   **Background**: `--color-bg-tertiary`
-   **Border**: `1px solid --color-border`
-   **Border Radius**: `8px`
-   **Padding**: `10px 16px`
-   **Focus State**: Outline color set to `--color-brand`.

## 5. Iconography

-   **Style**: Clean, consistent line icons.
-   **Size**: Typically `20px` or `24px`.
-   **Stroke Width**: `2`
-   **Usage**: Icons should always be accompanied by a text label or a tooltip for accessibility.

## 6. Branding

-   **Logo**: The "TP" circular gradient logo is the primary brand mark.
-   **Wordmark**: "TutorPad" is set in Inter, weight 600.