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