// =====================================
// RC STORE — SCRIPT
// =====================================

const products = [
  {
    id: 1,
    name: "T-Shirt Premium",
    price: 2500,
    category: "Mode",
    emoji: "👕",
    desc: "T-Shirt élégant et confortable pour tous les jours."
  },
  {
    id: 2,
    name: "Sac à main",
    price: 3500,
    category: "Accessoires",
    emoji: "👜",
    desc: "Sac à main moderne et pratique."
  },
  {
    id: 3,
    name: "Écouteurs Bluetooth",
    price: 5000,
    category: "Électronique",
    emoji: "🎧",
    desc: "Écouteurs sans fil avec un son de qualité."
  },
  {
    id: 4,
    name: "Parfum",
    price: 1800,
    category: "Beauté",
    emoji: "🌸",
    desc: "Un parfum agréable pour toutes les occasions."
  },
  {
    id: 5,
    name: "Montre élégante",
    price: 4200,
    category: "Accessoires",
    emoji: "⌚",
    desc: "Montre moderne avec un design élégant."
  },
  {
    id: 6,
    name: "Casquette",
    price: 3000,
    category: "Mode",
    emoji: "🧢",
    desc: "Casquette confortable pour compléter votre style."
  },
  {
    id: 7,
    name: "Enceinte Bluetooth",
    price: 6500,
    category: "Électronique",
    emoji: "🔊",
    desc: "Profitez de votre musique avec un son puissant."
  },
  {
    id: 8,
    name: "Lunettes de soleil",
    price: 2200,
    category: "Accessoires",
    emoji: "🕶️",
    desc: "Lunettes élégantes pour votre look quotidien."
  }
];

// =====================================
// VARIABLES
// =====================================

let cart = JSON.parse(localStorage.getItem("rc_cart") || "[]");
let currentCategory = "Tous";

// =====================================
// PRIX
// =====================================

function money(number) {
  return new Intl.NumberFormat("fr-FR").format(Number(number) || 0) + " HTG";
}

// =====================================
// PANIER
// =====================================

function getCartTotal() {
  return cart.reduce(function(total, item) {
    return total + Number(item.price) * Number(item.qty);
  }, 0);
}

function getCartQuantity() {
  return cart.reduce(function(total, item) {
    return total + Number(item.qty);
  }, 0);
}

function saveCart() {
  localStorage.setItem("rc_cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const product = products.find(function(item) {
    return item.id === id;
  });

  if (!product) return;

  const existing = cart.find(function(item) {
    return item.id === id;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      qty: 1
    });
  }

  saveCart();
  toast("Produit ajouté au panier 🛒");
}

function changeQty(id, amount) {
  const item = cart.find(function(product) {
    return product.id === id;
  });

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(function(product) {
      return product.id !== id;
    });
  }

  saveCart();
}

function removeItem(id) {
  cart = cart.filter(function(item) {
    return item.id !== id;
  });

  saveCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (cartCount) {
    cartCount.textContent = getCartQuantity();
  }

  if (cartTotal) {
    cartTotal.textContent = money(getCartTotal());
  }

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        Votre panier est vide.
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(function(item) {
    return `
      <div class="cart-item">

        <div class="cart-item-icon">
          ${item.emoji}
        </div>

        <div class="cart-item-info">

          <strong>${item.name}</strong>

          <span>${money(item.price)}</span>

          <div class="qty-controls">

            <button onclick="changeQty(${item.id}, -1)">
              −
            </button>

            <strong>${item.qty}</strong>

            <button onclick="changeQty(${item.id}, 1)">
              +
            </button>

          </div>

        </div>

        <button
          class="remove-item"
          onclick="removeItem(${item.id})"
        >
          ×
        </button>

      </div>
    `;
  }).join("");
}

// =====================================
// PRODUITS
// =====================================

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const resultCount = document.getElementById("resultCount");
  const searchInput = document.getElementById("searchInput");

  if (!grid) return;

  const search = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const filteredProducts = products.filter(function(product) {

    const categoryOK =
      currentCategory === "Tous" ||
      product.category === currentCategory;

    const searchOK =
      search === "" ||
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.desc.toLowerCase().includes(search);

    return categoryOK && searchOK;
  });

  if (resultCount) {
    resultCount.textContent =
      filteredProducts.length +
      " produit" +
      (filteredProducts.length > 1 ? "s" : "");
  }

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-products">
        Aucun produit trouvé.
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredProducts.map(function(product) {
    return `
      <article class="product-card">

        <button
          class="product-image"
          onclick="openProduct(${product.id})"
        >
          <span>${product.emoji}</span>
        </button>

        <div class="product-content">

          <small>${product.category}</small>

          <h3>${product.name}</h3>

          <p>${product.desc}</p>

          <div class="product-bottom">

            <strong>
              ${money(product.price)}
            </strong>

            <button
              class="primary"
              onclick="addToCart(${product.id})"
            >
              Ajouter
            </button>

          </div>

        </div>

      </article>
    `;
  }).join("");
}

// =====================================
// DETAIL PRODUIT
// =====================================

function openProduct(id) {
  const product = products.find(function(item) {
    return item.id === id;
  });

  const detail = document.getElementById("productDetail");

  if (!product || !detail) return;

  detail.innerHTML = `
    <div class="product-detail">

      <div class="detail-image">
        ${product.emoji}
      </div>

      <div>

        <small>${product.category}</small>

        <h2>${product.name}</h2>

        <h3>${money(product.price)}</h3>

        <p>${product.desc}</p>

        <button
          class="primary full"
          onclick="addToCart(${product.id}); closeModals();"
        >
          Ajouter au panier
        </button>

      </div>

    </div>
  `;

  document.getElementById("productModal")
    .classList.remove("hidden");

  document.getElementById("overlay")
    .classList.remove("hidden");
}

// =====================================
// OUVRIR PANIER
// =====================================

function openCart() {
  document.getElementById("cartDrawer")
    .classList.add("open");

  document.getElementById("overlay")
    .classList.remove("hidden");
}

// =====================================
// FERMER
// =====================================

function closeModals() {

  document.querySelectorAll(".modal").forEach(function(modal) {
    modal.classList.add("hidden");
  });

  const drawer = document.getElementById("cartDrawer");

  if (drawer) {
    drawer.classList.remove("open");
  }

  const overlay = document.getElementById("overlay");

  if (overlay) {
    overlay.classList.add("hidden");
  }
}

// =====================================
// CHECKOUT
// =====================================

function openCheckout() {

  if (cart.length === 0) {
    toast("Votre panier est vide.");
    return;
  }

  const summary =
    document.getElementById("checkoutSummary");

  if (summary) {

    summary.innerHTML = `
      <div class="checkout-summary">

        ${cart.map(function(item) {
          return `
            <div class="summary-item">

              <span>
                ${item.emoji}
                ${item.name} × ${item.qty}
              </span>

              <strong>
                ${money(item.price * item.qty)}
              </strong>

            </div>
          `;
        }).join("")}

        <div class="summary-total">

          <span>Total</span>

          <strong>
            ${money(getCartTotal())}
          </strong>

        </div>

      </div>
    `;
  }

  closeModals();

  document.getElementById("checkoutModal")
    .classList.remove("hidden");

  document.getElementById("overlay")
    .classList.remove("hidden");
}

// =====================================
// NATCASH
// =====================================

function updatePaymentInfo() {

  const payment =
    document.getElementById("paymentSelect");

  const paymentInfo =
    document.getElementById("natcashPaymentInfo");

  const proof =
    document.getElementById("paymentProof");

  if (!payment || !paymentInfo) return;

  if (payment.value === "NatCash") {

    paymentInfo.style.display = "block";

    if (proof) {
      proof.required = true;
    }

  } else {

    paymentInfo.style.display = "none";

    if (proof) {
      proof.required = false;
    }
  }
}

// =====================================
// COMMUNES
// =====================================

