document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".item-checkbox");
  const totalDisplay = document.getElementById("total");
  const changeDisplay = document.getElementById("change");
  let total = 0;

  checkboxes.forEach((checkbox) => {
    // Retrieve the default quantity from the data-default-quantity attribute
    const defaultQuantity = parseInt(checkbox.dataset.defaultQuantity) || 1;

    // Set the default input value
    const quantityInput = checkbox
      .closest(".menu-item")
      .querySelector(".quantity-input");
    quantityInput.value = defaultQuantity;

    // Add event listeners for checkbox change and stock buttons as before...
    checkbox.addEventListener("change", function () {
      const item = checkbox.closest(".menu-item");
      const itemName = item.querySelector("h3").innerText;
      const itemPrice = parseFloat(item.querySelector("p").innerText);
      const quantity = parseInt(quantityInput.value);

      if (checkbox.checked) {
        const totalItemPrice = itemPrice * quantity;
        total += totalItemPrice;

        const listItem = document.createElement("li");
        listItem.innerText = `${itemName} - ₱${totalItemPrice.toFixed(
          2
        )} (Quantity: ${quantity})`;
        listItem.dataset.itemName = itemName;
        receiptList.appendChild(listItem);
      } else {
        const totalItemPrice = itemPrice * quantity;
        total -= totalItemPrice;

        const items = receiptList.querySelectorAll("li");
        items.forEach((li) => {
          if (li.dataset.itemName === itemName) {
            receiptList.removeChild(li);
          }
        });
      }

      totalDisplay.textContent = `Total: ₱${total.toFixed(2)}`;
    });

    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.classList.add("stock-button");
    addButton.addEventListener("click", function () {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    checkbox.parentNode.appendChild(addButton);

    const deductButton = document.createElement("button");
    deductButton.textContent = "-";
    deductButton.classList.add("stock-button");
    deductButton.addEventListener("click", function () {
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });
    checkbox.parentNode.appendChild(deductButton);

    const stockLabel = document.createElement("label");
    stockLabel.textContent = "STOCK QUANTITY";
    checkbox.parentNode.appendChild(stockLabel);
  });

  const receiptList = document.querySelector(".receipt-list");

  const calculateChangeButton = document.getElementById(
    "calculate-change-button"
  );
  calculateChangeButton.addEventListener("click", calculateChange);

  function calculateChange() {
    const moneyInput = document.getElementById("money");
    const money = parseFloat(moneyInput.value);
    const change = money - total;
    changeDisplay.textContent = `Change: ₱${change.toFixed(2)}`;
  }
});
