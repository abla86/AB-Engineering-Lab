# 🚀 Advanced JavaScript Counter

A feature-rich, dependency-free JavaScript counter application demonstrating modern frontend development with **reusable components, persistent state, keyboard interaction, responsive design, accessibility, animations, statistics, and JSON data management**.

The project expands the classic beginner counter into a complete interactive frontend application while remaining entirely built with **HTML5, CSS3, and vanilla JavaScript**.

## 🌐 Live Demo

**[Launch Advanced JavaScript Counter](https://abla86.github.io/advanced-javascript-counter/)**

The application is deployed with **GitHub Pages** and runs directly in a modern web browser.

No installation, package manager, framework, build process, or external dependency is required.

---

## ✨ Features

### Multiple Independent Counters

The application contains three independent counters:

* Primary Counter
* Secondary Counter
* Third Counter

Each counter maintains its own state and persistent browser storage.

Every counter supports:

* Increase
* Decrease
* Reset
* Positive values
* Negative values
* Independent persistence
* Keyboard interaction
* Dynamic styling
* Animated value changes

---

## 🧱 Reusable Counter Architecture

Instead of duplicating JavaScript for every counter, the application uses a reusable `Counter` class.

```javascript
class Counter {
  constructor({
    id,
    title,
    description,
    start = 0
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.value = start;
  }

  increase() {
    this.value += 1;
    this.updateDisplay();
  }

  decrease() {
    this.value -= 1;
    this.updateDisplay();
  }

  reset() {
    this.value = 0;
    this.updateDisplay();
  }
}
```

Counter instances are generated from configuration data:

```javascript
const COUNTER_CONFIG = [
  {
    id: "primary",
    title: "Primary Counter",
    description: "Main persistent counter.",
    start: 0
  },
  {
    id: "secondary",
    title: "Secondary Counter",
    description: "Independent persistent state.",
    start: 0
  },
  {
    id: "third",
    title: "Third Counter",
    description: "Reusable component demonstration.",
    start: 0
  }
];
```

This demonstrates:

* Object-oriented JavaScript
* Reusable application logic
* Component-like architecture
* Configuration-driven UI generation
* Independent application state
* Dynamic DOM creation

---

## 💾 Persistent State with LocalStorage

Every counter receives an independent LocalStorage key:

```javascript
this.storageKey =
  `advanced-counter:${id}`;
```

Values are stored automatically:

```javascript
localStorage.setItem(
  this.storageKey,
  String(this.value)
);
```

When the application is reopened or refreshed, previously stored counter values are restored.

This demonstrates practical use of the browser **Web Storage API** without requiring a database or backend.

---

## ⌨️ Keyboard Controls

The application can be controlled using either the mouse or keyboard.

Click a counter or move keyboard focus into it to make that counter active.

| Key          | Action                  |
| ------------ | ----------------------- |
| `+`          | Increase active counter |
| `Arrow Up`   | Increase active counter |
| `-`          | Decrease active counter |
| `Arrow Down` | Decrease active counter |
| `R`          | Reset active counter    |
| `Escape`     | Reset active counter    |

Keyboard interaction is handled using event listeners:

```javascript
document.addEventListener(
  "keydown",
  (event) => {
    const counter =
      getActiveCounter();

    if (!counter) {
      return;
    }

    if (
      event.key === "+" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      counter.increase();
    }

    if (
      event.key === "-" ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      counter.decrease();
    }
  }
);
```

This demonstrates:

* Keyboard events
* Active component state
* Accessible interaction
* Event-driven application behaviour

---

## 🎨 Dynamic Styling

Counter values automatically change colour according to their current state:

* **Green** — positive
* **Red** — negative
* **Neutral** — zero

```javascript
if (this.value > 0) {
  this.display.style.color =
    "var(--positive)";
} else if (this.value < 0) {
  this.display.style.color =
    "var(--negative)";
} else {
  this.display.style.color =
    "var(--neutral)";
}
```

The currently active counter also receives a visible highlight.

---

## ✨ Animations

Counter values animate whenever they change.

```css
.count {
  transition:
    transform 0.2s ease,
    color 0.3s ease;
}

.count.bump {
  transform: scale(1.18);
}
```

JavaScript triggers the animation dynamically:

```javascript
animate() {
  this.display.classList.remove(
    "bump"
  );

  void this.display.offsetWidth;

  this.display.classList.add(
    "bump"
  );
}
```

This demonstrates interaction between JavaScript application state and CSS transitions.

---

## 📊 Counter Dashboard

The application includes a live dashboard that automatically calculates information across all counters.

The dashboard displays:

* **Total value**
* **Highest counter value**
* **Lowest counter value**
* **Changes during the current session**

Statistics update automatically whenever counter state changes.

```javascript
const total =
  values.reduce(
    (sum, value) =>
      sum + value,
    0
  );

totalValueElement.textContent =
  total;

highestValueElement.textContent =
  Math.max(...values);

lowestValueElement.textContent =
  Math.min(...values);
```

This demonstrates:

* Array transformations
* `reduce()`
* Spread syntax
* Derived application state
* Real-time DOM updates

---

## 🔄 Reset All

In addition to resetting counters individually, the dashboard provides a global **Reset All** control.

This resets every counter to zero and updates:

* Counter displays
* LocalStorage
* Dashboard statistics
* Status feedback

---

## 📤 JSON Export

Current counter data can be exported as a JSON file directly from the browser.

The exported data contains:

* Application name
* Data format version
* Export timestamp
* Counter IDs
* Counter names
* Current values

Example structure:

```json
{
  "application": "Advanced JavaScript Counter",
  "version": 1,
  "exportedAt": "2026-08-08T12:00:00.000Z",
  "counters": [
    {
      "id": "primary",
      "title": "Primary Counter",
      "value": 5
    }
  ]
}
```

The export is generated entirely client-side using:

* `JSON.stringify()`
* `Blob`
* `URL.createObjectURL()`
* Dynamic download links

No server is required.

---

## 📥 JSON Import

Previously exported counter data can be imported back into the application.

The application:

1. Reads the selected file
2. Parses the JSON
3. Checks for a valid counter collection
4. Matches counter IDs
5. Validates numeric values
6. Restores matching counters
7. Updates LocalStorage
8. Refreshes dashboard statistics

Invalid JSON is handled without crashing the application.

```javascript
try {
  const text =
    await file.text();

  const data =
    JSON.parse(text);

  if (
    !Array.isArray(
      data.counters
    )
  ) {
    throw new Error(
      "Invalid counter file."
    );
  }
} catch (error) {
  console.error(error);
}
```

This demonstrates:

* File API
* Asynchronous JavaScript
* `async` / `await`
* JSON parsing
* Input validation
* Error handling

---

## 🌗 Automatic Light and Dark Mode

The interface automatically follows the operating system or browser colour preference.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111827;
    --surface: #1f2937;
    --text: #f9fafb;
  }
}
```

CSS custom properties allow the complete interface to adapt without duplicating the application styling.

---

## 📱 Responsive Design

The application uses:

* CSS Grid
* Flexible layouts
* `auto-fit`
* `minmax()`
* `clamp()`
* Responsive spacing
* Mobile breakpoints

The counter grid automatically adapts to the available screen width.

```css
.counter-grid {
  display: grid;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(260px, 1fr)
    );
}
```

This allows the application to work across desktop, tablet, and smaller screens.

---

## ♿ Accessibility

Accessibility considerations are integrated directly into the application.

Implemented features include:

* Semantic HTML5 structure
* Native HTML buttons
* Descriptive `aria-label` values
* `aria-live="polite"`
* `aria-atomic="true"`
* Keyboard controls
* Keyboard focus support
* Visible focus indicators
* Status announcements
* Responsive text sizing
* Reduced-motion support

Counter values use live regions:

```html
<div
  class="count"
  aria-live="polite"
  aria-atomic="true"
