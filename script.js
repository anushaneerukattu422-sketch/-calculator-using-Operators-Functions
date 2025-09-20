/* Utility: safe number parsing */
function parseNum(value) {
  const n = Number(value.trim());
  return Number.isFinite(n) ? n : null;
}

/* Display helpers */
const els = {
  n1: document.getElementById("num1"),
  n2: document.getElementById("num2"),
  res: document.getElementById("result"),
  err: document.getElementById("error"),
  btns: document.querySelector(".buttons"),
  clear: document.getElementById("clear"),
};

function setResult(value) {
  els.res.value = String(value);
  els.err.textContent = "";
}

function setError(msg) {
  els.res.value = "";
  els.err.textContent = msg;
}

/* Core arithmetic implemented as pure functions */
const ops = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => {
    if (b === 0) throw new Error("Cannot divide by zero.");
    return a / b;
  },
  square: (a) => a ** 2,
  cube: (a) => a ** 3,
};

/* Handler for all operation buttons (event delegation) */
els.btns.addEventListener("click", (e) => {
  const op = e.target?.dataset?.op;
  if (!op) return;

  // Get inputs
  const a = parseNum(els.n1.value);
  const b = parseNum(els.n2.value);

  // Validation depending on op
  try {
    if (op === "square" || op === "cube") {
      if (a === null) return setError("Enter the first number to use x² / x³.");
      setResult(ops[op](a));
    } else {
      if (a === null || b === null) {
        return setError("Enter both numbers for +, −, ×, ÷.");
      }
      setResult(ops[op](a, b));
    }
  } catch (err) {
    setError(err.message || "An error occurred.");
  }
});

/* Clear button */
els.clear.addEventListener("click", () => {
  els.n1.value = "";
  els.n2.value = "";
  els.res.value = "";
  els.err.textContent = "";
  els.n1.focus();
});

/* Keyboard niceties: Enter triggers last focused op if any – default to + */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    // Default action: add if both numbers exist
    const a = parseNum(els.n1.value);
    const b = parseNum(els.n2.value);
    if (a !== null && b !== null) setResult(ops.add(a, b));
  }
});
