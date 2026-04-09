
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
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
        id: Date.now(),
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
        updateRegretScore();
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
    updateRegretScore();
    updateCharts();
}

function rateExpense(index, rating) {
    expenses[index].rating = rating;
    if (rating == 'worth') {
        expenses[index].worthIt = true;
    } else {
        expenses[index].worthIt = false;
    }
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateRegretScore();
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

    let progressBar = document.getElementById('limitBar');
    let limitLabel = document.getElementById('limitLabel');
    let limitPct = document.getElementById('limitPct');

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

document.getElementById('setLimitBtn').addEventListener('click', function() {
    dailyLimit = parseFloat(document.getElementById('dailyLimitInput').value);
    if (!dailyLimit || dailyLimit <= 0) {
        alert('Please enter a valid limit');
        return;
    }
    localStorage.setItem('dailyLimit', dailyLimit);
    updateProgress();
});

if (dailyLimit > 0) {
    document.getElementById('dailyLimitInput').value = dailyLimit;
    updateProgress();
}

document.getElementById('addExpBtn').addEventListener('click', function() {
    addExpense();
});

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

    valueYearsLabel2.textContent = years;
    answer.textContent = '$' + fv.toFixed(2);
    answerSub.textContent = '$' + amount.toFixed(2) + ' at ' + rate + '% for ' + years + ' years';
}

calculateButton.addEventListener('click', function() {
    calculate();
});

valueYears.addEventListener('input', function() {
    valueYearsLabel.textContent = this.value;
});


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

    if (regretDisplay) regretDisplay.textContent = percent + '%';
    if (statRegret) statRegret.textContent = percent + '%';

    let worth = variableExpenses.filter(function(exp) { return exp.worthIt === true; });
    let notWorth = variableExpenses.filter(function(exp) { return exp.worthIt === false; });
    let unrated = variableExpenses.filter(function(exp) { return exp.worthIt === undefined; });

    if (worthCount) worthCount.textContent = worth.length;
    if (notWorthCount) notWorthCount.textContent = notWorth.length;
    if (unratedCount) unratedCount.textContent = unrated.length;
}

displayExpenses();
updateRegretScore();

let catChart, typeChart;
let expenses = [];

// Create charts
function createCharts() {
    const catCtx = document.getElementById('catChart').getContext('2d');
    const typeCtx = document.getElementById('typeChart').getContext('2d');

    // Doughnut chart (Category)
    catChart = new Chart(catCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses by Category',
                data: [],
                backgroundColor: [
                    '#4F46E5',
                    '#06B6D4',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#22C55E'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Bar chart (Fixed vs Variable)
    typeChart = new Chart(typeCtx, {
        type: 'bar',
        data: {
            labels: ['Fixed', 'Variable'],
            datasets: [{
                label: 'Total Expenses',
                data: [0, 0],
                backgroundColor: ['#3B82F6', '#F97316']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update charts
function updateCharts() {
    // CATEGORY TOTALS
    const categoryTotals = {};

    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    catChart.data.labels = Object.keys(categoryTotals);
    catChart.data.datasets[0].data = Object.values(categoryTotals);
    catChart.update();

    // FIXED vs VARIABLE
    let fixed = 0;
    let variable = 0;

    expenses.forEach(exp => {
        if (exp.type === "fixed") fixed += exp.amount;
        else variable += exp.amount;
    });

    typeChart.data.datasets[0].data = [fixed, variable];
    typeChart.update();
}

// Add expense button
document.getElementById('addExpBtn').addEventListener('click', () => {
    const name = document.getElementById('expName').value;
    const category = document.getElementById('expCategory').value;
    const amount = parseFloat(document.getElementById('expAmount').value);
    const type = document.querySelector('input[name="expType"]:checked').value;

    if (!name || !category || isNaN(amount)) return;

    expenses.push({ name, category, amount, type });

    updateCharts();
});

// Initialize
window.onload = function () {
    createCharts();
};