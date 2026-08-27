function renderBooks(list, container = document.getElementById("books-container")) {
  if (!container) return;
  if (!list.length) {
    container.innerHTML = `<p class="no-results">No books found. Try another search or category.</p>`;
    return;
  }
  container.innerHTML = list.map(book => `
    <article class="book-card" data-category="${book.category}">
      <img src="${book.image}" alt="${book.title} book cover" loading="lazy">
      <div class="book-card-body">
        <h3>${book.title}</h3>
        <p class="author">${book.author}</p>
        <p class="rating">⭐ ${book.rating} (${book.reviews.toLocaleString('en-IN')} reviews)</p>
        <p class="price">${formatPrice(book.price)}</p>
        <div class="card-actions">
          <a class="btn-secondary" href="book.html?id=${book.id}">View</a>
          <button class="btn add-to-cart" data-id="${book.id}">Add</button>
        </div>
      </div>
    </article>`).join("");
}

function applyFilters() {
  const query = (document.getElementById("search-input")?.value || "").trim().toLowerCase();
  const category = document.getElementById("category-filter")?.value || "all";
  const sort = document.getElementById("sort")?.value || "default";

  let filtered = books.filter(book => {
    const matchesText = [book.title, book.author, book.category].some(v => v.toLowerCase().includes(query));
    const matchesCategory = category === "all" || book.category === category;
    return matchesText && matchesCategory;
  });

  if (sort === "price-low") filtered.sort((a,b) => a.price-b.price);
  if (sort === "price-high") filtered.sort((a,b) => b.price-a.price);
  if (sort === "rating") filtered.sort((a,b) => b.rating-a.rating);

  renderBooks(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("books-container")) return;
  renderBooks(books);
  ["search-input","category-filter","sort"].forEach(id => {
    document.getElementById(id)?.addEventListener(id === "search-input" ? "input" : "change", applyFilters);
  });
});

document.addEventListener("click", e => {
  const btn = e.target.closest(".add-to-cart");
  if (btn) addToCart(Number(btn.dataset.id));
});
