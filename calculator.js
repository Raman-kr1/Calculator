const display = document.getElementById("display");
const buttons = document.querySelectorAll("#keypad .btn");
const clockDisplay = document.getElementById("clock-display");
const timeZoneSelect = document.getElementById("time-zone-select");
const draggablePanels = document.querySelectorAll(".draggable");

const calculatorState = {
  current: "0",
  previous: null,
  operator: null,
};

const isOperator = (val) => ["+", "-", "*", "/", "%"].includes(val);

function updateDisplay(nextValue = calculatorState.current) {
  display.textContent = nextValue;
}

function inputDigit(value) {
  if (!Number.isFinite(Number(calculatorState.current))) {
    calculatorState.current = "0";
  }
  if (value === "." && calculatorState.current.includes(".")) return;
  if (calculatorState.current === "0" && value !== ".") {
    calculatorState.current = value;
  } else {
    calculatorState.current += value;
  }
  updateDisplay();
}

function setOperator(op) {
  if (!Number.isFinite(Number(calculatorState.current))) {
    calculatorState.current = "0";
  }
  if (calculatorState.operator && calculatorState.previous !== null) {
    evaluate();
  }
  calculatorState.previous = calculatorState.current;
  calculatorState.current = "0";
  calculatorState.operator = op;
}

function toggleSign() {
  if (calculatorState.current === "0") return;
  calculatorState.current = calculatorState.current.startsWith("-")
    ? calculatorState.current.slice(1)
    : `-${calculatorState.current}`;
  updateDisplay();
}

function deleteDigit() {
  if (calculatorState.current.length <= 1 || calculatorState.current === "-0") {
    calculatorState.current = "0";
  } else {
    calculatorState.current = calculatorState.current.slice(0, -1);
    if (calculatorState.current === "-" || calculatorState.current === "") {
      calculatorState.current = "0";
    }
  }
  updateDisplay();
}

function resetCalculator() {
  calculatorState.current = "0";
  calculatorState.previous = null;
  calculatorState.operator = null;
  updateDisplay();
}

function performCalculation(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? Infinity : a / b;
    case "%":
      return (a / 100) * b;
    default:
      return b;
  }
}

function evaluate() {
  if (calculatorState.operator === null || calculatorState.previous === null) {
    return;
  }

  const first = parseFloat(calculatorState.previous);
  const second = parseFloat(calculatorState.current);
  const result = performCalculation(first, second, calculatorState.operator);

  if (!Number.isFinite(result)) {
    calculatorState.current = "∞";
  } else {
    const trimmed = parseFloat(result.toFixed(10));
    calculatorState.current = `${trimmed}`;
  }

  calculatorState.previous = null;
  calculatorState.operator = null;
  updateDisplay();
}

function handleInput(value) {
  if (!Number.isNaN(Number(value)) || value === ".") {
    inputDigit(value);
    return;
  }

  if (isOperator(value)) {
    setOperator(value);
    return;
  }

  switch (value) {
    case "+/-":
      toggleSign();
      break;
    case "DEL":
      deleteDigit();
      break;
    case "AC":
      resetCalculator();
      break;
    case "=":
      evaluate();
      break;
    default:
      break;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    handleInput(value);
  });
});

// ----- Live clock with time zones -----
const fallbackZones = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function populateTimeZones() {
  let zones = fallbackZones;
  if (typeof Intl.supportedValuesOf === "function") {
    zones = Intl.supportedValuesOf("timeZone");
  }

  const currentZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  zones.forEach((zone) => {
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = zone.replace(/_/g, " ");
    timeZoneSelect.appendChild(option);
  });

  timeZoneSelect.value = zones.includes(currentZone) ? currentZone : zones[0];
}

function updateClock() {
  const zone = timeZoneSelect.value;
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: zone,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    timeZone: zone,
  }).format(now);

  clockDisplay.textContent = `${time} — ${date}`;
}

timeZoneSelect?.addEventListener("change", updateClock);
populateTimeZones();
updateClock();
setInterval(updateClock, 1000);

// ----- Drag & drop handles for panels -----
function enableDrag(panel) {
  const handle = panel.querySelector(".card-handle");
  if (!handle) return;

  const supportsPointerCapture = typeof handle.setPointerCapture === "function";

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let dragging = false;

  const onPointerMove = (event) => {
    if (!dragging) return;
    currentX = event.clientX - startX;
    currentY = event.clientY - startY;
    panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
    panel.classList.add("dragging");
  };

  const onPointerUp = (event) => {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove("dragging");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    if (supportsPointerCapture) {
      handle.releasePointerCapture(event.pointerId);
    }
  };

  handle.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX - currentX;
    startY = event.clientY - currentY;
    if (supportsPointerCapture) {
      handle.setPointerCapture(event.pointerId);
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  });
}

draggablePanels.forEach((panel) => enableDrag(panel));
updateDisplay();
