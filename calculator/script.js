// Global variables
let userData = {};
let loanData = {};
let isEligible = false;

// Main function to initialize the application
function main() {
    setupEventListeners();
}

// Toggle calculator mode
function toggleCalculatorMode() {
    const calculatorType = document.getElementById('calculatorType').value;
    const employmentRow = document.getElementById('employmentRow');
    const incomeRow = document.getElementById('incomeRow');
    const existingEmiRow = document.getElementById('existingEmiRow');
    const loanAmountRow = document.getElementById('loanAmountRow');
    const calculateBtn = document.getElementById('calculateBtn');
    const result1Label = document.getElementById('result1Label');
    const result2Label = document.getElementById('result2Label');
    
    if (calculatorType === 'eligibility') {
        employmentRow.style.display = 'block';
        incomeRow.style.display = 'block';
        existingEmiRow.style.display = 'block';
        loanAmountRow.style.display = 'none';
        calculateBtn.textContent = 'Calculate Eligibility';
        result1Label.textContent = 'Total Eligible Amount';
        result2Label.textContent = 'Available EMI';
    } else {
        employmentRow.style.display = 'none';
        incomeRow.style.display = 'none';
        existingEmiRow.style.display = 'none';
        loanAmountRow.style.display = 'block';
        calculateBtn.textContent = 'Calculate EMI';
        result1Label.textContent = 'Loan Amount';
        result2Label.textContent = 'Monthly EMI';
    }
    
    calculateRealTime();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('userData').addEventListener('submit', function(e) {
        e.preventDefault();
        inputUserData();
    });
    
    // Range slider listeners
    setupSliderListeners();
    
    // EMI button listeners
    document.querySelectorAll('.emi-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.emi-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const value = this.dataset.value;
            document.getElementById('existingEmi').value = value;
            document.getElementById('existingEmiSlider').value = value;
            updateSliderDisplay('existingEmiSlider', 'existingEmiValue');
            calculateRealTime();
        });
    });
    
    // Rate button listeners
    document.querySelectorAll('.rate-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.rate-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const value = this.dataset.value;
            document.getElementById('interestRate').value = value;
            document.getElementById('interestRateSlider').value = value;
            updateSliderDisplay('interestRateSlider', 'interestRateValue');
            calculateRealTime();
        });
    });
    
    // Duration button listeners
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (!this.classList.contains('custom-btn')) {
                const value = this.dataset.value;
                document.getElementById('loanDuration').value = value;
                document.getElementById('durationSlider').value = value;
                updateSliderDisplay('durationSlider', 'durationValue');
            }
            calculateRealTime();
        });
    });
    
    // Input change listeners for real-time calculation
    ['customIncome', 'existingEmi', 'interestRate', 'loanDuration', 'loanAmount'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            syncInputToSlider(id);
            calculateRealTime();
        });
    });
}

// Setup slider event listeners
function setupSliderListeners() {
    // Income slider
    document.getElementById('incomeSlider').addEventListener('input', function() {
        document.getElementById('customIncome').value = this.value;
        updateSliderDisplay('incomeSlider', 'incomeValue');
        calculateRealTime();
    });
    
    // Loan amount slider
    document.getElementById('loanAmountSlider').addEventListener('input', function() {
        document.getElementById('loanAmount').value = this.value;
        updateSliderDisplay('loanAmountSlider', 'loanAmountValue');
        calculateRealTime();
    });
    
    // Existing EMI slider
    document.getElementById('existingEmiSlider').addEventListener('input', function() {
        document.getElementById('existingEmi').value = this.value;
        updateSliderDisplay('existingEmiSlider', 'existingEmiValue');
        calculateRealTime();
    });
    
    // Interest rate slider
    document.getElementById('interestRateSlider').addEventListener('input', function() {
        document.getElementById('interestRate').value = this.value;
        updateSliderDisplay('interestRateSlider', 'interestRateValue');
        calculateRealTime();
    });
    
    // Duration slider
    document.getElementById('durationSlider').addEventListener('input', function() {
        document.getElementById('loanDuration').value = this.value;
        updateSliderDisplay('durationSlider', 'durationValue');
        calculateRealTime();
    });
}

