let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
    const name = document.getElementById("expName").value;
    const category = document.getElementById("expCategory").value;
    const amount = parseFloat(document.getElementById("expAmount").value);
    const type = document.querySelector('input[name="expType"]:checked').value;

    if (!name || !amount || !category) {
        alert("Please fill in all fields");
        return;
    }

    const expense = {
        name: name,
        category: category,
        amount: amount,
        type: type
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
}

function displayExpenses() {
    const tbody = document.getElementById("expBody");
    const emptyRow = document.getElementById("emptyRow");

    tbody.innerHTML = "";

    if(expenses.length == 0) {
        tbody.innerHTML = `
            <tr id="emptyRow">
                <td colspan="6" class="empty-msg">No expenses yet — add one to get started.</td>
            </tr>
        `;
        return;
    }

    expenses.forEach(function(exp, index) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exp.name}</td>
            <td>${exp.category}</td>
            <td>$${exp.amount.toFixed(2)}</td>
            <td>${exp.type}</td>
            <td>
                <button onclick="rateExpense(${index}, 'worth')">👍</button>
                <button onclick="rateExpense(${index}, 'notworth')">👎</button>
            </td>
            <td><button onclick="deleteExpense(${index})">🗑️</button></td>
        `;
        tbody.appendChild(row);
    });

    updateStats();
}

function rateExpense(index, rating) {
    expenses[index].rating = rating;
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
}

function updateStats() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById("statToday").textContent = "$" + total.toFixed(2);
    document.getElementById("statCount").textContent = expenses.length;
}

document.getElementById("addExpBtn").addEventListener("click", addExpense);

displayExpenses();