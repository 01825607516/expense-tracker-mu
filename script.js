$(document).ready(function () {
  const $balance = $("#balance");
  const $money_plus = $("#money-plus");
  const $money_minus = $("#money-minus");
  const $list = $("#list");
  const $form = $("#form");
  const $text = $("#text");
  const $amount = $("#amount");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  $form.on("submit", function (e) {
    e.preventDefault();

    if ($text.val().trim() === '' || $amount.val().trim() === '') {
      alert("Please enter both a description and an amount");
      return;
    }

    const transaction = {
      id: generateID(),
      text: $text.val(),
      amount: +$amount.val()
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    $text.val('');
    $amount.val('');
  });

  function generateID() {
    return Math.floor(Math.random() * 1000000);
  }

  function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const $item = $("<li></li>")
      .addClass(transaction.amount < 0 ? 'minus' : 'plus')
      .html(`
        ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" data-id="${transaction.id}">x</button>
      `);

    $list.append($item);
  }

  function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const income = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
    const expense = (
      amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1
    ).toFixed(2);

    $balance.text(`$${total}`);
    $money_plus.text(`+$${income}`);
    $money_minus.text(`-$${expense}`);
  }

  function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
  }

  function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  function init() {
    $list.html('');
    transactions.forEach(addTransactionDOM);
    updateValues();
  }

  // Delegate remove button click (since buttons are dynamically added)
  $list.on("click", ".delete-btn", function () {
    const id = parseInt($(this).data("id"));
    removeTransaction(id);
  });

  init();
});