// Update slider display values
function updateSliderDisplay(sliderId, displayId) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    const value = parseFloat(slider.value);
    
    if (sliderId.includes('income') || sliderId.includes('loanAmount') || sliderId.includes('existingEmi')) {
        display.textContent = value.toLocaleString();
    } else {
        display.textContent = value;
    }
}

// Sync input field changes to sliders
function syncInputToSlider(inputId) {
    const input = document.getElementById(inputId);
    const value = input.value;
    
    switch(inputId) {
        case 'customIncome':
            document.getElementById('incomeSlider').value = value;
            updateSliderDisplay('incomeSlider', 'incomeValue');
            break;
        case 'loanAmount':
            document.getElementById('loanAmountSlider').value = value;
            updateSliderDisplay('loanAmountSlider', 'loanAmountValue');
            break;
        case 'existingEmi':
            document.getElementById('existingEmiSlider').value = value;
            updateSliderDisplay('existingEmiSlider', 'existingEmiValue');
            break;
        case 'interestRate':
            document.getElementById('interestRateSlider').value = value;
            updateSliderDisplay('interestRateSlider', 'interestRateValue');
            break;
        case 'loanDuration':
            document.getElementById('durationSlider').value = value;
            updateSliderDisplay('durationSlider', 'durationValue');
            break;
    }
}

// Input and validate user data
function inputUserData() {
    const calculatorType = document.getElementById('calculatorType').value;
    const interestRate = document.getElementById('interestRate').value;
    const duration = document.getElementById('loanDuration').value;

    if (!interestRate || !duration) {
        alert('Please fill all required fields');
        return;
    }

    if (calculatorType === 'eligibility') {
        const income = document.getElementById('customIncome').value;
        const existingEmi = document.getElementById('existingEmi').value;
        const employment = document.querySelector('input[name="employment"]:checked')?.value;

        if (!income) {
            alert('Please enter monthly income');
            return;
        }

        userData = {
            income: parseFloat(income),
            existingEmi: parseFloat(existingEmi) || 0,
            interestRate: parseFloat(interestRate),
            duration: parseFloat(duration),
            employment: employment
        };

        calculateDetailedEligibility();
    } else {
        const loanAmount = document.getElementById('loanAmount').value;
        
        if (!loanAmount) {
            alert('Please enter loan amount');
            return;
        }

        loanData = {
            amount: parseFloat(loanAmount),
            duration: parseFloat(duration),
            interestRate: parseFloat(interestRate),
            emi: calculateEMI(parseFloat(loanAmount), parseFloat(interestRate), parseFloat(duration))
        };

        hideAllSections();
        document.getElementById('results').classList.remove('hidden');
        displayEMIResult();
        displaySchedule();
        displaySummary();
    }
}

// Real-time calculation
function calculateRealTime() {
    const calculatorType = document.getElementById('calculatorType').value;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 7.7;
    const duration = parseFloat(document.getElementById('loanDuration').value) || 2;
    
    if (calculatorType === 'eligibility') {
        const income = parseFloat(document.getElementById('customIncome').value) || 50000;
        const existingEmi = parseFloat(document.getElementById('existingEmi').value) || 0;
        
        // Calculate eligible amount (40% of income minus existing EMIs)
        const availableIncome = income * 0.4 - existingEmi;
        const eligibleAmount = Math.max(0, calculateLoanAmount(availableIncome, interestRate, duration));
        
        // Calculate EMI for eligible amount
        const emi = availableIncome > 0 ? availableIncome : 0;
        
        // Update display
        document.getElementById('eligibleAmount').textContent = `₹${Math.round(eligibleAmount).toLocaleString()}`;
        document.getElementById('totalEmi').textContent = `₹${Math.round(emi).toLocaleString()}`;
    } else {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 100000;
        const emi = calculateEMI(loanAmount, interestRate, duration);
        
        // Update display
        document.getElementById('eligibleAmount').textContent = `₹${loanAmount.toLocaleString()}`;
        document.getElementById('totalEmi').textContent = `₹${Math.round(emi).toLocaleString()}`;
    }
}

