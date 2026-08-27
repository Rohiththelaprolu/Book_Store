document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setActiveNav();
  document.querySelectorAll("form[data-demo-form]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const msg = form.querySelector(".form-result");
      if (msg) {
        msg.textContent = "Submitted successfully! This demo form does not send data to a server.";
        msg.className = "form-result success-message";
      }
      form.reset();
    });
  });
});

function getCart() {
  try { return JSON.parse(localStorage.getItem("bookhiveCart")) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem("bookhiveCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}

function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach(a => {
    if (a.dataset.page === page) a.classList.add("active");
  });
}
