//  Expense Logger progress bar
let expensesButton = document.getElementById('addExpBtn');
let progressBar = document.getElementById('limitBar');
let dailyLimit = document.getElementById('dailyLimitInput');
let limitValue = dailyLimit.value;
let label = document.getElementById('limitPct');
let expenses = getExpenses();
function getExpenses() {
  return JSON.parse(localStorage.getItem(expenses));
}
function updateProgress(){
    limitValue = label.textContent;  // sets what you inputted as the label
    let sum  = 0.0;
    for (let i = 0; i < expenses.length; i++) { // calculates the sum of expenses
        sum = sum + expenses[i].amount;
    }
    let percent = Math.round(sum/limitValue); // gets the percentage from sum and inputted value
    if (percent > 100){ // returns 100 if above 100
        percent = 100;
    }
    progressBar.value = percent; // percent is now linked to the progress bar
    if (percent >= 75){ // changes color if at 75
        progressBar.style.backgroundColor  = 'orange';
    }
    if (percent = 100){// changes color if at 100
        progressBar.style.backgroundColor  = 'red'; // for some reason while debugging i couldn't change the bar color
    }
}
expensesButton.addEventListener('click', function() { // updates progress every time "Add Expenses" button is pressed
    updateProgress();
});
// Future Value Display

let valueAmount = document.getElementById('fvAmount');
let valueRate = document.getElementById('fvRate');
let valueYears = document.getElementById('fvYears');
let valueYearsLabel = document.getElementById('fvYearsLbl');
let valueYearsLabel2 = document.getElementById('fvResYears');
let calculateButton = document.getElementById('calcFvBtn');
let answer = document.getElementById('fvResNum');
let amount = valueAmount.value;
let rate = valueRate.value;
let years = valueYears.value;
function calculate() { // calculates the future value
valueYearsLabel2 = years; // sets the year to "in X years..."
answer.textContent = "$" + ((amount*Math.pow(1+(rate/100))), years); // calculates using FV = P * (1 + r/100) ^ t and overwrites "$--"
}

calculateButton.addEventListener('click', function() { // calculate when calculate button is pressed
    calculate();
})

valueYears.addEventListener('input', function() { // updates the label when changing slider
    valueYearsLabel.textContent = this.value;
})