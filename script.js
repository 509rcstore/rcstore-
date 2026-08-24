const products = [
  {
    id: 1,
    name: "Produit exemple 1",
    price: 2500,
    category: "Mode",
    emoji: "👕",
    desc: "Ajoutez ici les détails du produit lorsque vous l'aurez en stock."
  },
  {
    id: 2,
    name: "Produit exemple 2",
    price: 3500,
    category: "Accessoires",
    emoji: "👜",
    desc: "Un espace prêt à recevoir votre photo, description et caractéristiques."
  },
  {
    id: 3,
    name: "Produit exemple 3",
    price: 5000,
    category: "Électronique",
    emoji: "🎧",
    desc: "Remplacez cet exemple par votre véritable produit."
  },
  {
    id: 4,
    name: "Produit exemple 4",
    price: 1800,
    category: "Beauté",
    emoji: "✨",
    desc: "Les produits définitifs pourront être ajoutés plus tard."
  },
  {
    id: 5,
    name: "Produit exemple 5",
    price: 4200,
    category: "Maison",
    emoji: "🏠",
    desc: "Votre catalogue peut être agrandi sans refaire toute la boutique."
  },
  {
    id: 6,
    name: "Produit exemple 6",
    price: 3000,
    category: "Mode",
    emoji: "👟",
    desc: "Photo, prix et informations seront affichés ici."
  },
  {
    id: 7,
    name: "Produit exemple 7",
    price: 6500,
    category: "Électronique",
    emoji: "⌚",
    desc: "Fiche produit prête pour votre futur catalogue."
  },
  {
    id: 8,
    name: "Produit exemple 8",
    price: 2200,
    category: "Accessoires",
    emoji: "🕶️",
    desc: "Ajoutez vos articles au fur et à mesure."
  }
];

const zones = [
  "Arcahaie",
  "Saint-Medard",
  "Belle Fraîcheur",
  "Cortade",
  "Bourg",
  "Bas Cortade",
  "Boulard",
  "Merotte",
  "Corail",
  "Pont-Callebasse",
  "Carefour Poy",
  "Pierre Michel",
  "Robert Vigner",
  "Thoman",
  "Poy la Ravine",
  "Barrière Poy",
  "Hostin",
  "Ponce",
  "Labarre",
  "Pont Matheux",
  "Saint-Ard",
  "Brois Brûlé",
  "Digue Matheux",
  "Digue Broby"
];

let cart = JSON.parse(localStorage.getItem("rc_cart") || "[]");
let currentCategory = "Tous";

const $ = id => document.getElementById(id);

function money(number) {
  return new Intl.NumberFormat("fr-FR").format(number) + " HTG";
}

function saveCart() {
  localStorage.setItem("rc_cart", JSON.stringify(cart));
  renderCart();
}

function renderProducts() {
  const search = $("searchInput").value.toLowerCase().trim();

  const list = products.filter(product =>
    (currentCategory === "Tous" ||
      product.category === currentCategory) &&
    (!search ||
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search))
  );

  $("resultCount").textContent = list.length + " produit(s)";

  $("productGrid").innerHTML = list.map(product => `
    <article class="product" onclick="openProduct(${product.id})">
      <div class="product-img">${product.emoji}</div>

      <div class="product-info">
        <div class="category">${product.category}</div>

        <h3>${product.name}</h3>

        <div class="price">
          ${money(product.price)}
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }

  saveCart();

  toast("Produit ajouté au panier");
}

function changeQty(id, difference) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.qty += difference;

  if (item.qty <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
}

function removeItem(id) {
  cart = cart.filter(product => product.id !== id);
  saveCart();
}

function renderCart() {
  const quantity = cart.reduce(
    (total, item) => total + item.qty,
    0
  );

  $("cartCount").textContent = quantity;

  if (!cart.length) {
    $("cartItems").innerHTML =
      "<p>Votre panier est vide.</p>";

    $("cartTotal").textContent = "0 HTG";
    return;
  }

  $("cartItems").innerHTML = cart.map(item => `
    <div class="cart-row">

      <div class="cart-thumb">
        ${item.emoji}
      </div>

      <div style="flex:1">

        <h4>${item.name}</h4>

        <strong>
          ${money(item.price)}
        </strong>

        <div class="qty">

          <button onclick="changeQty(${item.id}, -1)">
            −
          </button>

          <span>${item.qty}</span>

          <button onclick="changeQty(${item.id}, 1)">
            +
          </button>

          <button onclick="removeItem(${item.id})">
            🗑️
          </button>

        </div>

      </div>

    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  $("cartTotal").textContent = money(total);
}

function openProduct(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  $("productDetail").innerHTML = `
    <div class="detail">

      <div class="detail-img">
        ${product.emoji}
      </div>

      <div>

        <div class="category">
          ${product.category}
        </div>

        <h2>${product.name}</h2>

        <div class="big-price">
          ${money(product.price)}
        </div>

        <p>
          ${product.desc}
        </p>

        <p>
          <strong>🚚 Livraison :</strong>
          environ 1 à 2 jours selon la zone.
        </p>

        <button
          class="primary"
          onclick="addToCart(${product.id}); closeModals()">

          Ajouter au panier

        </button>

      </div>

    </div>
  `;

  $("productModal").classList.remove("hidden");
  $("overlay").classList.remove("hidden");
}

function openCart() {
  $("cartDrawer").classList.add("open");
  $("overlay").classList.remove("hidden");
}

function closeModals() {
  document
    .querySelectorAll(".modal")
    .forEach(modal => modal.classList.add("hidden"));

  $("cartDrawer").classList.remove("open");

  $("overlay").classList.add("hidden");
}

function toast(message) {
  $("toast").textContent = message;

  $("toast").classList.add("show");

  setTimeout(() => {
    $("toast").classList.remove("show");
  }, 1800);
}

$("cartBtn").onclick = openCart;

$("overlay").onclick = closeModals;

document
  .querySelectorAll("[data-close]")
  .forEach(button => {
    button.onclick = closeModals;
  });

$("searchInput").oninput = renderProducts;

$("searchBtn").onclick = renderProducts;

document
  .querySelectorAll(".nav-link")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(".nav-link")
        .forEach(item =>
          item.classList.remove("active")
        );

      button.classList.add("active");

      currentCategory = button.dataset.category;

      renderProducts();
    };

  });

$("checkoutBtn").onclick = () => {

  if (!cart.length) {
    toast("Votre panier est vide");
    return;
  }

  $("cartDrawer").classList.remove("open");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const quantity = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  $("checkoutSummary").innerHTML = `
    <div class="delivery-box">

      <strong>
        ${quantity} article(s) —
        ${money(total)}
      </strong>

      <span>
        🚚 Livraison estimée :
       
