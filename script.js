'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Mohammed Zaky', movements: [200, 450, -400, 3000, -650, -130, 70, 1300], interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Ahmed Eid', movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30], interestRate: 1.5, pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith', movements: [430, 1000, 700, 50, 90], interestRate: 1, pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([['USD', 'United States dollar'], ['EUR', 'Euro'], ['GBP', 'Pound sterling'],]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// Display movements
const displayMovements = function (movements) {
    containerMovements.innerHTML = '';
    movements.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">3 days ago</div>
                <div class="movements__value">${mov}€</div>
            </div>
    `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

// calculate balance
const calcPrintBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance}€`;
}

// Calculate and display summary
const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}€`;

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => {
            return int >= 1;
        })
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest}€`;
}

// create username
const createUsernames = function (accs) {

    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
}
createUsernames(accounts);

/////////////////////////////////////////////////

// Event handlers
let currentAccount

function updateUi(acc) {
    // Display Movements
    displayMovements(acc.movements)
    // Display Balance
    calcPrintBalance(acc)
    // Display Summary
    calcDisplaySummary(acc)
}

btnLogin.addEventListener('click', function (e) {
    // prevent default submit event
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    // Display UI Message
    if (currentAccount?.pin === +inputLoginPin.value) {
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    }
    containerApp.style.opacity = 100;

    // Clear Input Field
    inputLoginUsername.value = inputLoginPin.value = '';
    // update Ui
    updateUi(currentAccount);
})

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiveAccount = accounts.find(acc => acc.username === inputTransferTo.value);

    inputTransferAmount.value = inputTransferTo.value = '';


    if (
        amount > 0 &&
        receiveAccount &&
        currentAccount.balance >= amount &&
        receiveAccount?.username !== currentAccount.username
    ) {
        currentAccount.movements.push(-amount);
        receiveAccount.movements.push(amount);
        updateUi(currentAccount)
    }
})

// Handle Loan Account
btnLoan.addEventListener('click', function (e) {
    e.preventDefault()
    const amount = +inputLoanAmount.value
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        currentAccount.movements.push(amount)
        updateUi(currentAccount)
    }
    inputLoanAmount.value = '';
})

// Handle close button
btnClose.addEventListener('click', function (e) {
    e.preventDefault()
    if (
        inputCloseUsername.value === currentAccount.username &&
        +inputClosePin.value === currentAccount.pin
    ) {
        const index = accounts.findIndex(account => account.username === currentAccount.username)
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';

})


