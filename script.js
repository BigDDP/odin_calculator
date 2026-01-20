const container = document.querySelector("#container")

function generateCalculator() {
    let num = 1
    for (i=0; i<3; i++) {
        const row = document.createElement("div");
        row.id = `row${i}`;
        row.className = "row";
        container.appendChild(row);
        for (j=0; j<3; j++) {
            const cell = document.createElement("button");
            cell.id = `cell${num}`;
            cell.value = `${num}`;
            cell.className = "cell";
            cell.textContent = `${num}`;
            row.appendChild(cell);
            num++
        }
    }
    const cell0 = document.createElement("button");
    cell0.id = 'cell0';
    cell0.value = '0';
    cell0.className = "cell";
    cell0.textContent = '0'
    container.appendChild(cell0);
}

generateCalculator();

const DEBUG = true;
const log = (...args) => DEBUG && console.log("[calc]", ...args);

let acc = null;          // running result (number)
let pendingOp = null;    // "+", "-", "*", "/" or null
let currentNumber = "";  // string being typed
let justSubmitted = false;

const submitBtn = document.querySelector("#submit");
const clearBtn = document.querySelector("#clear");
const backspaceBtn = document.querySelector("#backspace");
const calcPlaceholder = document.querySelector("#calcPlaceholder");
const screen = document.querySelector(".calcScreen");
const btnValues = document.querySelectorAll(".cell");

const isDigit = (v) => /^[0-9]$/.test(v);
const isDot = (v) => v === ".";
const isOp = (v) => v === "+" || v === "-" || v === "*" || v === "/";

function round3(n) {
    return Math.round((n + Number.EPSILON) * 1000) / 1000;
}

function divide(a, b) {
    if (b === 0) {
        alert("Cannot divide by 0");
        throw new Error("cannot divide by 0");
    }
    return a / b;
}

const OPS = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": divide,
};

function render() {
    const left = acc === null ? "" : String(acc);
    const op = pendingOp ? ` ${pendingOp} ` : (left ? " " : "");
    const right = currentNumber;

    const text = (left + op + right).trim();
    calcPlaceholder.textContent = text || "Enter Digits...";

    if (screen) screen.scrollLeft = screen.scrollWidth;
}

function resetAll() {
    acc = null;
    pendingOp = null;
    currentNumber = "";
    justSubmitted = false;
    render();
}

function toNumberStrict(s) {
  if (typeof s === "string" && /^\d+(\.\d+)?$/.test(s)) return Number(s);
  throw new Error(`Not a number: ${s}`);
}

function appendDigit(d) {
  currentNumber += d;
  log("appendDigit", d, { acc, pendingOp, currentNumber });
  render();
}

function appendDot() {
  if (currentNumber.includes(".")) return; // only one dot
  if (currentNumber === "") currentNumber = "0";
  currentNumber += ".";
  log("appendDot", { acc, pendingOp, currentNumber });
  render();
}

function commitNumberIfNeeded() {
  if (currentNumber === "") return null;
  const n = toNumberStrict(currentNumber);
  currentNumber = "";
  return n;
}

function pressOperator(op) {
  if (currentNumber === "" && (acc === null || pendingOp !== null)) {
    log("ignore consecutive/leading operator", op, { acc, pendingOp, currentNumber });
    return;
  }

  // first operator after typing a number: set acc
  if (acc === null) {
    const first = commitNumberIfNeeded();
    if (first === null) return; // nothing typed
    acc = first;
    pendingOp = op;
    log("set acc & pendingOp", { acc, pendingOp });
    render();
    return;
  }

  // acc exists here
  const rhs = commitNumberIfNeeded();
  if (rhs === null) {
    // if they somehow have acc and no rhs, ignore (also matches "do not do anything")
    log("no rhs; ignore operator", op, { acc, pendingOp });
    return;
  }

  // solve previous acc op rhs (if pendingOp exists), then set new pending op
  try {
    if (pendingOp) {
      acc = round3(OPS[pendingOp](acc, rhs));
      log("partial solve", { solvedOp: pendingOp, rhs, acc });
    } else {
      // if no pendingOp, treat rhs as replacing? usually not reachable with this flow
      acc = rhs;
    }
    pendingOp = op;
    log("new pendingOp", { pendingOp, acc });
    render();
  } catch (err) {
    console.error(err);
    // keep state so user can backspace/fix
    currentNumber = String(rhs); // put it back for editing
    render();
  }
}

function submit() {
  // requirement: error if pressing enter on operator / incomplete
  if (pendingOp && currentNumber === "") {
    console.error("Invalid equation: ends with operator");
    alert("Invalid equation (ends with an operator).");
    return;
  }

  // If only a number typed with no acc yet
  if (acc === null) {
    if (currentNumber === "") return; // nothing
    try {
      acc = round3(toNumberStrict(currentNumber));
      currentNumber = "";
      pendingOp = null;
      justSubmitted = true;
      render();
    } catch (e) {
      console.error(e);
    }
    return;
  }

  // If we have acc and a pending op and a rhs
  const rhs = commitNumberIfNeeded();
  if (pendingOp && rhs !== null) {
    try {
      acc = round3(OPS[pendingOp](acc, rhs));
      pendingOp = null;
      justSubmitted = true;
      log("submit solve", { acc });
      render();
    } catch (err) {
      console.error(err);
      currentNumber = String(rhs); // restore for editing
      render();
    }
  } else {
    justSubmitted = true; 
    render();
  }
}

function backspace() {
  if (currentNumber !== "") {
    currentNumber = currentNumber.slice(0, -1);
    log("backspace currentNumber", { currentNumber });
    render();
    return;
  }

  // If no currentNumber, backspace affects operator/acc in a simple way:
  // - If pendingOp exists, remove it (so user can choose another op later)
  // - Else if acc exists, move acc into currentNumber for editing and clear acc
  if (pendingOp) {
    log("backspace pendingOp", { pendingOp });
    pendingOp = null;
    render();
    return;
  }

  if (acc !== null) {
    currentNumber = String(acc);
    acc = null;
    log("backspace moved acc -> currentNumber", { currentNumber });
    render();
  }
}

// --- wire buttons ---
btnValues.forEach((btn) => {
  btn.addEventListener("click", () => handleInput(btn.value));
});

submitBtn?.addEventListener("click", submit);
clearBtn?.addEventListener("click", resetAll);
backspaceBtn?.addEventListener("click", backspace);

// --- keyboard ---
document.addEventListener("keydown", (e) => {
  const k = e.key;

  const isCalcKey =
    isDigit(k) || isOp(k) || k === "." || k === "Enter" || k === "Backspace" || k === "Escape";

  if (isCalcKey) e.preventDefault();

  if (justSubmitted && (isDigit(k) || isOp(k) || k === ".")) {
    resetAll();
  }

  if (isDigit(k)) return appendDigit(k);
  if (k === ".") return appendDot();
  if (isOp(k)) return pressOperator(k);
  if (k === "Backspace") return backspace();
  if (k === "Escape") return resetAll();

  if (k === "Enter") {
    if (pendingOp && currentNumber === "") {
      console.error("Invalid equation: ends with operator");
      alert("Invalid equation (ends with an operator).");
      return;
    }
    submit();
  }
});

function handleInput(v) {
  log("input", v);

  if (justSubmitted) {
    resetAll();          // wipe everything on the very next click
    // NOTE: resetAll() sets justSubmitted=false
  }

  if (isDigit(v)) return appendDigit(v);
  if (isDot(v)) return appendDot();
  if (isOp(v)) return pressOperator(v);
  if (v === "=") return submit();

  log("ignored input", v);
}

// initial paint
render();