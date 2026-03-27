
let goals = JSON.parse(localStorage.getItem("goals")) || [];


const addGoalBtn = document.getElementById("addGoalBtn");
const goalName = document.getElementById("goalName");
const goalTarget = document.getElementById("goalTarget");
const goalDeadline = document.getElementById("goalDeadline");
const goalsContainer = document.getElementById("goalsContainer");
const goalsEmpty = document.getElementById("goalsEmpty");


function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}


function renderGoals() {
  goalsContainer.innerHTML = "";

  if (goals.length === 0) {
    goalsContainer.appendChild(goalsEmpty);
    return;
  }

  goals.forEach((goal, index) => {
    const percent = Math.min((goal.saved / goal.target) * 100, 100);

    const card = document.createElement("div");
    card.className = "goal-card";

    card.innerHTML = `
      <h4>${goal.name}</h4>
      <p><strong>$${goal.saved.toFixed(2)}</strong> / $${goal.target.toFixed(2)}</p>
      <p>Deadline: ${goal.deadline || "None"}</p>

      <progress value="${percent}" max="100"></progress>
      <small>${percent.toFixed(0)}%</small>

      <div style="margin-top:8px; display:flex; gap:5px;">
        <input type="number" placeholder="Add $" min="0" step="0.01" id="add-${index}" style="flex:1;" />
        <button data-index="${index}" class="addMoneyBtn btn-primary">Add</button>
      </div>
    `;

    goalsContainer.appendChild(card);
  });

  attachAddMoneyEvents();
}


addGoalBtn.addEventListener("click", () => {
  const name = goalName.value.trim();
  const target = parseFloat(goalTarget.value);
  const deadline = goalDeadline.value;

  if (!name || !target || target <= 0) {
    alert("Please enter valid goal info");
    return;
  }

  const newGoal = {
    name,
    target,
    deadline,
    saved: 0
  };

  goals.push(newGoal);
  saveGoals();
  renderGoals();

  
  goalName.value = "";
  goalTarget.value = "";
  goalDeadline.value = "";
});


function attachAddMoneyEvents() {
  const buttons = document.querySelectorAll(".addMoneyBtn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const input = document.getElementById(`add-${index}`);
      const amount = parseFloat(input.value);

      if (!amount || amount <= 0) return;

      goals[index].saved += amount;

      saveGoals();
      renderGoals();
    });
  });
}


renderGoals();