// Calculate loan amount from EMI
function calculateLoanAmount(emi, annualRate, years) {
    if (emi <= 0) return 0;
    
    const monthlyRate = annualRate / (12 * 100);
    const totalMonths = years * 12;
    
    if (monthlyRate === 0) return emi * totalMonths;
    
    const loanAmount = (emi * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / 
                      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
    
    return loanAmount;
}

// Validate input data
function validateInput(income, age, creditScore) {
    return income > 0 && age >= 18 && age <= 80 && creditScore >= 300 && creditScore <= 850;
}

// Calculate detailed eligibility
function calculateDetailedEligibility() {
    const availableIncome = userData.income * 0.4 - userData.existingEmi;
    const eligibleAmount = Math.max(0, calculateLoanAmount(availableIncome, userData.interestRate, userData.duration));
    
    isEligible = availableIncome > 0 && eligibleAmount > 0;
    
    loanData = {
        amount: eligibleAmount,
        duration: userData.duration,
        interestRate: userData.interestRate,
        emi: Math.max(0, availableIncome)
    };
    
    displayDetailedResults();
}

// Display detailed results
function displayDetailedResults() {
    hideAllSections();
    document.getElementById('results').classList.remove('hidden');
    
    const resultDiv = document.getElementById('eligibilityResult');
    const eligibilityClass = isEligible ? 'eligible' : 'not-eligible';
    const status = isEligible ? 'Eligible' : 'Not Eligible';
    
    resultDiv.innerHTML = `
        <div class="result-card ${eligibilityClass}">
            <h3>Loan Eligibility: ${status}</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Monthly Income</h4>
                    <p>₹${userData.income.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Available for EMI</h4>
                    <p>₹${Math.max(0, userData.income * 0.4 - userData.existingEmi).toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Eligible Amount</h4>
                    <p>₹${Math.round(loanData.amount).toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>EMI</h4>
                    <p>₹${Math.round(loanData.emi).toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
    
    if (isEligible) {
        displayEMIResult();
        displaySchedule();
        displaySummary();
    }
}

// Display eligibility result
function displayEligibilityResult(maxEligibleAmount, loanLimits) {
    hideAllSections();
    document.getElementById('results').classList.remove('hidden');
    
    const resultDiv = document.getElementById('eligibilityResult');
    const eligibilityClass = isEligible ? 'eligible' : 'not-eligible';
    const status = isEligible ? 'Eligible' : 'Not Eligible';
    const message = isEligible ? 
        `Congratulations! You are eligible for ${loanLimits.description}.` : 
        'Sorry, you do not meet the eligibility criteria.';

    resultDiv.innerHTML = `
        <div class="result-card ${eligibilityClass}">
            <h3>Eligibility Status: ${status}</h3>
            <p>${message}</p>
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Your Income</h4>
                    <p>₹${userData.income.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Credit Score</h4>
                    <p>${userData.creditScore}</p>
                </div>
                <div class="summary-item">
                    <h4>Requested Amount</h4>
                    <p>₹${userData.requestedAmount.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Max Eligible Amount</h4>
                    <p>₹${maxEligibleAmount.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
    
    // Display loan limits information
    displayLoanLimits(loanLimits);
}

// Display loan limits
function displayLoanLimits(loanLimits) {
    const limitsDiv = document.getElementById('loanLimits');
    limitsDiv.innerHTML = `
        <div class="loan-limits">
            <h4>${loanLimits.description} - Eligibility Criteria</h4>
            <div class="limits-grid">
                <div class="limit-item">
                    <strong>Min Income Required</strong><br>
                    ₹${loanLimits.minIncome.toLocaleString()}
                </div>
                <div class="limit-item">
                    <strong>Maximum Loan Amount</strong><br>
                    ₹${loanLimits.max.toLocaleString()}
                </div>
                <div class="limit-item">
                    <strong>Age Limit</strong><br>
                    21 - 65 years
                </div>
                <div class="limit-item">
                    <strong>Min Credit Score</strong><br>
                    650
                </div>
            </div>
        </div>
    `;
}

// Show loan type selection
function selectLoanType() {
    document.getElementById('loanTypeSelection').classList.remove('hidden');
}



// Process loan calculation
function processLoan() {
    const loanType = document.getElementById('loanType').value;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const duration = parseInt(document.getElementById('duration').value);

    if (!loanAmount || !duration || loanAmount <= 0 || duration <= 0) {
        alert('Please enter valid loan amount and duration');
        return;
    }

    loanData = {
        type: loanType,
        amount: loanAmount,
        duration: duration,
        interestRate: calculateInterestRate(loanType)
    };

    const emi = calculateEMI(loanAmount, loanData.interestRate, duration);
    loanData.emi = emi;

    displayEMIResult();
    displaySchedule();
    applyDiscount();
    displaySummary();
    thankUser();
}

// Calculate interest rate based on loan type
function calculateInterestRate(loanType) {
    const rates = {
        home: 8.5,
        personal: 12.0,
        car: 9.5,
        education: 7.0,
        business: 11.0
    };
    return rates[loanType] || 10.0;
}

// Get loan limits based on type
function getLoanLimits(loanType) {
    const limits = {
        home: { max: 10000000, minIncome: 30000, description: 'Home Loan' },
        personal: { max: 2500000, minIncome: 25000, description: 'Personal Loan' },
        car: { max: 5000000, minIncome: 20000, description: 'Car Loan' },
        education: { max: 7500000, minIncome: 15000, description: 'Education Loan' },
        business: { max: 20000000, minIncome: 50000, description: 'Business Loan' }
    };
    return limits[loanType] || { max: 1000000, minIncome: 25000, description: 'General Loan' };
}

// Calculate EMI
function calculateEMI(principal, annualRate, years) {
    const monthlyRate = annualRate / (12 * 100);
    const totalMonths = years * 12;
    
    if (monthlyRate === 0) return principal / totalMonths;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    return Math.round(emi);
}

// Display EMI result
function displayEMIResult() {
    const resultDiv = document.getElementById('emiResult');
    const totalAmount = loanData.emi * loanData.duration * 12;
    const totalInterest = totalAmount - loanData.amount;

    resultDiv.innerHTML = `
        <div class="result-card">
            <h3>EMI Calculation Result</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Monthly EMI</h4>
                    <p>₹${loanData.emi.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Total Interest</h4>
                    <p>₹${totalInterest.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Total Amount</h4>
                    <p>₹${totalAmount.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
}

// Display payment schedule (first 12 months)
function displaySchedule() {
    const scheduleDiv = document.getElementById('schedule');
    let balance = loanData.amount;
    const monthlyRate = loanData.interestRate / (12 * 100);
    
    let scheduleHTML = `
        <div class="result-card">
            <h3>Payment Schedule (First 12 Months)</h3>
            <table>
                <tr>
                    <th>Month</th>
                    <th>EMI</th>
                    <th>Interest</th>
                    <th>Principal</th>
                    <th>Balance</th>
                </tr>
    `;

    for (let month = 1; month <= Math.min(12, loanData.duration * 12); month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = loanData.emi - interestPayment;
        balance -= principalPayment;

        scheduleHTML += `
            <tr>
                <td>${month}</td>
                <td>₹${loanData.emi.toLocaleString()}</td>
                <td>₹${Math.round(interestPayment).toLocaleString()}</td>
                <td>₹${Math.round(principalPayment).toLocaleString()}</td>
                <td>₹${Math.round(balance).toLocaleString()}</td>
            </tr>
        `;
    }

    scheduleHTML += '</table></div>';
    scheduleDiv.innerHTML = scheduleHTML;
}

// Apply discount based on credit score
function applyDiscount() {
    if (!userData.creditScore) return;

    let discount = 0;
    if (userData.creditScore >= 800) discount = 0.5;
    else if (userData.creditScore >= 750) discount = 0.3;
    else if (userData.creditScore >= 700) discount = 0.1;

    if (discount > 0) {
        const newRate = loanData.interestRate - discount;
        const newEMI = calculateEMI(loanData.amount, newRate, loanData.duration);
        const savings = (loanData.emi - newEMI) * loanData.duration * 12;

        const discountDiv = document.createElement('div');
        discountDiv.className = 'result-card eligible';
        discountDiv.innerHTML = `
            <h3>Special Discount Applied!</h3>
            <p>Based on your excellent credit score of ${userData.creditScore}, you get ${discount}% interest rate reduction.</p>
            <p><strong>New Interest Rate:</strong> ${newRate.toFixed(2)}%</p>
            <p><strong>New EMI:</strong> ₹${newEMI.toLocaleString()}</p>
            <p><strong>Total Savings:</strong> ₹${Math.round(savings).toLocaleString()}</p>
        `;
        
        document.getElementById('results').appendChild(discountDiv);
    }
}

// Display final summary
function displaySummary() {
    const summaryDiv = document.getElementById('summary');
    const loanTypeNames = {
        home: 'Home Loan',
        personal: 'Personal Loan',
        car: 'Car Loan',
        education: 'Education Loan',
        business: 'Business Loan'
    };

    summaryDiv.innerHTML = `
        <div class="result-card">
            <h3>Loan Summary</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Loan Type</h4>
                    <p>${loanTypeNames[loanData.type]}</p>
                </div>
                <div class="summary-item">
                    <h4>Principal Amount</h4>
                    <p>₹${loanData.amount.toLocaleString()}</p>
                </div>
                <div class="summary-item">
                    <h4>Interest Rate</h4>
                    <p>${loanData.interestRate}% p.a.</p>
                </div>
                <div class="summary-item">
                    <h4>Loan Duration</h4>
                    <p>${loanData.duration} years</p>
                </div>
            </div>
        </div>
    `;
}

// Thank user
function thankUser() {
    const thankDiv = document.createElement('div');
    thankDiv.className = 'result-card';
    thankDiv.innerHTML = `
        <h3>Thank You!</h3>
        <p>Thank you for using our Loan Eligibility & EMI Calculator. We hope this information helps you make an informed decision about your loan.</p>
    `;
    document.getElementById('results').appendChild(thankDiv);
}

// Reset calculator
function resetCalculator() {
    userData = {};
    loanData = {};
    isEligible = false;
    
    // Clear all form inputs
    document.getElementById('customIncome').value = '50000';
    document.getElementById('existingEmi').value = '20000';
    document.getElementById('interestRate').value = '7.7';
    document.getElementById('loanDuration').value = '2';
    document.getElementById('loanAmount').value = '';
    document.getElementById('calculatorType').value = 'eligibility';
    
    // Reset button states
    document.querySelectorAll('.emi-btn, .rate-btn, .duration-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset radio buttons
    document.getElementById('salaried').checked = true;
    
    // Reset calculator mode
    toggleCalculatorMode();
    
    // Clear results
    document.getElementById('eligibilityResult').innerHTML = '';
    document.getElementById('emiResult').innerHTML = '';
    document.getElementById('schedule').innerHTML = '';
    document.getElementById('summary').innerHTML = '';
    
    // Remove any dynamically added elements
    const resultCards = document.querySelectorAll('#results .result-card');
    resultCards.forEach((card, index) => {
        if (index > 3) card.remove(); // Keep only the first 4 result divs
    });
    
    document.getElementById('userDataForm').classList.remove('hidden');
}

// Hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
}

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    main();
    initializeSliderDisplays();
    calculateRealTime(); // Initial calculation
});

// Initialize slider display values
function initializeSliderDisplays() {
    updateSliderDisplay('incomeSlider', 'incomeValue');
    updateSliderDisplay('loanAmountSlider', 'loanAmountValue');
    updateSliderDisplay('existingEmiSlider', 'existingEmiValue');
    updateSliderDisplay('interestRateSlider', 'interestRateValue');
    updateSliderDisplay('durationSlider', 'durationValue');
}