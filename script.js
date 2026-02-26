const PRODUCTS = [
  {
    id: "phone-1",
    category: "Smartphones",
    name: "Nexus Nova X",
    description: "Flagship smartphone with AI-enhanced photography and all-day battery.",
    price: 999,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
    specs: { RAM: "12GB", Storage: "256GB", Display: "6.7\" OLED", RefreshRate: "144Hz", Battery: "5200mAh" },
    bestFor: "Professionals, creators, and power users"
  },
  {
    id: "console-1",
    category: "Gaming consoles",
    name: "Nexus PlayCore Z",
    description: "Next-gen gaming console with ray tracing and quick resume.",
    price: 649,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    specs: { RAM: "16GB", Storage: "1TB SSD", Display: "4K UHD", RefreshRate: "120Hz", Battery: "N/A" },
    bestFor: "Gamers and home entertainment enthusiasts"
  },
  {
    id: "monitor-1",
    category: "Monitors",
    name: "Nexus Vision 32",
    description: "32-inch color-accurate monitor with smooth high refresh panel.",
    price: 579,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    specs: { RAM: "N/A", Storage: "N/A", Display: "32\" IPS", RefreshRate: "165Hz", Battery: "N/A" },
    bestFor: "Content creators, developers, and multitaskers"
  },
  {
    id: "laptop-1",
    category: "Gaming laptops",
    name: "Nexus Blade 16",
    description: "Portable gaming laptop with desktop-level GPU performance.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80",
    specs: { RAM: "32GB", Storage: "2TB SSD", Display: "16\" Mini-LED", RefreshRate: "240Hz", Battery: "99Wh" },
    bestFor: "Competitive gamers and streamers"
  },
  {
    id: "mouse-1",
    category: "Computer mice",
    name: "Nexus Glide Pro",
    description: "Ergonomic wireless mouse tuned for speed and precision.",
    price: 129,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    specs: { RAM: "N/A", Storage: "N/A", Display: "N/A", RefreshRate: "1000Hz Polling", Battery: "70 hours" },
    bestFor: "Designers, office professionals, and gamers"
  },
  {
    id: "keyboard-1",
    category: "Keyboards",
    name: "Nexus KeyFlow 75",
    description: "Compact mechanical keyboard with premium gasket mount design.",
    price: 169,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
    specs: { RAM: "N/A", Storage: "N/A", Display: "N/A", RefreshRate: "N/A", Battery: "120 hours" },
    bestFor: "Students, coders, and productivity-focused users"
  }
];

const FAQ_RESPONSES = {
  shipping: "Shipping is free on orders over $75. Otherwise, standard shipping is $6.99.",
  delivery: "Standard delivery takes 3–5 business days. Express options take 1–2 days.",
  return: "Returns are accepted within 30 days for unopened items in original packaging.",
  warranty: "Most products include a 1-year warranty, and selected devices include 2 years.",
  payment: "We support Visa, Mastercard, American Express, PayPal, and Apple Pay."
};

const CART_KEY = "nexus_cart";

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelector(`[data-nav="${page}"]`)?.classList.add("active");
}

function bindMobileMenu() {
  const btn = document.querySelector(".mobile-menu-btn");
  const menu = document.querySelector(".nav-links");
  btn?.addEventListener("click", () => menu?.classList.toggle("show"));
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const cart = getCart();
  cart.push(id);
  saveCart(cart);
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll("#cartCount").forEach((el) => { el.textContent = String(count); });
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-card-content">
        <div class="product-meta">
          <span class="product-category">${p.category}</span>
          <strong>$${p.price}</strong>
        </div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <ul class="spec-list">${Object.entries(p.specs).map(([k,v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>
        <p class="best-for"><strong>Best For:</strong> ${p.bestFor}</p>
        <button class="btn btn-primary" data-add-to-cart="${p.id}">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function bindAddToCart() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.addToCart;
    if (!id) return;
    addToCart(id);
    target.textContent = "Added ✓";
    setTimeout(() => { target.textContent = "Add to Cart"; }, 1000);
  });
}

function renderCartPage() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!container || !totalEl) return;

  const items = getCart().map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  container.innerHTML = items.length ? items.map((item, idx) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <div>
        <p><strong>$${item.price}</strong></p>
        <button class="btn btn-secondary" data-remove-index="${idx}">Remove</button>
      </div>
    </article>
  `).join("") : "<p>Your cart is currently empty.</p>";

  totalEl.textContent = `$${total}`;

  container.querySelectorAll("[data-remove-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cart = getCart();
      cart.splice(Number(btn.dataset.removeIndex), 1);
      saveCart(cart);
      renderCartPage();
    });
  });

  document.getElementById("clearCart")?.addEventListener("click", () => {
    saveCart([]);
    renderCartPage();
  });
}

function renderCompareSelectors() {
  const selects = ["compareSelect1", "compareSelect2", "compareSelect3"].map((id) => document.getElementById(id)).filter(Boolean);
  if (!selects.length) return;

  for (const select of selects) {
    select.innerHTML = `<option value="">Select product</option>${PRODUCTS.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}`;
  }

  document.getElementById("runCompare")?.addEventListener("click", renderCompareTable);
}

function renderCompareTable() {
  const selectedIds = ["compareSelect1", "compareSelect2", "compareSelect3"]
    .map((id) => document.getElementById(id)?.value)
    .filter(Boolean);

  const products = selectedIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const table = document.getElementById("compareTable");
  if (!table) return;
  if (!products.length) {
    table.innerHTML = "<tr><td>Please select at least one product.</td></tr>";
    return;
  }

  const rows = ["price", "RAM", "Storage", "Display", "RefreshRate", "Battery", "bestFor"];
  table.innerHTML = `
    <tr><th>Specification</th>${products.map((p) => `<th>${p.name}</th>`).join("")}</tr>
    ${rows.map((row) => `
      <tr>
        <td>${row === "bestFor" ? "Best For" : row}</td>
        ${products.map((p) => `<td>${row === "price" ? `$${p.price}` : row === "bestFor" ? p.bestFor : p.specs[row]}</td>`).join("")}
      </tr>
    `).join("")}
  `;
}

function setupChatbot() {
  const toggle = document.querySelector(".chatbot-toggle");
  const panel = document.querySelector(".chatbot-panel");
  const input = document.getElementById("chatInput");
  const send = document.getElementById("chatSend");
  const messages = document.getElementById("chatMessages");
  if (!toggle || !panel || !input || !send || !messages) return;

  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
  });

  const respond = () => {
    const question = input.value.trim();
    if (!question) return;
    const userLine = document.createElement("p");
    userLine.className = "user-msg";
    userLine.textContent = question;

    const key = Object.keys(FAQ_RESPONSES).find((k) => question.toLowerCase().includes(k));
    const botLine = document.createElement("p");
    botLine.className = "bot-msg";
    botLine.textContent = key
      ? FAQ_RESPONSES[key]
      : "I can help with shipping costs, delivery times, returns, warranty, and payment methods.";

    messages.append(userLine, botLine);
    messages.scrollTop = messages.scrollHeight;
    input.value = "";
  };

  send.addEventListener("click", respond);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") respond();
  });
}

setActiveNav();
bindMobileMenu();
updateCartCount();
bindAddToCart();
renderProducts();
renderCompareSelectors();
renderCartPage();
setupChatbot();
