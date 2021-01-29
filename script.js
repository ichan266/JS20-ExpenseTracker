const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
//* localStorage.getItem is a stringify array so we need to parse it into an array by using JSON.parse


let transactions = localStorage.getItem('transactions') !== null ? 
localStorageTransactions : [];
//* We first check to see if there is anything stored in local storage for transaction by using localStorage.getItem('transactions'); !== null means there is data stored in it. 
//* `?` is equivalent to `if`. So if True, we want to use localStorageTransaction. 
//* `:` means else. So if there are no transactions stored in localStorage, then we want to start and empty array, []
//* To see anything in localStorage, we can go to Application in the developer tool

// Add transactions
function addTransaction(evt) {
  evt.preventDefault();

  if(text.value.trim() === '' || amount.value.trim() === '') { //* check to make sure there are text and amount entered //
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value //* Note: amount entered is a string. We need to convert it back to number by adding + in front
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+'; 
  //* `?` is a turn arrow (?), a shorthand for if statement. 
  //* `:` means else. So it means if transaction.amount is less then 0, add minus sign; otherwise, add plus sign

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span><button class = "delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `; 
  //* Math.abs will turn numbers to absolute -> any negative numbers will become positive
  //* onclick is an inline event listener, and we call the fxn, removeTransaction, right inside it

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transactions => transactions.amount);
    //* transactions is an object (like dictionary in Python). 
    //* transactions.map will loop through transactions and put that into an array
  
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
                  .filter(item => item > 0)
                  .reduce((acc, item) => (acc += item), 0)
                  .toFixed(2);

  console.log(`income = ${income}`);

  const expense = (amounts
                    .filter(item => item < 0)
                    .reduce((acc, item) => (acc += item), 0) * -1)
                    .toFixed(2);

  console.log(`expense = ${expense}`);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`
  money_minus.innerText = `$${expense}`
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions)); //* Turn the array into a string
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction)