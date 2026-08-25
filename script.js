/* =========================================================
   RC STORE — SCRIPT COMPLET
   Version test
   ========================================================= */

const products = [
  {
    id: 1,
    name: "Produit exemple 1",
    price: 2500,
    category: "Mode",
    emoji: "👕",
    desc: "Produit de démonstration RC STORE. Vous pourrez remplacer ce produit par votre véritable article."
  },
  {
    id: 2,
    name: "Produit exemple 2",
    price: 3500,
    category: "Accessoires",
    emoji: "👜",
    desc: "Produit de démonstration prêt à être remplacé par votre futur produit."
  },
  {
    id: 3,
    name: "Produit exemple 3",
    price: 5000,
    category: "Électronique",
    emoji: "🎧",
    desc: "Produit électronique de démonstration."
  },
  {
    id: 4,
    name: "Produit exemple 4",
    price: 1800,
    category: "Beauté",
    emoji: "✨",
    desc: "Produit de démonstration de la catégorie beauté."
  },
  {
    id: 5,
    name: "Produit exemple 5",
    price: 4200,
    category: "Maison",
    emoji: "🏠",
    desc: "Produit de démonstration pour la maison."
  },
  {
    id: 6,
    name: "Produit exemple 6",
    price: 3000,
    category: "Mode",
    emoji: "👟",
    desc: "Article de mode de démonstration."
  },
  {
    id: 7,
    name: "Produit exemple 7",
    price: 6500,
    category: "Électronique",
    emoji: "⌚",
    desc: "Produit électronique de démonstration."
  },
  {
    id: 8,
    name: "Produit exemple 8",
    price: 2200,
    category: "Accessoires",
    emoji: "🕶️",
    desc: "Accessoire de démonstration."
  }
];


/* =========================================================
   ZONES DE LIVRAISON
   ========================================================= */

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


/* =========================================================
   VARIABLES
   ========================================================= */

let cart = JSON.parse(
  localStorage.getItem("rc_cart") || "[]"
);

let currentCategory = "Tous";

const $ = id => document.getElementById(id);


/* =========================================================
   FORMAT PRIX
   ========================================================= */

function money(number) {
  return (
    new Intl.NumberFormat("fr-FR").format(number) +
    " HTG"
  );
}


/* =========================================================
   SAUVEGARDER LE PANIER
   ========================================================= */

function saveCart() {
  localStorage.setItem(
    "rc_cart",
    JSON.stringify(cart)
  );

  renderCart();
}


/* =========================================================
   AFFICHER LES PRODUITS
   ========================================================= */

function renderProducts() {

  const input = $("searchInput");

  const search = input
    ? input.value.toLowerCase().trim()
    : "";

  const list = products.filter(product => {

    const categoryOK =
      currentCategory === "Tous" ||
      product.category === currentCategory;

    const searchOK =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return categoryOK && searchOK;
  });


  const resultCount = $("resultCount");

  if (resultCount) {
    resultCount.textContent =
      list.length + " produit(s)";
  }


  const grid = $("productGrid");

  if (!grid) return;


  grid.innerHTML = list.map(product => `

    <article
      class="product"
      onclick="openProduct(${product.id})"
    >

      <div class="product-img">
        ${product.emoji}
      </div>

      <div class="product-info">

        <div class="category">
          ${product.category}
        </div>

        <h3>
          ${product.name}
        </h3>

        <div class="price">
          ${money(product.price)}
        </div>

      </div>

    </article>

  `).join("");
}


/* =========================================================
   AJOUTER AU PANIER
   ========================================================= */

