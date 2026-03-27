//Karen Nguyen: Regret Score

const EXPENSES_KEY = "expenses";

// Get saved expenses from localStorage
function getExpenses() {
  return JSON.parse(localStorage.getItem(EXPENSES_KEY)) || [];
}

// Save updated expenses to localStorage
function saveExpenses(expenses) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

// Update the Regret Score on the page
function updateRegretScore() {
  const expenses = getExpenses();

  // Only use variable expenses
  const variableExpenses = expenses.filter((expense) => expense.type === "variable");

  // Count variable expenses marked as not worth it
  const notWorthIt = variableExpenses.filter((expense) => expense.worthIt === false);

  const percent =
    variableExpenses.length === 0
      ? 0
      : Math.round((notWorthIt.length / variableExpenses.length) * 100);

  const regretDisplay = document.getElementById("regretDisplay");
  const statRegret = document.getElementById("statRegret");

  if (regretDisplay) {
    regretDisplay.textContent = percent + "%";
  }

  if (statRegret) {
    statRegret.textContent = percent + "%";
  }
}

// Save whether an expense was worth it or not
function setWorthIt(id, value) {
  const expenses = getExpenses();

  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].id == id) {
      expenses[i].worthIt = value;
      break;
    }
  }

  saveExpenses(expenses);
  updateRegretScore();
}

// Listen for 👍 and 👎 clicks
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("thumbs-up")) {
    setWorthIt(event.target.dataset.id, true);
  }

  if (event.target.classList.contains("thumbs-down")) {
    setWorthIt(event.target.dataset.id, false);
  }
});

// Show score when page loads
updateRegretScore();