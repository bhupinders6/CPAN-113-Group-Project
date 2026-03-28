let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
    const name = document.getElementById("expenseName").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (!name || !amount) {
        alert("Please enter a name and amount");
        return;
    }

    const expense = {
        name: name,
        amount: amount
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
}

function displayExpenses() {
    const list = document.getElementById("expenseList");
    const total = document.getElementById("totalAmount");

    list.innerHTML = "";
    let sum = 0;

    expenses.forEach(exp => {
        const item = document.createElement("li");
        item.textContent = `${exp.name} - $${exp.amount}`;
        list.appendChild(item);
        sum += exp.amount;
    });

    total.textContent = "Total: $" + sum;
}

displayExpenses();