function addToCart(id) {

  const product =
    products.find(item => item.id === id);

  if (!product) return;


  const existing =
    cart.find(item => item.id === id);


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


/* =========================================================
   MODIFIER QUANTITÉ
   ========================================================= */

function changeQty(id, difference) {

  const item =
    cart.find(product => product.id === id);

  if (!item) return;


  item.qty += difference;


  if (item.qty <= 0) {

    cart =
      cart.filter(product => product.id !== id);

  }


  saveCart();
}


/* =========================================================
   SUPPRIMER DU PANIER
   ========================================================= */

function removeItem(id) {

  cart =
    cart.filter(product => product.id !== id);

  saveCart();

  toast("Produit supprimé");
}


/* =========================================================
   AFFICHER LE PANIER
   ========================================================= */

function renderCart() {

  const quantity =
    cart.reduce(
      (total, item) => total + item.qty,
      0
    );


  const cartCount = $("cartCount");

  if (cartCount) {
    cartCount.textContent = quantity;
  }


  const cartItems = $("cartItems");

  const cartTotal = $("cartTotal");


  if (!cartItems) return;


  if (!cart.length) {

    cartItems.innerHTML =
      "<p>Votre panier est vide.</p>";

    if (cartTotal) {
      cartTotal.textContent = "0 HTG";
    }

    return;
  }


  cartItems.innerHTML =
    cart.map(item => `

      <div class="cart-row">

        <div class="cart-thumb">
          ${item.emoji}
        </div>

        <div style="flex:1">

          <h4>
            ${item.name}
          </h4>

          <strong>
            ${money(item.price)}
          </strong>

          <div class="qty">

            <button
              onclick="changeQty(${item.id}, -1)"
            >
              −
            </button>

            <span>
              ${item.qty}
            </span>

            <button
              onclick="changeQty(${item.id}, 1)"
            >
              +
            </button>

            <button
              onclick="removeItem(${item.id})"
            >
              🗑️
            </button>

          </div>

        </div>

      </div>

    `).join("");


  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  if (cartTotal) {
    cartTotal.textContent =
      money(total);
  }
}


/* =========================================================
   DÉTAIL PRODUIT
   ========================================================= */

function openProduct(id) {

  const product =
    products.find(item => item.id === id);

  if (!product) return;


  const detail =
    $("productDetail");

  if (!detail) return;


  detail.innerHTML = `

    <div class="detail">

      <div class="detail-img">
        ${product.emoji}
      </div>

      <div>

        <div class="category">
          ${product.category}
        </div>

        <h2>
          ${product.name}
        </h2>

        <div class="big-price">
          ${money(product.price)}
        </div>

        <p>
          ${product.desc}
        </p>

        <p>
          <strong>
            🚚 Livraison :
          </strong>
          environ 1 à 2 jours selon la zone.
        </p>

        <button
          class="primary"
          onclick="
            addToCart(${product.id});
            closeModals();
          "
        >
          Ajouter au panier
        </button>

      </div>

    </div>

  `;


  const modal =
    $("productModal");

  const overlay =
    $("overlay");


  if (modal) {
    modal.classList.remove("hidden");
  }

  if (overlay) {
    overlay.classList.remove("hidden");
  }
}


/* =========================================================
   OUVRIR PANIER
   ========================================================= */

function openCart() {

  const drawer =
    $("cartDrawer");

  const overlay =
    $("overlay");


  if (drawer) {
    drawer.classList.add("open");
  }

  if (overlay) {
    overlay.classList.remove("hidden");
  }
}


/* =========================================================
   FERMER LES FENÊTRES
   ========================================================= */

function closeModals() {

  document
    .querySelectorAll(".modal")
    .forEach(modal => {

      modal.classList.add("hidden");

    });


  const drawer =
    $("cartDrawer");

  const overlay =
    $("overlay");


  if (drawer) {
    drawer.classList.remove("open");
  }

  if (overlay) {
    overlay.classList.add("hidden");
  }
}


/* =========================================================
   MESSAGE
   ========================================================= */

function toast(message) {

  const element =
    $("toast");

  if (!element) return;


  element.textContent =
    message;

  element.classList.add("show");


  setTimeout(() => {

    element.classList.remove("show");

  }, 1800);
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function startCheckout() {

  if (!cart.length) {

    toast(
      "Votre panier est vide"
    );

    return;
  }


  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  const quantity =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );


  const summary =
    $("checkoutSummary");


  if (summary) {

    summary.innerHTML = `

      <div class="delivery-box">

        <strong>
          ${quantity} article(s) —
          ${money(total)}
        </strong>

        <span>
          🚚 Livraison estimée :
          1 à 2 jours selon la zone.
        </span>

      </div>

    `;

  }


  const checkoutModal =
    $("checkoutModal");


  const drawer =
    $("cartDrawer");

  const overlay =
    $("overlay");


  if (drawer) {
    drawer.classList.remove("open");
  }


  if (checkoutModal) {

    checkoutModal.classList.remove(
      "hidden"
    );

  }


  if (overlay) {
    overlay.classList.remove("hidden");
  }


  prepareZones();
}


/* =========================================================
   PRÉPARER LES ZONES
   ========================================================= */

function prepareZones() {

  const zoneSelect =
    $("zone");

  if (!zoneSelect) return;


  zoneSelect.innerHTML = `

    <option value="">
      Sélectionnez votre zone
    </option>

    ${zones.map(zone => `
      <option value="${zone}">
        ${zone}
      </option>
    `).join("")}

  `;
}


/* =========================================================
   VALIDATION COMMANDE
   ========================================================= */

function submitOrder() {

  const name =
    $("customerName")
      ? $("customerName").value.trim()
      : "";

  const phone =
    $("customerPhone")
      ? $("customerPhone").value.trim()
      : "";

  const zone =
    $("zone")
      ? $("zone").value
      : "";


  if (!name) {

    toast(
      "Veuillez entrer votre nom"
    );

    return;
  }


  if (!phone) {

    toast(
      "Veuillez entrer votre téléphone"
    );

    return;
  }


  if (!zone) {

    toast(
      "Veuillez choisir votre zone"
    );

    return;
  }


  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  /*
    IMPORTANT :
    Ici nous préparons seulement
    la commande pour les tests.

    Aucun PIN MonCash ou NatCash
    ne doit être demandé ou enregistré.
  */


  const order = {

    id:
      "RC-" +
      Date.now(),

    customer:
      name,

    phone:
      phone,

    zone:
      zone,

    items:
      cart,

    total:
      total,

    payment:
      "À confirmer",

    date:
      new Date().toISOString()

  };


  localStorage.setItem(
    "rc_last_order",
    JSON.stringify(order)
  );


  cart = [];

  saveCart();


  closeModals();


  toast(
    "Commande enregistrée avec succès"
  );


  setTimeout(() => {

    alert(
      "Merci " +
      name +
      " !\n\n" +
      "Votre commande " +
      order.id +
      " a été enregistrée.\n\n" +
      "Total : " +
      money(total) +
      "\n" +
      "Livraison : 1 à 2 jours."
    );

  }, 300);

}


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* Panier */

    const cartBtn =
      $("cartBtn");

    if (cartBtn) {
      cartBtn.onclick =
        openCart;
    }


    /* Overlay */

    const overlay =
      $("overlay");

    if (overlay) {
      overlay.onclick =
        closeModals;
    }


    /* Boutons fermer */

    document
      .querySelectorAll("[data-close]")
      .forEach(button => {

        button.onclick =
          closeModals;

      });


    /* Recherche */

    const searchInput =
      $("searchInput");

    if (searchInput) {

      searchInput.oninput =
        renderProducts;

    }


    const searchBtn =
      $("searchBtn");

    if (searchBtn) {

      searchBtn.onclick =
        renderProducts;

    }


    /* Catégories */

    document
      .querySelectorAll(".nav-link")
      .forEach(button => {

        button.onclick = () => {

          document
            .querySelectorAll(".nav-link")
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          currentCategory =
            button.dataset.category ||
            "Tous";


          renderProducts();

        };

      });


    /* Checkout */

    const checkoutBtn =
      $("checkoutBtn");

    if (checkoutBtn) {

      checkoutBtn.onclick =
        startCheckout;

    }


    /* Formulaire commande */

    const orderBtn =
      $("orderBtn");

    if (orderBtn) {

      orderBtn.onclick =
        submitOrder;

    }


    /* Premier affichage */

    renderProducts();

    renderCart();

  }
);
