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

const btnValues = document.querySelectorAll(".cell")

const screen = document.querySelector(".calcScreen");

const calcPlaceholder = document.querySelector("#calcPlaceholder")

const calculation = []
let currentNumber = ""

btnValues.forEach(btnValue => { 
    (btnValue.addEventListener("click", () => {
        console.log(btnValue.value)

        const isInt = /^\d$/.test(btnValue.value)
        console.log(isInt)

        if (isInt) {
            currentNumber = `${currentNumber}` + `${btnValue.value}`;

            console.log(calculation.join(currentNumber))
        } else {
            calculation.push(currentNumber)
            calculation.push(btnValue.value)
            currentNumber = ""
        }

        calcPlaceholder.textContent = calculation.join(' ') + " " + currentNumber
        screen.scrollLeft = screen.scrollWidth;

        console.log(calculation)
}))});

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