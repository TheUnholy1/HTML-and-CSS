let selectedItems = {}; // Object to store selected items and quantities

function buy(item, price) {
  const quantityInput = document.getElementById(`quantity-${item}`);
  const quantity = parseInt(quantityInput.value);
  const stockElement = document.getElementById(`stock-${item}`);
  let stock = parseInt(stockElement.textContent);

  if (quantity > 0 && quantity <= stock) {
    // Update selectedItems object with the selected item and quantity
    if (selectedItems[item]) {
      selectedItems[item] += quantity;
    } else {
      selectedItems[item] = quantity;
    }

    // Update summary
    updateSummary();

    // Calculate total amount
    const totalAmountElement = document.getElementById("total-amount");
    let currentTotalAmount = parseFloat(totalAmountElement.textContent);
    currentTotalAmount += quantity * price;
    totalAmountElement.textContent = currentTotalAmount.toFixed(2);

    // Update stock
    stock -= quantity;
    stockElement.textContent = stock;

    // Reset quantity input
    quantityInput.value = 0;

    alert(`You bought ${quantity} of ${item} at ${price} PHP each!`);
  } else {
    alert(`Invalid quantity. Please enter a valid amount.`);
  }
}

function restock(item) {
  const stockElement = document.getElementById(`stock-${item}`);
  let stock = parseInt(stockElement.textContent);

  // Restock 10 units
  const restockQuantity = 10;
  stock += restockQuantity;
  stockElement.textContent = stock;

  alert(`Restocked ${restockQuantity} of ${item}`);
}

function updateSummary() {
  const summaryList = document.getElementById("selected-items");
  summaryList.innerHTML = ""; // Clear previous items

  for (const item in selectedItems) {
    const quantity = selectedItems[item];
    const listItem = document.createElement("li");
    listItem.textContent = `${item}: ${quantity} `;

    // Create a remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeItem(item, itemPrices[item]);
    listItem.appendChild(removeButton);

    summaryList.appendChild(listItem);
  }
}

function calculateChange() {
  let originalTotalAmount = parseFloat(
    document.getElementById("total-amount").textContent
  );
  let totalAmount = originalTotalAmount; // Initialize totalAmount with the original total amount

  // Apply discount if any
  const discount30 = document.getElementById("discount30").checked;
  const discount20 = document.getElementById("discount20").checked;
  const discount10 = document.getElementById("discount10").checked;
  const discountNone = document.getElementById("discountNone").checked;

  if (discount30) {
    totalAmount *= 0.7; // Apply 30% discount
  } else if (discount20) {
    totalAmount *= 0.8; // Apply 20% discount
  } else if (discount10) {
    totalAmount *= 0.9; // Apply 10% discount
  } else if (discountNone) {
    // No discount applied, keep totalAmount as is
  }

  const amountGiven = parseFloat(document.getElementById("amount-given").value);

  if (amountGiven < totalAmount) {
    alert("Insufficient funds! Please add more money.");
    document.getElementById("change").textContent = "Insufficient funds";
  } else {
    const change = amountGiven - totalAmount;
    document.getElementById("change").textContent = change.toFixed(2);

    // Display original and discounted total amounts
    document.getElementById("original-total-amount").textContent =
      originalTotalAmount.toFixed(2);
    document.getElementById("discounted-total-amount").textContent =
      totalAmount.toFixed(2);
  }
}
document.addEventListener("DOMContentLoaded", function() {
  // Add event listeners to radio buttons
  const discountRadioButtons = document.querySelectorAll('input[name="discount"]');
  discountRadioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function() {
      updateDiscountStatus();
      calculateChange(); // Recalculate change when discount changes
    });
  });
});

function updateDiscountStatus() {
  const discountStatus = document.getElementById('discount-status');
  const discount30 = document.getElementById('discount30').checked;
  const discount20 = document.getElementById('discount20').checked;
  const discount10 = document.getElementById('discount10').checked;
  const discountNone = document.getElementById('discountNone').checked;

  if (discount30) {
    discountStatus.textContent = "Discount: 30%";
  } else if (discount20) {
    discountStatus.textContent = "Discount: 20%";
  } else if (discount10) {
    discountStatus.textContent = "Discount: 10%";
  } else if (discountNone) {
    discountStatus.textContent = "No Discount";
  }
}


function confirmClose() {
  const confirmMessage = "Are you done shopping?";
  if (confirm(confirmMessage)) {
    alert("Thank you for shopping!");
    window.close(); // Close the window
  } else {
    alert("Continue shopping!");
  }
}

function removeItem(item, price) {
  if (selectedItems[item]) {
    const quantity = selectedItems[item];

    // Update total amount
    const totalAmountElement = document.getElementById("total-amount");
    let currentTotalAmount = parseFloat(totalAmountElement.textContent);
    currentTotalAmount -= quantity * price;
    totalAmountElement.textContent = currentTotalAmount.toFixed(2);

    // Update stock
    const stockElement = document.getElementById(`stock-${item}`);
    let stock = parseInt(stockElement.textContent);
    stock += quantity;
    stockElement.textContent = stock;

    // Remove item from selectedItems
    delete selectedItems[item];

    // Update summary
    updateSummary();

    alert(`Removed ${quantity} of ${item} from the cart!`);
  } else {
    alert(`Item not in cart.`);
  }
}

const itemPrices = {
  jeans1: 700,
  jeans2: 650,
  jeans3: 750,
  jeans4: 680,
  tshirt1: 300,
  tshirt2: 350,
  tshirt3: 450,
  tshirt4: 320,
  perfume1: 1200,
  perfume2: 950,
  perfume3: 800,
  perfume4: 600,
  sando1: 150,
  sando2: 180,
  sando3: 200,
  sando4: 220,
  toy1: 250,
  toy2: 350,
  toy3: 800,
  toy4: 600,
};

// Adding stocks from new window
function openAddStocksPage() {
  window.location.href = `stock_manager.html`;
}

function addStockToMainPage(itemName, quantity) {
  const stockList = document.getElementById("stockList");
  const existingStock = document.getElementById(itemName);

  if (existingStock) {
    const currentQuantity = parseInt(existingStock.dataset.quantity);
    const newQuantity = currentQuantity + quantity;
    existingStock.dataset.quantity = newQuantity;
    existingStock.textContent = `Item: ${itemName}, Quantity: ${newQuantity}`;
  } else {
    const newStock = document.createElement("div");
    newStock.id = itemName;
    newStock.dataset.quantity = quantity;
    newStock.textContent = `Item: ${itemName}, Quantity: ${quantity}`;
    stockList.appendChild(newStock);
  }
}

// Load stock from localStorage if available
function loadStockFromStorage() {
  const itemName = localStorage.getItem("itemName");
  const quantity = localStorage.getItem("quantity");
  if (itemName && quantity) {
    addStockToMainPage(itemName, parseInt(quantity));
    localStorage.removeItem("itemName");
    localStorage.removeItem("quantity");
  }
}

window.onload = loadStockFromStorage;

// Update stock quantities based on URL parameters
function getUrlParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = parseInt(value); // Convert values to integers
  }
  return params;
}

function updateStockQuantities() {
  const queryParams = getUrlParams();
  const jeansQuantity = queryParams.jeans || 0;
  const tshirtQuantity = queryParams.tshirt || 0;
  // Retrieve more quantities for other items as needed

  // Update stock quantities in the HTML
  document.getElementById("jeansQuantity").textContent = jeansQuantity;
  document.getElementById("tshirtQuantity").textContent = tshirtQuantity;
  // Update more stock quantities for other items as needed
}

updateStockQuantities();
//