>
  0
</div>
```

Status messages are also announced:

```html
<p
  id="status"
  role="status"
  aria-live="polite"
></p>
```

Users who request reduced motion through their operating system are respected:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration:
      0.01ms !important;

    animation-duration:
      0.01ms !important;
  }
}
```

These features demonstrate practical accessibility principles without claiming formal WCAG certification or conformance.

---

## 🛡️ Input Validation and Error Handling

Imported data is validated before being applied.

The application verifies:

* JSON can be parsed
* `counters` is an array
* Counter IDs exist
* Imported values are finite numbers

Invalid files produce user feedback rather than terminating the application.

---

## 🖱️ Modern Event Handling

The application does not use inline `onclick` handlers.

Interactions are registered using `addEventListener()`.

Counter controls use event delegation:

```javascript
this.element.addEventListener(
  "click",
  (event) => {
    const action =
      event.target.dataset.action;

    if (!action) {
      return;
    }

    if (action === "increase") {
      this.increase();
    }
  }
);
```

This keeps behaviour in JavaScript rather than mixing it into HTML markup.

---

## 🧠 JavaScript Concepts Demonstrated

The project demonstrates practical use of:

* Variables and constants
* Functions
* Classes
* Constructors
* Methods
* Objects
* Arrays
* Maps
* Template literals
* Destructuring
* Spread syntax
* Arrow functions
* Array `.map()`
* Array `.forEach()`
* Array `.reduce()`
* DOM manipulation
* Dynamic DOM creation
* Event listeners
* Event delegation
* Keyboard events
* Application state
* Derived state
* LocalStorage
* JSON serialization
* File handling
* Blob creation
* Object URLs
* Async/await
* Error handling
* Input validation
* CSS custom properties
* Responsive design
* Accessibility APIs

