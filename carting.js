const closeBtn = document.querySelector("#close");
const sign = document.querySelector("#addcart-model");
const openBtn = document.querySelector("#buynow_btn");
const atmBtn = document.getElementById("creditBtn");
const buyPopup = document.querySelector(".creditPopup");
const cardExitBtn = document.querySelector("#exit-btn");
const buyBtn = document.querySelector("#buy__btn");
const cartContainer = document.querySelector(".contentCart");
const finalResultEl = document.querySelector(".finalResult");
const cardNameInput = document.querySelector("#name");
const cardNumberInput = document.querySelector("#number");
const cardMonthInput = document.querySelector("#month");
const cardYearInput = document.querySelector("#year");
const cardCvcInput = document.querySelector("#cvc");
let cart = JSON.parse(localStorage.getItem("Cart")) || [];
let finalAmount = 0;
if (openBtn) {
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (sign) sign.style.display = "flex";
    showCart();
  });
}
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    if (sign) sign.style.display = "none";
  });
}
document.querySelectorAll(".addToCart").forEach((btn) => {
  btn.addEventListener("click", function () {
    const product = this.closest(".product");
    if (!product) {
      return;
    }
    const id = product.getAttribute("data-id");
    const name = product.getAttribute("data-name");
    const image = product.getAttribute("data-image");
    const price = parseFloat(product.getAttribute("data-price")) || 0;

    const idx = cart.findIndex((it) => it.id === id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ id, name, image, price, quantity: 1 });

    saveCart();
    showCart();
  });
});
function saveCart() {
  localStorage.setItem("Cart", JSON.stringify(cart));
}
function showCart() {
  if (!cartContainer) return;
  if (cart.length === 0) {
    finalAmount = 0;
    cartContainer.innerHTML = `<h3>Your Cart:</h3><p>Your cart is empty.</p>`;
    return;
  }
  let subtotal = 0;
  let html = `<h3>Your Cart:</h3>
    <table border="1" cellspacing="0" cellpadding="8" style="height:30rem;width:40rem;border-collapse:collapse;border:none;">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Product Image</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>`;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    html += `<tr>
      <td>${item.name}</td>
      <td><img src="${item.image}" height="80" width="100" alt="${item.name}"></td>
      <td style="position:relative;top:-1.4rem;">
        <button class="decreaseQty" data-id="${item.id}" style="width:1.5rem;height:1.5rem;border-radius:50%;">-</button>
        <span class="qty" data-id="${item.id}">${item.quantity}</span>
        <button class="increaseQty" data-id="${item.id}" style="width:1.5rem;height:1.5rem;border-radius:50%;">+</button>
      </td>
      <td>₹${itemTotal.toFixed(2)}</td>
      <td><button class="removeItem" data-id="${item.id}" style="width:5rem;position:relative;top:-1.4rem;"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`;
  });
  html += `</tbody></table>`;
  const gst = subtotal * 0.18;
  finalAmount = subtotal + gst;
  html += `<div class="bill-section" style="margin-top:1rem;">
    <h3>Bill Details</h3>
    <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
    <p>GST (18%): ₹${gst.toFixed(2)}</p>
    <p><strong>Final Amount: ₹${finalAmount.toFixed(2)}</strong></p>
  </div>`;
  cartContainer.innerHTML = html;
}
if (cartContainer) {
  cartContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.classList.contains("removeItem")) {
      const id = btn.dataset.id;
      const idx = cart.findIndex((i) => i.id === id);
      if (idx > -1) {
        cart.splice(idx, 1);
        saveCart();
        showCart();
      }
      return;
    }
    if (btn.classList.contains("increaseQty")) {
      const id = btn.dataset.id;
      const idx = cart.findIndex((i) => i.id === id);
      if (idx > -1) {
        cart[idx].quantity += 1;
        saveCart();
        showCart();
      }
      return;
    }
    if (btn.classList.contains("decreaseQty")) {
      const id = btn.dataset.id;
      const idx = cart.findIndex((i) => i.id === id);
      if (idx > -1) {
        if (cart[idx].quantity > 1) cart[idx].quantity -= 1;
        else cart.splice(idx, 1);
        saveCart();
        showCart();
      }
      return;
    }
  });
}
if (atmBtn) {
  atmBtn.addEventListener("click", (e) => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    e.preventDefault();
    if (buyPopup) buyPopup.style.display = "flex";
    if (sign) sign.style.display = "none";
  });
}
if (cardExitBtn) {
  cardExitBtn.addEventListener("click", () => {
    if (buyPopup) buyPopup.style.display = "none";
    if (sign) sign.style.display = "flex";
    clearCardForm();
  });
}
function clearCardForm() {
  if (cardNameInput) cardNameInput.value = "";
  if (cardNumberInput) cardNumberInput.value = "";
  if (cardMonthInput) cardMonthInput.value = "";
  if (cardYearInput) cardYearInput.value = "";
  if (cardCvcInput) cardCvcInput.value = "";
  if (finalResultEl) finalResultEl.textContent = "";
}
if (buyBtn) {
buyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!cardNameInput || !cardNumberInput || !cardMonthInput || !cardYearInput || !cardCvcInput) return;
  const name = cardNameInput.value.trim();
  const number = cardNumberInput.value.trim();
  const month = cardMonthInput.value.trim();
  const year = cardYearInput.value.trim();
  const cvc = cardCvcInput.value.trim();
  if (!name || !number || !month || !year || !cvc) {
    if (finalResultEl) finalResultEl.textContent = "Please fill out all the details";
    return;
  }
  if (finalResultEl) finalResultEl.textContent = "Your order will be delivered soon! Thank you for ordering!";
  cart = [];
  saveCart();
  showCart();
  clearCardForm();
});
}
showCart();
