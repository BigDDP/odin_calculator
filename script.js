const container = document.querySelector("#container")

function generateCalculator() {
    for (i=1; i<4; i++) {
        const row = document.createElement("div");
        row.id = `row${i}`;
        row.className = "row";
        container.appendChild(row);
        for (j=1; j<4; j++) {
            const cell = document.createElement("button");
            cell.id = `cell${i*j}`;
            cell.value = `${i*j}`;
            cell.className = "cell";
            cell.textContent = `${i*j}`;
            row.appendChild(cell);
        }
    }
    const cell0 = document.createElement("button");
    cell0.id = 'cell0';
    cell0.value = '0';
    cell0.className = "cell";
    cell0.textContent = '0'
    container.appendChild(cell0);

    const value = document.querySelectorAll(".cell")
}

generateCalculator();

const calculation = {}

const submit = document.querySelector("#submit");
submit.addEventListener("click", operate(calculation.int1, calculation.int2, calculation.op));

function operate( int1, int2, operator ) {
    if (operator === "+") {
        add(int1, int2);
    } else if (operator === "-") {
        subtract(int1, int2);
    } else if (operator === "*") {
        multiply(int1, int2);
    } else if (operator === "/") {
        divide(int1, int2);
    }
}

function add(int1, int2) {

}

function subtract(int1, int2) {

}

function multiply(int1, int2) {

}

function divide(int1, int2) {

}