---

## 🛠️ Technologies

| Technology      | Usage                                             |
| --------------- | ------------------------------------------------- |
| HTML5           | Semantic application structure                    |
| CSS3            | Layout, styling, animations and responsive design |
| JavaScript ES6+ | Application logic and state management            |
| DOM API         | Dynamic rendering and interaction                 |
| Web Storage API | Persistent counter values                         |
| File API        | JSON file import                                  |
| Blob API        | JSON file export                                  |
| ARIA            | Accessible status and value announcements         |
| Git             | Version control                                   |
| GitHub          | Source repository                                 |
| GitHub Pages    | Live deployment                                   |

The application uses **no external runtime dependencies**.

---

## 📂 Project Structure

The project intentionally uses only two source/documentation files:

```text
advanced-javascript-counter/
│
├── index.html
└── README.md
```

`index.html` contains:

* HTML structure
* CSS
* JavaScript
* Counter architecture
* Persistence
* Dashboard
* Data import/export
* Accessibility functionality

Keeping the project in a single application file makes it easy to inspect, run and deploy while the internal JavaScript remains structured and reusable.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/abla86/advanced-javascript-counter.git
```

Move into the project:

```bash
cd advanced-javascript-counter
```

Open:

```text
index.html
```

in a modern browser.

No installation is required.

---

## 🌐 Deployment

The project is deployed using **GitHub Pages**.

**Live application:**

https://abla86.github.io/advanced-javascript-counter/

The `main` branch is used as the deployment source.

---

## 🎓 From Basic Counter to Advanced Application

The project started from the classic JavaScript counter concept:

```javascript
let count = 0;

function increase() {
  count++;
}

function decrease() {
  count--;
}
```

The final application extends that concept through:

**basic state → DOM manipulation → event handling → persistent state → reusable classes → multiple components → keyboard interaction → dynamic styling → animations → accessibility → derived statistics → file import/export → responsive UI**

This demonstrates how a very small JavaScript exercise can be progressively developed into a substantially more capable frontend application.

---

## 📜 License

