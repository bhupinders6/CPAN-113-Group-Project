
let expensesButton = document.getElementById('addExpBtn');
let progressBar = document.getElementById('limitBar');
let dailyLimitInput = document.getElementById('dailyLimitInput');
let limitLabel = document.getElementById('limitLabel');
let limitPct = document.getElementById('limitPct');
let setLimitBtn = document.getElementById('setLimitBtn');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let dailyLimit = parseFloat(localStorage.getItem('dailyLimit')) || 0;

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

setLimitBtn.addEventListener('click', function() { 
    dailyLimit = parseFloat(dailyLimitInput.value);
    if (!dailyLimit || dailyLimit <= 0) {
        alert('Please enter a valid limit');
        return;
    }
    localStorage.setItem('dailyLimit', dailyLimit);
    updateProgress();
});

expensesButton.addEventListener('click', function() { 
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