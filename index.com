<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>RC STORE — Boutique en ligne officielle</title>

  <meta name="description"
        content="RC STORE — Découvrez nos produits, passez vos commandes facilement et profitez de notre service de livraison.">

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f7f7f7;
      color: #111;
    }

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    button {
      cursor: pointer;
    }

    header {
      background: #111;
      color: white;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 12px rgba(0,0,0,.15);
    }

    .header-inner {
      max-width: 1200px;
      margin: auto;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }

    .logo {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: .5px;
    }

    .cart-button {
      border: 0;
      background: white;
      color: #111;
      padding: 10px 15px;
      border-radius: 12px;
      font-weight: 700;
    }

    .hero {
      max-width: 1200px;
      margin: 25px auto;
      padding: 60px 30px;
      border-radius: 28px;
      background: linear-gradient(135deg,#111,#30343a);
      color: white;
    }

    .hero small {
      font-size: 16px;
      opacity: .85;
    }

    .hero h1 {
      font-size: clamp(38px,7vw,75px);
      line-height: .98;
      margin: 18px 0;
      max-width: 800px;
    }

    .hero p {
      max-width: 650px;
      font-size: 18px;
      line-height: 1.7;
      opacity: .9;
    }

    .hero button {
      margin-top: 15px;
      background: white;
      color: #111;
      border: 0;
      padding: 14px 22px;
      border-radius: 12px;
      font-weight: 800;
    }

    .container {
      max-width: 1200px;
      margin: auto;
      padding: 20px;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 25px;
    }

    .search {
      flex: 1;
      min-width: 220px;
      display: flex;
      gap: 8px;
    }

    .search input {
      width: 100%;
      padding: 13px;
      border: 1px solid #ccc;
      border-radius: 12px;
    }

    .search button {
      padding: 0 18px;
      border: 0;
      background: #111;
      color: white;
      border-radius: 12px;
    }

    .categories {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }

    .category-btn {
      border: 1px solid #ddd;
      background: white;
      padding: 11px 18px;
      border-radius: 999px;
    }

    .category-btn.active {
      background: #111;
      color: white;
      border-color: #111;
    }

    .section-title {
      font-size: 34px;
      margin: 20px 0;
    }

    .products {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(230px,1fr));
      gap: 18px;
    }

    .product {
      background: white;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 3px 15px rgba(0,0,0,.07);
      border: 1px solid #eee;
    }

    .product-image {
      height: 220px;
      width: 100%;
      object-fit: cover;
      background: #eee;
    }

    .product-content {
      padding: 17px;
    }

    .product-category {
      font-size: 13px;
      color: #666;
      margin-bottom: 7px;
    }

    .product h3 {
      margin: 5px 0;
      font-size: 21px;
    }

    .product p {
      color: #555;
      line-height: 1.5;
    }

    .price {
      font-size: 20px;
      font-weight: 800;
      margin: 14px 0;
    }

    .add-btn {
      width: 100%;
      padding: 13px;
      border: 0;
      border-radius: 11px;
      background: #111;
      color: white;
      font-weight: 700;
    }

    .empty {
      background: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      color: #666;
    }

    /* PANIER */

    .cart-panel {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.55);
      z-index: 2000;
    }

    .cart-panel.open {
      display: block;
    }

    .cart-box {
      position: absolute;
      right: 0;
      top: 0;
      width: min(450px,100%);
      height: 100%;
      background: white;
      padding: 22px;
      overflow-y: auto;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding-bottom: 15px;
    }

    .close-btn {
      border: 0;
      background: #eee;
      border-radius: 8px;
      padding: 8px 12px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 65px 1fr auto;
      gap: 10px;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #eee;
    }

    .cart-item img {
      width: 65px;
      height: 65px;
      object-fit: cover;
      border-radius: 9px;
    }

    .qty {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 7px;
    }

    .qty button {
      border: 1px solid #ddd;
      background: white;
      width: 28px;
      height: 28px;
      border-radius: 6px;
    }

    .cart-total {
      font-size: 22px;
      font-weight: 800;
      margin: 20px 0;
    }

    .checkout-btn {
      width: 100%;
      background: #111;
      color: white;
      border: 0;
      padding: 15px;
      border-radius: 12px;
      font-weight: 800;
    }

    /* CHECKOUT */

    .checkout {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.65);
      z-index: 3000;
      overflow-y: auto;
      padding: 20px;
    }

    .checkout.open {
      display: block;
    }

    .checkout-box {
      max-width: 700px;
      background: white;
      margin: 20px auto;
      padding: 25px;
      border-radius: 20px;
    }

    .checkout-box h2 {
      margin-top: 0;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 700;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 13px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background: white;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(130px,1fr));
      gap: 10px;
      margin: 10px 0 20px;
    }

    .payment-option {
      border: 2px solid #ddd;
      padding: 15px;
      border-radius: 12px;
      background: white;
      text-align: center;
      font-weight: 700;
    }

    .payment-option.active {
      border-color: #111;
      background: #f2f2f2;
    }

    .payment-info {
      display: none;
      padding: 17px;
      border-radius: 12px;
      background: #f5f5f5;
      margin-bottom: 18px;
    }

    .payment-info.show {
      display: block;
    }

    .payment-number {
      font-size: 21px;
      font-weight: 900;
      margin: 8px 0;
    }

    .proof {
      display: none;
      margin-top: 15px;
    }

    .proof.show {
      display: block;
    }

    .order-summary {
      background: #f6f6f6;
      padding: 15px;
      border-radius: 12px;
      margin: 20px 0;
    }

    .submit-order {
      width: 100%;
      border: 0;
      background: #111;
      color: white;
      padding: 15px;
      border-radius: 12px;
      font-weight: 800;
    }

    .cancel-checkout {
      width: 100%;
      margin-top: 8px;
      padding: 13px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 12px;
    }

    .success {
      display: none;
      text-align: center;
      padding: 30px 10px;
    }

    .success.show {
      display: block;
    }

    footer {
      margin-top: 60px;
      padding: 40px 20px;
      background: #111;
      color: white;
      text-align: center;
    }

    @media(max-width:600px) {
      .hero {
        margin: 15px;
        padding: 40px 22px;
      }

      .container {
        padding: 15px;
      }

      .hero h1 {
        font-size: 43px;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="header-inner">
    <div class="logo">RC STORE</div>

    <button class="cart-button" onclick="openCart()">
      🛒 Panier (<span id="cartCount">0</span>)
    </button>
  </div>
</header>

<main>

  <section class="hero">
    <small>BIENVENUE CHEZ RC STORE</small>

    <h1>
      Tout ce dont vous avez besoin,
      en un seul endroit.
    </h1>

    <p>
      Découvrez nos produits, consultez les prix,
      ajoutez vos articles au panier et passez
      votre commande facilement.
    </p>

    <button onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">
      Voir les produits
    </button>
  </section>

  <div class="container">

    <div class="toolbar">
      <div class="search">
        <input
          id="searchInput"
          type="search"
          placeholder="Rechercher un produit..."
          oninput="renderProducts()"
        >

        <button onclick="renderProducts()">🔎</button>
      </div>
    </div>

    <div class="categories">
      <button class="category-btn active" onclick="setCategory('Tous',this)">
        Tous
      </button>

      <button class="category-btn" onclick="setCategory('Mode',this)">
        Mode
      </button>

      <button class="category-btn" onclick="setCategory('Beauté',this)">
        Beauté
      </button>

      <button class="category-btn" onclick="setCategory('Électronique',this)">
        Électronique
      </button>

      <button class="category-btn" onclick="setCategory('Accessoires',this)">
        Accessoires
      </button>
    </div>

    <section id="products">
      <div class="section-title">Nos produits</div>

      <div id="resultCount"></div>

      <br>

      <div id="productGrid" class="products"></div>
    </section>

  </div>

</main>

<!-- PANIER -->

<div id="cartPanel" class="cart-panel" onclick="closeCartOutside(event)">
  <div class="cart-box">

    <div class="cart-header">
      <h2>Votre panier</h2>

      <button class="close-btn" onclick="closeCart()">
        ✕
      </button>
    </div>

    <div id="cartItems"></div>

    <div class="cart-total">
      Total : <span id="cartTotal">0 HTG</span>
    </div>

    <button class="checkout-btn" onclick="openCheckout()">
      Passer la commande
    </button>

  </div>
</div>

<!-- CHECKOUT -->

<div id="checkout" class="checkout">

  <div class="checkout-box">

    <div id="checkoutForm">

      <h2>Passer votre commande</h2>

      <div class="form-group">
        <label>Nom complet *</label>
        <input id="customerName" type="text" required>
      </div>

      <div class="form-group">
        <label>Numéro de téléphone *</label>
        <input id="customerPhone" type="tel" placeholder="+509..." required>
      </div>

      <div class="form-group">
        <label>Pays *</label>

        <select id="country">
          <option value="Haiti">Haïti</option>
        </select>
      </div>

      <div class="form-group">
        <label>Commune *</label>

        <select id="commune">
          <option value="Akayè">Akayè</option>
        </select>
      </div>

      <div class="form-group">
        <label>Zone de livraison *</label>

        <select id="zone">
          <option value="">Choisissez votre zone</option>
        </select>
      </div>

      <div class="form-group">
        <label>Adresse / détails pour livraison *</label>

        <textarea
          id="address"
          rows="3"
          placeholder="Adresse, point de repère..."
          required
        ></textarea>
      </div>

      <h3>Moyen de paiement</h3>

      <div class="payment-methods">

        <button
          type="button"
          class="payment-option"
          onclick="selectPayment('MonCash',this)"
        >
          💚 MonCash
        </button>

        <button
          type="button"
          class="payment-option"
          onclick="selectPayment('NatCash',this)"
        >
          🟠 NatCash
        </button>

        <button
          type="button"
          class="payment-option"
          onclick="selectPayment('Mastercard',this)"
        >
          💳 Mastercard
        </button>

      </div>

      <!-- MONCASH -->

      <div id="moncashInfo" class="payment-info">

        <strong>Paiement MonCash</strong>

        <p>
          Le paiement MonCash sera traité par le système
          de paiement sécurisé de RC STORE.
        </p>

        <p>
          Après confirmation du paiement, votre commande
          sera enregistrée.
        </p>

      </div>

      <!-- NATCASH -->

      <div id="natcashInfo" class="payment-info">

        <strong>Paiement NatCash</strong>

        <p>
          Envoyez le montant total au numéro :
        </p>

        <div class="payment-number">
          +509 4155 1464
        </div>

        <p>
          Nom du compte :
          <strong>RC STORE</strong>
        </p>

        <p>
          Après avoir effectué le paiement,
          ajoutez la preuve de paiement ci-dessous.
        </p>

        <div class="proof show">

          <label>
            Preuve de paiement
          </label>

          <input
            id="paymentProof"
            type="file"
            accept="image/*"
          >

        </div>

      </div>

      <!-- MASTERCARD -->

      <div id="mastercardInfo" class="payment-info">

        <strong>💳 Mastercard / Visa</strong>

        <p>
          Le paiement par carte sera disponible
          après connexion du payment gateway sécurisé
          au backend RC STORE.
        </p>

        <p>
          ⚠️ Ne saisissez jamais les informations
          de votre carte bancaire directement dans ce site.
        </p>

      </div>

      <div class="order-summary">

        <strong>Résumé de la commande</strong>

        <div id="checkoutSummary"></div>

        <hr>

        <strong>
          Total : <span id="checkoutTotal">0 HTG</span>
        </strong>

      </div>

      <button
        class="submit-order"
        onclick="submitOrder()"
      >
        Confirmer la commande
      </button>

      <button
        class="cancel-checkout"
        onclick="closeCheckout()"
      >
        Annuler
      </button>

    </div>

    <div id="successMessage" class="success">

      <h2>✅ Commande reçue !</h2>

      <p>
        Merci pour votre commande chez RC STORE.
      </p>

      <p>
        Votre commande a été enregistrée.
        Nous allons vérifier votre paiement.
      </p>

      <h3>
        Numéro de commande :
      </h3>

      <div id="orderNumber"></div>

      <button
        class="submit-order"
        onclick="location.reload()"
      >
        Retour à la boutique
      </button>

    </div>

  </div>

</div>

<footer>

  <strong>RC STORE</strong>

  <p>
    Boutique en ligne officielle de RC STORE.
  </p>

  <p>
    © 2026 RC STORE — Tous droits réservés.
  </p>

</footer>

<script>

  /* ================================
     PRODUITS
  ================================= */

  const products = [

    {
      id: 1,
      name: "T-Shirt Premium",
      price: 2500,
      category: "Mode",
      image: "https://placehold.co/600x600/png?text=T-Shirt",
      description: "T-Shirt élégant et confortable pour tous les jours."
    },

    {
      id: 2,
      name: "Sac à main",
      price: 3500,
      category: "Accessoires",
      image: "https://placehold.co/600x600/png?text=Sac",
      description: "Sac à main moderne et pratique."
    },

    {
      id: 3,
      name: "Écouteurs Bluetooth",
      price: 5000,
      category: "Électronique",
      image: "https://placehold.co/600x600/png?text=Ecouteurs",
      description: "Écouteurs Bluetooth avec un son de qualité."
    },

    {
      id: 4,
      name: "Parfum",
      price: 4500,
      category: "Beauté",
      image: "https://placehold.co/600x600/png?text=Parfum",
      description: "Un parfum agréable pour toutes les occasions."
    },

    {
      id: 5,
      name: "Montre Élégante",
      price: 6000,
      category: "Accessoires",
      image: "https://placehold.co/600x600/png?text=Montre",
      description: "Montre moderne avec un design élégant."
    },

    {
      id: 6,
      name: "Casquette",
      price: 2000,
      category: "Mode",
      image: "https://placehold.co/600x600/png?text=Casquette",
      description: "Casquette confortable et moderne."
    },

    {
      id: 7,
      name: "Enceinte Bluetooth",
      price: 7000,
      category: "Électronique",
      image: "https://placehold.co/600x600/png?text=Enceinte",
      description: "Profitez de votre musique avec un son puissant."
    },

    {
      id: 8,
      name: "Lunettes de soleil",
      price: 3000,
      category: "Accessoires",
      image: "https://placehold.co/600x600/png?text=Lunettes",
      description: "Lunettes élégantes pour votre look quotidien."
    }

  ];

  /* ================================
     ZONES AKAYÈ
  ================================= */

  const deliveryZones = [

    "André",
    "Barbancourt",
    "Barrière Poy",
    "Bas Cortade",
    "Belle Fraîcheur",
    "Bourg",
    "Bourg / Ville d’Arcahaie",
    "Bras Brûlé",
    "Ca Pierre",
    "Carrefour Poy",
    "Corail",
    "Corridor Gangny",
    "Cotard",
    "Coulard",
    "Dasse",
    "Digue Matheux",
    "Digue Proby",
    "Fond-Baptiste",
    "Grande-Place",
    "Gros-Morne",
    "Haut Cortade",
    "Hostin",
    "Labarre",
    "Luly",
    "Marotte",
    "Mérotte",
    "Mitan",
    "Passe",
    "Pont Calebasse",
    "Pont Matheux",
    "Poix-la-Générale",
    "Poix-la-Ravine",
    "Robergeau",
    "Robert",
    "Saint-Médard",
    "Saintard",
    "Thomas",
    "Vigner",
    "Williamson"
  ];

  /* ================================
     PANIER
  ================================= */

  let cart = JSON.parse(
    localStorage.getItem("rc_cart") || "[]"
  );

  let currentCategory = "Tous";

  let selectedPayment = "";

  function money(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " HTG";
  }

  function saveCart() {
    localStorage.setItem(
      "rc_cart",
      JSON.stringify(cart)
    );
  }

  function cartQuantity() {

    return cart.reduce(
      (total,item) => total + item.qty,
      0
    );

  }

  function cartTotal() {

    return cart.reduce(
      (total,item) =>
        total + item.price * item.qty,
      0
    );

  }

  /* ================================
     PRODUITS
  ================================= */

  function setCategory(category, button) {

    currentCategory = category;

    document
      .querySelectorAll(".category-btn")
      .forEach(btn =>
        btn.classList.remove("active")
      );

    button.classList.add("active");

    renderProducts();

  }

  function renderProducts() {

    const grid =
      document.getElementById("productGrid");

    const search =
      document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    let filtered = products.filter(product => {

      const categoryOK =
        currentCategory === "Tous" ||
        product.category === currentCategory;

      const searchOK =
        product.name
          .toLowerCase()
          .includes(search) ||
        product.description
          .toLowerCase()
          .includes(search);

      return categoryOK && searchOK;

    });

    document.getElementById("resultCount").innerHTML =
      "<strong>" +
      filtered.length +
      " produit" +
      (filtered.length > 1 ? "s" : "") +
      "</strong>";

    if (!filtered.length) {

      grid.innerHTML = `
        <div class="empty">
          Aucun produit trouvé.
        </div>
      `;

      return;

    }

    grid.innerHTML =
      filtered.map(product => `

        <article class="product">

          <img
            class="product-image"
            src="${product.image}"
            alt="${product.name}"
            onerror="this.src='https://placehold.co/600x600/png?text=RC+STORE'"
          >

          <div class="product-content">

            <div class="product-category">
              ${product.category}
            </div>

            <h3>
              ${product.name}
            </h3>

            <p>
              ${product.description}
            </p>

            <div class="price">
              ${money(product.price)}
            </div>

            <button
              class="add-btn"
              onclick="addToCart(${product.id})"
            >
              Ajouter au panier
            </button>

          </div>

        </article>

      `).join("");

  }

  function addToCart(id) {

    const product =
      products.find(
        product => product.id === id
      );

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

    updateCart();

    alert(
      product.name +
      " a été ajouté au panier 🛒"
    );

  }

  /* ================================
     PANIER
  ================================= */

  function updateCart() {

    document.getElementById("cartCount").textContent =
      cartQuantity();

    document.getElementById("cartTotal").textContent =
      money(cartTotal());

    const container =
      document.getElementById("cartItems");

    if (!cart.length) {

      container.innerHTML = `
        <div class="empty">
          Votre panier est vide.
        </div>
      `;

      return;

    }

    container.innerHTML =
      cart.map(item => `

        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div>

            <strong>
              ${item.name}
            </strong>

            <div>
              ${money(item.price)}
            </div>

            <div class="qty">

              <button
                onclick="changeQty(${item.id},-1)"
              >
                −
              </button>

              <span>
                ${item.qty}
              </span>

              <button
                onclick="changeQty(${item.id},1)"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="close-btn"
            onclick="removeFromCart(${item.id})"
          >
            ✕
          </button>

        </div>

      `).join("");

  }

  function changeQty(id, amount) {

    const item =
      cart.find(item => item.id === id);

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {

      cart =
        cart.filter(
          item => item.id !== id
        );

    }

    saveCart();

    updateCart();

    if (
      document
        .getElementById("checkout")
        .classList.contains("open")
    ) {
      updateCheckoutSummary();
    }

  }

  function removeFromCart(id) {

    cart =
      cart.filter(
        item => item.id !== id
      );

    saveCart();

    updateCart();

  }

  function openCart() {

    updateCart();

    document
      .getElementById("cartPanel")
      .classList.add("open");

  }

  function closeCart() {

    document
      .getElementById("cartPanel")
      .classList.remove("open");

  }

  function closeCartOutside(event) {

    if (
      event.target.id === "cartPanel"
    ) {
      closeCart();
    }

  }

  /* ================================
     CHECKOUT
  ================================= */

  function openCheckout() {

    if (!cart.length) {

      alert(
        "Votre panier est vide."
      );

      return;

    }

    closeCart();

    document
      .getElementById("checkout")
      .classList.add("open");

    updateCheckoutSummary();

  }

  function closeCheckout() {

    document
      .getElementById("checkout")
      .classList.remove("open");

  }

  function updateCheckoutSummary() {

    const summary =
      document.getElementById(
        "checkoutSummary"
      );

    summary.innerHTML =
      cart.map(item => `

        <div style="
          display:flex;
          justify-content:space-between;
          gap:10px;
          margin:8px 0;
        ">

          <span>
            ${item.name} × ${item.qty}
          </span>

          <strong>
            ${money(item.price * item.qty)}
          </strong>

        </div>

      `).join("");

    document.getElementById(
      "checkoutTotal"
    ).textContent = money(cartTotal());

  }

  /* ================================
     ZONES
  ================================= */

  function loadZones() {

    const zone =
      document.getElementById("zone");

    zone.innerHTML =
      `<option value="">
        Choisissez votre zone
      </option>`;

    deliveryZones.forEach(
      zoneName => {

        const option =
          document.createElement("option");

        option.value = zoneName;
        option.textContent = zoneName;

        zone.appendChild(option);

      }
    );

  }

  /* ================================
     PAIEMENT
  ================================= */

  function selectPayment(method, button) {

    selectedPayment = method;

    document
      .querySelectorAll(".payment-option")
      .forEach(btn =>
        btn.classList.remove("active")
      );

    button.classList.add("active");

    document
      .getElementById("moncashInfo")
      .classList.remove("show");

    document
      .getElementById("natcashInfo")
      .classList.remove("show");

    document
      .getElementById("mastercardInfo")
      .classList.remove("show");

    if (method === "MonCash") {

      document
        .getElementById("moncashInfo")
        .classList.add("show");

    }

    if (method === "NatCash") {

      document
        .getElementById("natcashInfo")
        .classList.add("show");

    }

    if (method === "Mastercard") {

      document
        .getElementById("mastercardInfo")
        .classList.add("show");

    }

  }

  /* ================================
     COMMANDE
  ================================= */

  function generateOrderNumber() {

    const now =
      Date.now()
        .toString()
        .slice(-8);

    return "RC-" + now;

  }

  function submitOrder() {

    if (!cart.length) {

      alert(
        "Votre panier est vide."
      );

      return;

    }

    const name =
      document
        .getElementById("customerName")
        .value
        .trim();

    const phone =
      document
        .getElementById("customerPhone")
        .value
        .trim();

    const country =
      document
        .getElementById("country")
        .value;

    const commune =
      document
        .getElementById("commune")
        .value;

    const zone =
      document
        .getElementById("zone")
        .value;

    const address =
      document
        .getElementById("address")
        .value
        .trim();

    if (!name || !phone || !zone || !address) {

      alert(
        "Veuillez remplir toutes les informations obligatoires."
      );

      return;

    }

    if (!selectedPayment) {

      alert(
        "Veuillez choisir un moyen de paiement."
      );

      return;

    }

    if (
      selectedPayment === "NatCash"
    ) {

      const proof =
        document.getElementById(
          "paymentProof"
        );

      if (!proof.files.length) {

        alert(
          "Veuillez ajouter votre preuve de paiement NatCash."
        );

        return;

      }

    }

    const order = {

      orderNumber:
        generateOrderNumber(),

      customer: {

        name,
        phone,
        country,
        commune,
        zone,
        address

      },

      payment: {

        method: selectedPayment,

        status:
          selectedPayment === "NatCash"
            ? "proof_pending"
            : "pending"

      },

      items: cart,

      total: cartTotal(),

      createdAt:
        new Date().toISOString()

    };

    /*
      IMPORTANT :

      Ici, la commande est prête à être envoyée
      au backend Supabase.

      Le backend devra recevoir "order"
      et enregistrer la commande dans la table
      "orders".

      NE METS PAS de clé secrète MonCash ici.
    */

    console.log(
      "Commande à envoyer au backend :",
      order
    );

    document.getElementById(
      "checkoutForm"
    ).style.display = "none";

    document.getElementById(
      "successMessage"
    ).classList.add("show");

    document.getElementById(
      "orderNumber"
    ).textContent =
      order.orderNumber;

    cart = [];

    saveCart();

    updateCart();

  }

  /* ================================
     INITIALISATION
  ================================= */

  loadZones();

  renderProducts();

  updateCart();

</script>

</body>
</html>
