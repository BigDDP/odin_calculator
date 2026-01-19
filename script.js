const calculation = {}

const submit = document.querySelectorAll(".submit");
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