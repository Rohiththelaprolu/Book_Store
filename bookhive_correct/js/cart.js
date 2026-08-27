function addToCart(bookId, quantity = 1) {
  const book = getBookById(bookId);
  if (!book) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === book.id);
  if (existing) existing.quantity += quantity;
  else cart.push({id: book.id, quantity});
  saveCart(cart);
  showCartNotice(`${book.title} added to cart.`);
}

function changeQuantity(bookId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === Number(bookId));
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    const next = cart.filter(i => i.id !== Number(bookId));
    saveCart(next);
  } else saveCart(cart);
  renderCart();
}

function removeFromCart(bookId) {
  saveCart(getCart().filter(i => i.id !== Number(bookId)));
  renderCart();
}

function showCartNotice(text) {
  const el = document.getElementById("cart-notice");
  if (el) { el.textContent = text; el.hidden = false; setTimeout(() => el.hidden = true, 1800); }
}

function renderCart() {
  const tbody = document.getElementById("cart-items");
  const empty = document.getElementById("empty-cart");
  const wrap = document.getElementById("cart-content");
  if (!tbody) return;

  const cart = getCart();
  tbody.innerHTML = "";

  if (!cart.length) {
    if (empty) empty.hidden = false;
    if (wrap) wrap.hidden = true;
    document.getElementById("cart-total")?.replaceChildren(document.createTextNode("₹0"));
    return;
  }

  if (empty) empty.hidden = true;
  if (wrap) wrap.hidden = false;

  let total = 0;
  cart.forEach(item => {
    const book = getBookById(item.id);
    if (!book) return;
    const subtotal = book.price * item.quantity;
    total += subtotal;
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td><div class="cart-book"><img src="${book.image}" alt="${book.title}"><span>${book.title}</span></div></td>
        <td>${formatPrice(book.price)}</td>
        <td><div class="qty-controls">
          <button aria-label="Decrease quantity" data-action="decrease" data-id="${book.id}">−</button>
          <strong>${item.quantity}</strong>
          <button aria-label="Increase quantity" data-action="increase" data-id="${book.id}">+</button>
        </div></td>
        <td>${formatPrice(subtotal)}</td>
        <td><button class="btn-danger" data-action="remove" data-id="${book.id}">Remove</button></td>
      </tr>`);
  });
  document.getElementById("cart-total").textContent = formatPrice(total);
}

document.addEventListener("click", e => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "increase") changeQuantity(id, 1);
  if (btn.dataset.action === "decrease") changeQuantity(id, -1);
  if (btn.dataset.action === "remove") removeFromCart(id);
});

document.addEventListener("DOMContentLoaded", renderCart);
