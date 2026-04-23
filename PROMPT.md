# The Eisenhower Matrix App — The Full Prompt

> This document contains the exact prompt that was used to generate the **Eisenhower Matrix** Web App. It can be reused, adapted, or shared as a reference for AI-assisted app generation.

---

## The Prompt

```
Build a premium, glassmorphism-styled Eisenhower Matrix productivity web application using only Vanilla HTML, CSS, and JavaScript (no frameworks or bundlers). 

The application must include the following features, architecture, and exact files (`index.html`, `styles.css`, `app.js`):

1. **Design System & Aesthetics (`styles.css`)**:
   - Use a modern dark mode theme. The body background should be a fixed linear gradient blending deep violet into a softer purplish hue (e.g., `#1b1b2f` to `#2a2a4a`).
   - Use "Glassmorphism" for all containers: translucent backgrounds (e.g., `rgba(255, 255, 255, 0.06)`), blurred backdrops (`backdrop-filter: blur(12px)`), subtle white borders, and soft shadows.
   - Use the 'Inter' font from Google Fonts and modern Boxicons for iconography.
   - Include smooth micro-animations for hover states, adding tasks, and button presses.

2. **Application Layout (`index.html`)**:
   - **Header**: A title area and a dynamic "active tasks pending" counter.
   - **Global Add Task Bar**: A horizontal bar at the top (stacking vertically on mobile) containing inputs for: Task Title (required), Due Date (date picker), Notes (text), a Quadrant Select Dropdown (Do First, Schedule, Delegate, Eliminate), and an "Add Task" button.
   - **Matrix Grid**: A 2x2 responsive CSS grid (collapsing to 1 column on mobile). Each quadrant must have a unique icon, title, subtitle, and an empty drop-zone list for tasks.
   - **Completed Section**: An expandable/collapsible accordion below the matrix grid to hold completed tasks.
   - **Edit Modal**: A hidden modal overlay for editing tasks.

3. **Task Functionality & Logic (`app.js`)**:
   - Persist all active tasks and completed tasks to the browser's `localStorage`.
   - **Task Cards**: Each task card must display its checkbox, title, due date (if provided), notes (if provided), an Edit button, and a Delete button.
   - **Drag and Drop**: Implement the HTML5 drag and drop API so users can drag a task card and drop it into another quadrant's list seamlessly.
   - **Edit Modal**: Clicking a task's Edit button should open the glassmorphism popup modal, allowing the user to update the title, date, and notes, and then save or cancel.
   - **Completion Handling**: Checking the checkbox on an active task moves it out of the matrix and prepends it into the "Completed Tasks" accordion.
   - **Completed Tasks UI**: Within the completed section, tasks should show a strikethrough effect and have a "Restore" button (moves it back to its original quadrant) and a "Permanently Delete" button.

Output the complete and fully functional code for `index.html`, `styles.css`, and `app.js`.
```