function setupDeliveryFields() {

  const communeSelect =
    document.getElementById("communeSelect");

  if (!communeSelect) return;

  const communes = [
    "Arcahaie",
    "Cabaret",
    "Port-au-Prince",
    "Delmas",
    "Pétion-Ville",
    "Carrefour",
    "Gressier",
    "Léogâne",
    "Croix-des-Bouquets",
    "Tabarre",
    "Cité Soleil",
    "Kenscoff"
  ];

  communeSelect.innerHTML = `
    <option value="">
      Choisir une commune
    </option>
  `;

  communes.forEach(function(commune) {

    const option =
      document.createElement("option");

    option.value = commune;
    option.textContent = commune;

    communeSelect.appendChild(option);
  });
}

// =====================================
// MESSAGE
// =====================================

function toast(message) {

  const element =
    document.getElementById("toast");

  if (!element) {
    alert(message);
    return;
  }

  element.textContent = message;
  element.classList.add("show");

  setTimeout(function() {
    element.classList.remove("show");
  }, 2500);
}

// =====================================
// RECHERCHE
// =====================================

function setupSearch() {

  const input =
    document.getElementById("searchInput");

  const button =
    document.getElementById("searchBtn");

  if (input) {
    input.addEventListener("input", renderProducts);
  }

  if (button) {
    button.addEventListener("click", renderProducts);
  }
}

// =====================================
// CATEGORIES
// =====================================

function setupCategories() {

  document.querySelectorAll(".nav-link")
    .forEach(function(button) {

      button.addEventListener("click", function() {

        document.querySelectorAll(".nav-link")
          .forEach(function(btn) {
            btn.classList.remove("active");
          });

        button.classList.add("active");

        currentCategory =
          button.dataset.category || "Tous";

        renderProducts();
      });
    });
}

// =====================================
// EVENEMENTS
// =====================================

function setupEvents() {

  const cartBtn =
    document.getElementById("cartBtn");

  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  const checkoutBtn =
    document.getElementById("checkoutBtn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", openCheckout);
  }

  const overlay =
    document.getElementById("overlay");

  if (overlay) {
    overlay.addEventListener("click", closeModals);
  }

  const payment =
    document.getElementById("paymentSelect");

  if (payment) {
    payment.addEventListener(
      "change",
      updatePaymentInfo
    );
  }

  document.querySelectorAll("[data-close]")
    .forEach(function(button) {

      button.addEventListener(
        "click",
        closeModals
      );

    });
}

// =====================================
// FORMULAIRE
// =====================================

function setupOrderForm() {

  const form =
    document.getElementById("orderForm");

  if (!form) return;

  form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (cart.length === 0) {
      toast("Votre panier est vide.");
      return;
    }

    const formData =
      new FormData(form);

    const name =
      formData.get("name");

    const phone =
      formData.get("phone");

    const commune =
      formData.get("commune");

    const area =
      formData.get("area");

    const landmark =
      formData.get("landmark");

    const payment =
      formData.get("payment");

    if (
      !name ||
      !phone ||
      !commune ||
      !area ||
      !landmark ||
      !payment
    ) {
      toast("Veuillez remplir tous les champs.");
      return;
    }

    if (
      payment === "NatCash" &&
      !formData.get("paymentProof")?.name
    ) {
      toast("Ajoutez votre preuve NatCash.");
      return;
    }

    const orderNumber =
      "RC-" +
      Date.now().toString().slice(-8);

    alert(
      "Commande enregistrée !\n\n" +
      "Numéro : " +
      orderNumber +
      "\n\n" +
      "Total : " +
      money(getCartTotal()) +
      "\n\n" +
      "RC STORE vous contactera pour confirmer la commande."
    );

    cart = [];

    saveCart();

    form.reset();

    updatePaymentInfo();

    closeModals();
  });
}

// =====================================
// DEMARRAGE
// =====================================

document.addEventListener("DOMContentLoaded", function() {

  renderProducts();

  renderCart();

  setupSearch();

  setupCategories();

  setupEvents();

  setupDeliveryFields();

  setupOrderForm();

  updatePaymentInfo();

});
