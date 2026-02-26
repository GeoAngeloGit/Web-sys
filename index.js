// Expenses stored as a Map (key-value pairs)
let expenses = new Map();
let rowCounter = 0;

// Initialize with one empty row
function initializeExpenseForm() {
    addExpenseRow();
}

// Add a new expense row
function addExpenseRow() {
    const rowId = rowCounter++;
    const container = document.getElementById('expenseContainer');
    
    // Create the row wrapper with validation
    const rowWrapper = document.createElement('div');
    rowWrapper.className = 'mb-3';
    rowWrapper.id = `row-${rowId}`;
    
    // Set the internal HTML
    rowWrapper.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control expName me-2 rounded" placeholder="Expense Name" data-row-id="${rowId}">
            <input type="number" class="form-control expAmount me-2 rounded" placeholder="Amount (₱)" data-row-id="${rowId}">
            <button class="btn btn-danger rounded" type="button" onclick="deleteExpenseRow(${rowId})">Delete</button>
        </div>
        <small class="input-warning d-none" id="warning-${rowId}"></small>
    `;
    
    container.appendChild(rowWrapper);
    
    // Add event listeners for input changes (update list only, no validation)
    const nameInput = rowWrapper.querySelector('.expName');
    const amountInput = rowWrapper.querySelector('.expAmount');
    
    nameInput.addEventListener('change', () => {
        updateExpense(rowId);
        validateExpenseRow(rowId);
    });
    nameInput.addEventListener('input', () => {
        updateExpense(rowId);
        validateExpenseRow(rowId);
    });
    
    amountInput.addEventListener('change', () => {
        updateExpense(rowId);
        validateExpenseRow(rowId);
    });
    amountInput.addEventListener('input', () => {
        updateExpense(rowId);
        validateExpenseRow(rowId);
    });
}

// Validate expense row
function validateExpenseRow(rowId) {
    const row = document.getElementById(`row-${rowId}`);
    const nameInput = row.querySelector('.expName');
    const amountInput = row.querySelector('.expAmount');
    const warning = document.getElementById(`warning-${rowId}`);
    
    const name = nameInput.value.trim();
    const amount = amountInput.value.trim();
    
    let hasError = false;
    let errorMessage = '';
    
    if (!name && amount) {
        hasError = true;
        nameInput.classList.add('is-invalid');
        amountInput.classList.remove('is-invalid');
        errorMessage = 'Expense name is required';
    } else if (name && !amount) {
        hasError = true;
        amountInput.classList.add('is-invalid');
        nameInput.classList.remove('is-invalid');
        errorMessage = 'Amount is required';
    } else if (!name && !amount) {
        nameInput.classList.remove('is-invalid');
        amountInput.classList.remove('is-invalid');
        warning.classList.add('d-none');
    } else {
        nameInput.classList.remove('is-invalid');
        amountInput.classList.remove('is-invalid');
    }
    
    if (hasError) {
        warning.textContent = errorMessage;
        warning.classList.remove('d-none');
    } else {
        warning.classList.add('d-none');
    }
}

// Delete an expense row
function deleteExpenseRow(rowId) {
    const row = document.getElementById(`row-${rowId}`);
    if (row) {
        row.remove();
    }
    expenses.delete(rowId);
    updateExpensesList();
}

// Update expense in the map when input changes
function updateExpense(rowId) {
    const row = document.getElementById(`row-${rowId}`);
    const nameInput = row.querySelector('.expName');
    const amountInput = row.querySelector('.expAmount');
    
    const name = nameInput.value.trim();
    const amount = amountInput.value.trim();
    
    if (name && amount) {
        expenses.set(rowId, { name: name, amount: parseFloat(amount) });
    } else {
        expenses.delete(rowId);
    }
    
    updateExpensesList();
}

// Update the expenses display list
function updateExpensesList() {
    const expensesList = document.getElementById('expensesList');
    
    if (expenses.size === 0) {
        expensesList.innerHTML = '<p class="text-muted">No expenses added</p>';
        return;
    }
    
    let html = '<div class="expense-items mb-2">';
    let total = 0;
    
    expenses.forEach((value) => {
        html += `
            <div class="d-flex justify-content-between mb-2">
                <span>${value.name.charAt(0).toUpperCase() + value.name.substring(1)}</span>
                <span>₱${value.amount.toFixed(2)}</span>
            </div>`;
        total += value.amount;
    });
    
    html += `</div>
        <div class="expense-total">
            <hr class="my-2">
            <div class="d-flex justify-content-between fw-bold text-danger">
                <span>Total</span>
                <span>₱${total.toFixed(2)}</span>
            </div>
        </div>`;
    
    expensesList.innerHTML = html;
}

function updateIncome() {
    const incomeInput = document.getElementById('monthlyIncome');
    const incomeList = document.getElementById('incomeList');
    const income = parseFloat(incomeInput.value);

    // If the input is empty or not a number, show the default message
    if (isNaN(income) || incomeInput.value === "") {
        incomeList.innerHTML = '<p class="text-muted">No income added</p>';
        return;
    }

    // Otherwise, display the formatted income
    let html = `
        <div class="d-flex justify-content-between mb-2">
            <span>Monthly Income</span>
            <span class="fw-bold text-primary">₱${income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>`;

    incomeList.innerHTML = html;
}

function updateSavingsRate() {
    const savingsRateInput = document.getElementById('savingsRate');
    const rateVal = document.getElementById('rateVal');
    const savingsRateList = document.getElementById('savingsRateList');
    
    const rate = parseFloat(savingsRateInput.value);
    
    // Update the display in the first card
    rateVal.textContent = rate;
    
    // Display the last adjusted rate in the third card
    const html = `
        <div class="d-flex justify-content-between mb-2">
            <span>Current Rate</span>
            <span class="fw-bold text-success">${rate}%</span>
        </div>`;
    
    savingsRateList.innerHTML = html;
}

// Validate income
function validateIncome() {
    const incomeInput = document.getElementById('monthlyIncome');
    const incomeWarning = document.getElementById('incomeWarning');
    const income = incomeInput.value.trim();
    
    if (!income || isNaN(parseFloat(income))) {
        incomeInput.classList.add('is-invalid');
        incomeWarning.classList.remove('d-none');
        return false;
    } else {
        incomeInput.classList.remove('is-invalid');
        incomeWarning.classList.add('d-none');
        return true;
    }
}

// Validate all expense rows before calculation
function validateAllExpenses() {
    const rows = document.querySelectorAll('[id^="row-"]');
    let isValid = true;
    
    rows.forEach(row => {
        const rowId = row.id.split('-')[1];
        const nameInput = row.querySelector('.expName');
        const amountInput = row.querySelector('.expAmount');
        
        const name = nameInput.value.trim();
        const amount = amountInput.value.trim();
        
        if ((name && !amount) || (!name && amount)) {
            validateExpenseRow(rowId);
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle Calculate button click
function handleCalculate() {
    const incomeValid = validateIncome();
    const expensesValid = validateAllExpenses();
    
    if (incomeValid && expensesValid) {
        financialOverview();
        yearlyProjections();
    }
}

// Handle "Add New Expense" button click - validate before adding
function handleAddExpense() {
    const rows = document.querySelectorAll('[id^="row-"]');
    let isValid = true;
    
    // Validate all existing rows
    rows.forEach(row => {
        const rowId = row.id.split('-')[1];
        const nameInput = row.querySelector('.expName');
        const amountInput = row.querySelector('.expAmount');
        
        const name = nameInput.value.trim();
        const amount = amountInput.value.trim();
        
        // Only validate if the row has any input
        if (name || amount) {
            if (!name || !amount) {
                validateExpenseRow(rowId);
                isValid = false;
            }
        }
    });
    
    // Only add new row if validation passes
    if (isValid) {
        addExpenseRow();
    }
}

function calculateSavings(){
    const incomeInput = document.getElementById('monthlyIncome');
    const savingsRateInput = document.getElementById('savingsRate');
    const income = parseFloat(incomeInput.value);
    const rate = parseFloat(savingsRateInput.value);
    const savings = (income * rate) / 100;
    return savings;
}

function financialOverview(){
    const savings = calculateSavings() || 0;
    const expensesTotal = Array.from(expenses.values()).reduce((total, exp) => total + exp.amount, 0);
    const incomeInput = document.getElementById('monthlyIncome');
    const income = parseFloat(incomeInput.value) || 0;
    const remaining = income - expensesTotal - savings;
    
    if (savings + expensesTotal >= income) {
        const adjustedRemaining = income - expensesTotal;
        document.getElementById('savingsAmount').textContent = `₱${adjustedRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('remaining').textContent = `₱${adjustedRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    else{
        document.getElementById('savingsAmount').textContent = `₱${savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('remaining').textContent = `₱${remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    document.getElementById('expense').textContent = `₱${expensesTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('income').textContent = `₱${income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // update chart bars for overview
    updateBarChart('Overview', income, expensesTotal, savings, remaining);
}
function yearlyProjections(){
    const savings = calculateSavings() || 0;
    const yearlySavings = savings * 12;

    const expensesTotal = Array.from(expenses.values()).reduce((total, exp) => total + exp.amount, 0);
    const yearlyExpenses = expensesTotal * 12;

    const incomeInput = document.getElementById('monthlyIncome');
    const yearlyIncome = (parseFloat(incomeInput.value) || 0) * 12;

    const yearlyRemaining = yearlyIncome - yearlyExpenses - yearlySavings;
    
    if (yearlySavings + yearlyExpenses >= yearlyIncome) {
        const adjustedRemaining = yearlyIncome - yearlyExpenses;
        document.getElementById('yearlySavingsAmount').textContent = `₱${adjustedRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('yearlyRemaining').textContent = `₱${adjustedRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    else{
        document.getElementById('yearlySavingsAmount').textContent = `₱${yearlySavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('yearlyRemaining').textContent = `₱${yearlyRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    document.getElementById('yearlyExpense').textContent = `₱${yearlyExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('yearlyIncome').textContent = `₱${yearlyIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // update bars for yearly projections
    updateBarChart('Yearly', yearlyIncome, yearlyExpenses, yearlySavings, yearlyRemaining);
}

// Event listener for "Add New Expense" button
document.getElementById('addExpBtn').addEventListener('click', handleAddExpense);

// Event listener for monthly income input
const incomeInputEl = document.getElementById('monthlyIncome');
incomeInputEl.addEventListener('change', () => {
    updateIncome();
    validateIncome();
});
incomeInputEl.addEventListener('input', () => {
    updateIncome();
    validateIncome();
});

// Event listener for savings rate slider
document.getElementById('savingsRate').addEventListener('input', updateSavingsRate);

// Event listener for Calculate button
document.getElementById('calcBtn').addEventListener('click', handleCalculate);
document.getElementById('calcBtn').addEventListener('click', function() {
    // Run your calculation logic
    financialOverview();

    // Scroll to the section
    const overviewSection = document.getElementById('financial-overview');
    if (overviewSection) {
        overviewSection.scrollIntoView({ behavior: 'smooth' });
    }
});


// utility to update bars, prefix either 'Overview' or 'Yearly'
function updateBarChart(prefix, income, expense, savings, remaining) {
    // determine base for 100% - use income if >0 else sum of all positive values
    let base = income;
    if (base <= 0) {
        base = Math.max(expense, savings, remaining, 1); // avoid divide by zero
    }
    const types = ['Income','Expense','Savings','Remaining'];
    const values = [income, expense, savings, remaining];
    types.forEach((type,i) => {
        const id = `bar${type}${prefix}`;
        const bar = document.getElementById(id);
        if (bar) {
            const pct = base > 0 ? (values[i] / base) * 100 : 0;
            bar.style.height = pct + '%';
        }
    });
}

// observer triggers chart animation when container scrolls into view
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // determine which prefix based on surrounding heading
            const section = entry.target.closest('section');
            if (section && section.id === 'financial-overview') {
                // recalc again to ensure latest values
                financialOverview();
                yearlyProjections();
            }
        }
    });
}, { threshold: 0.3 });

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeExpenseForm();
    updateIncome();
    updateSavingsRate();
    financialOverview();
    yearlyProjections();

    // start observing chart containers for scroll-triggered animation
    document.querySelectorAll('.chart-container').forEach(container => {
        observer.observe(container);
    });
});