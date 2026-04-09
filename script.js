
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let expensesButton = document.getElementById('addExpBtn');
let progressBar = document.getElementById('limitBar');
let dailyLimitInput = document.getElementById('dailyLimitInput');
let limitLabel = document.getElementById('limitLabel');
let limitPct = document.getElementById('limitPct');
let setLimitBtn = document.getElementById('setLimitBtn');
let dailyLimit = parseFloat(localStorage.getItem('dailyLimit')) || 0;

function addExpense() {
    let name = document.getElementById('expName').value;
    let category = document.getElementById('expCategory').value;
    let amount = parseFloat(document.getElementById('expAmount').value);
    let type = document.querySelector('input[name="expType"]:checked').value;

    if (!name || !amount || !category) {
        alert('Please fill in all fields');
        return;
    }

    let expense = {
        name: name,
        category: category,
        amount: amount,
        type: type
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

function displayExpenses() {
    let tbody = document.getElementById('expBody');
    tbody.innerHTML = '';

    if (expenses.length == 0) {
        tbody.innerHTML = `
            <tr id="emptyRow">
                <td colspan="6" class="empty-msg">No expenses yet — add one to get started.</td>
            </tr>
        `;
        return;
    }

    for (let i = 0; i < expenses.length; i++) { 
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${expenses[i].name}</td>
            <td>${expenses[i].category}</td>
            <td>$${expenses[i].amount.toFixed(2)}</td>
            <td>${expenses[i].type}</td>
            <td>
                <button onclick="rateExpense(${i}, 'worth')">👍</button>
                <button onclick="rateExpense(${i}, 'notworth')">👎</button>
            </td>
            <td><button onclick="deleteExpense(${i})">🗑️</button></td>
        `;
        tbody.appendChild(row);
    }

    updateStats();
}

function rateExpense(index, rating) {
    expenses[index].rating = rating;
<<<<<<< HEAD
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
=======
    if(rating == 'worth') {
        expenses[index].worthIt = true;
    } else {
        expenses[index].worthIt = false;
    }
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateRegretScore();
>>>>>>> feature/regret-score
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

function updateStats() {
    let total = 0.0;
    for (let i = 0; i < expenses.length; i++) {
        total = total + expenses[i].amount;
    }
    document.getElementById('statToday').textContent = '$' + total.toFixed(2);
    document.getElementById('statCount').textContent = expenses.length;
    updateProgress();
}


function updateProgress() {
    let sum = 0.0;
    for (let i = 0; i < expenses.length; i++) { 
        sum = sum + expenses[i].amount;
    }

    if (dailyLimit <= 0) return; 

    let percent = Math.round((sum / dailyLimit) * 100); 
    if (percent > 100) { 
        percent = 100;
    }

    progressBar.value = percent; 
    limitLabel.textContent = '$' + sum.toFixed(2) + ' of $' + dailyLimit.toFixed(2);
    limitPct.textContent = percent + '%';

    if (percent >= 100) { 
        progressBar.style.accentColor = 'red';
    } else if (percent >= 75) { 
        progressBar.style.accentColor = 'orange';
    } else {
        progressBar.style.accentColor = 'green';
    }
}

expensesButton.addEventListener('click', function() { 
    addExpense();
    updateProgress();
});

setLimitBtn.addEventListener('click', function() { 
    dailyLimit = parseFloat(dailyLimitInput.value);
    if (!dailyLimit || dailyLimit <= 0) {
        alert('Please enter a valid limit');
        return;
    }
    localStorage.setItem('dailyLimit', dailyLimit);
    updateProgress();
});


if (dailyLimit > 0) {
    dailyLimitInput.value = dailyLimit;
    updateProgress();
}


let valueAmount = document.getElementById('fvAmount');
let valueRate = document.getElementById('fvRate');
let valueYears = document.getElementById('fvYears');
let valueYearsLabel = document.getElementById('fvYearsLbl');
let valueYearsLabel2 = document.getElementById('fvResYears');
let calculateButton = document.getElementById('calcFvBtn');
let answer = document.getElementById('fvResNum');
let answerSub = document.getElementById('fvResSub');

function calculate() { 
    let amount = parseFloat(valueAmount.value);
    let rate = parseFloat(valueRate.value);
    let years = parseInt(valueYears.value);

    if (!amount || !rate || !years) {
        alert('Please fill in all fields');
        return;
    }

    // FV = P * (1 + r/100) ^ t
    let fv = amount * Math.pow((1 + rate / 100), years);

    valueYearsLabel2.textContent = years; // sets the year to "in X years..."
    answer.textContent = '$' + fv.toFixed(2); // overwrites "$--"
    answerSub.textContent = '$' + amount.toFixed(2) + ' at ' + rate + '% for ' + years + ' years';
}

calculateButton.addEventListener('click', function() { 
    calculate();
});

valueYears.addEventListener('input', function() { 
    valueYearsLabel.textContent = this.value;
});

<<<<<<< HEAD
displayExpenses();
=======
displayExpenses();


function updateRegretScore() {
    let variableExpenses = expenses.filter(function(exp) {
        return exp.type === 'variable';
    });

    let notWorthIt = variableExpenses.filter(function(exp) {
        return exp.worthIt === false;
    });

    let percent = variableExpenses.length === 0 ? 0 : Math.round((notWorthIt.length / variableExpenses.length) * 100);

    let regretDisplay = document.getElementById('regretDisplay');
    let statRegret = document.getElementById('statRegret');
    let worthCount = document.getElementById('worthCount');
    let notWorthCount = document.getElementById('notWorthCount');
    let unratedCount = document.getElementById('unratedCount');

    if(regretDisplay) regretDisplay.textContent = percent + '%';
    if(statRegret) statRegret.textContent = percent + '%';

    let worth = variableExpenses.filter(function(exp) { return exp.worthIt === true; });
    let notWorth = variableExpenses.filter(function(exp) { return exp.worthIt === false; });
    let unrated = variableExpenses.filter(function(exp) { return exp.worthIt === undefined; });

    if(worthCount) worthCount.textContent = worth.length;
    if(notWorthCount) notWorthCount.textContent = notWorth.length;
    if(unratedCount) unratedCount.textContent = unrated.length;
}

updateStats();
updateRegretScore();
>>>>>>> feature/regret-score
