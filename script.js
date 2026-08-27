// =====================================
// RC STORE — SCRIPT.JS
// VERSION CORRIGÉE
// =====================================


// =====================================
// PRODUITS
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

let cart = [];

try {
  cart = JSON.parse(
    localStorage.getItem("rc_cart") || "[]"
  );

  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch (error) {
  cart = [];
}

let currentCategory = "Tous";


// =====================================
// PRIX
// =====================================

function money(number) {

  return (
    new Intl.NumberFormat("fr-FR")
      .format(Number(number) || 0)
    + " HTG"
  );

}


// =====================================
// PANIER — TOTAL
// =====================================

function getCartTotal() {

  return cart.reduce(function(total, item) {

    return total +
      Number(item.price || 0) *
      Number(item.qty || 0);

  }, 0);

}


// =====================================
// PANIER — QUANTITÉ
// =====================================

function getCartQuantity() {

  return cart.reduce(function(total, item) {

    return total + Number(item.qty || 0);

  }, 0);

}


// =====================================
// SAUVEGARDER PANIER
// =====================================

function saveCart() {

  localStorage.setItem(
    "rc_cart",
    JSON.stringify(cart)
  );

  renderCart();

}


// =====================================
// AJOUTER AU PANIER
// =====================================

function addToCart(id) {

  const product = products.find(function(item) {

    return item.id === Number(id);

  });

  if (!product) {
    return;
  }


  const existing = cart.find(function(item) {

    return item.id === product.id;

  });


  if (existing) {

    existing.qty =
      Number(existing.qty || 0) + 1;

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

  toast(
    product.name +
    " ajouté au panier 🛒"
  );

}


// =====================================
// MODIFIER QUANTITÉ
// =====================================

function changeQty(id, amount) {

  const item = cart.find(function(product) {

    return product.id === Number(id);

  });

  if (!item) {
    return;
  }


  item.qty =
    Number(item.qty || 0) +
    Number(amount || 0);


  if (item.qty <= 0) {

    cart = cart.filter(function(product) {

      return product.id !== Number(id);

    });

  }


  saveCart();

}


// =====================================
// SUPPRIMER DU PANIER
// =====================================

function removeItem(id) {

  cart = cart.filter(function(item) {

    return item.id !== Number(id);

  });

  saveCart();

  toast("Produit retiré du panier.");

}


// =====================================
// AFFICHER PANIER
// =====================================

function renderCart() {

  const cartItems =
    document.getElementById("cartItems");

  const cartCount =
    document.getElementById("cartCount");

  const cartTotal =
    document.getElementById("cartTotal");


  if (cartCount) {

    cartCount.textContent =
      getCartQuantity();

  }


  if (cartTotal) {

    cartTotal.textContent =
      money(getCartTotal());

  }


  if (!cartItems) {
    return;
  }


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">

        <div style="font-size:40px;">
          🛒
        </div>

        <p>
          Votre panier est vide.
        </p>

      </div>
    `;

    return;
  }


  cartItems.innerHTML = cart.map(function(item) {

    return `
      <div class="cart-item">

        <div class="cart-item-icon">
          ${item.emoji || "📦"}
        </div>

        <div class="cart-item-info">

          <strong>
            ${item.name}
          </strong>

          <span>
            ${money(item.price)}
          </span>

          <div class="qty-controls">

            <button
              type="button"
              onclick="changeQty(${item.id}, -1)"
            >
              −
            </button>

            <strong>
              ${item.qty}
            </strong>

            <button
              type="button"
              onclick="changeQty(${item.id}, 1)"
            >
              +
            </button>

          </div>

        </div>

        <button
          type="button"
          class="remove-item"
          onclick="removeItem(${item.id})"
          aria-label="Supprimer"
        >
          ×
        </button>

      </div>
    `;

  }).join("");

}


// =====================================
// OUVRIR PANIER
// =====================================

function openCart() {

  const drawer =
    document.getElementById("cartDrawer");

  const overlay =
    document.getElementById("overlay");


  if (!drawer) {

    console.error(
      "Erreur : #cartDrawer introuvable."
    );

    return;

  }


  renderCart();


  drawer.classList.add("open");

  drawer.classList.remove("hidden");


  if (overlay) {

    overlay.classList.remove("hidden");

  }


  document.body.classList.add(
    "cart-open"
  );

}


// =====================================
// FERMER PANIER / MODALS
// =====================================

function closeModals() {

  document.querySelectorAll(
    ".modal"
  ).forEach(function(modal) {

    modal.classList.add("hidden");

  });


  const drawer =
    document.getElementById("cartDrawer");

  if (drawer) {

    drawer.classList.remove("open");

  }


  const overlay =
    document.getElementById("overlay");

  if (overlay) {

    overlay.classList.add("hidden");

  }


  document.body.classList.remove(
    "cart-open"
  );

}


// =====================================
// PRODUITS
// =====================================

function renderProducts() {

  const grid =
    document.getElementById(
      "productGrid"
    );

  const resultCount =
    document.getElementById(
      "resultCount"
    );

  const searchInput =
    document.getElementById(
      "searchInput"
    );


  if (!grid) {
    return;
  }


  const search =
    searchInput
      ? searchInput.value
          .toLowerCase()
          .trim()
      : "";


  const filteredProducts =
    products.filter(function(product) {

      const categoryOK =
        currentCategory === "Tous" ||
        product.category ===
        currentCategory;


      const searchOK =
        search === "" ||

        product.name
          .toLowerCase()
          .includes(search) ||

        product.category
          .toLowerCase()
          .includes(search) ||

        product.desc
          .toLowerCase()
          .includes(search);


      return categoryOK && searchOK;

    });


  if (resultCount) {

    resultCount.textContent =
      filteredProducts.length +
      " produit" +
      (
        filteredProducts.length > 1
          ? "s"
          : ""
      );

  }


  if (filteredProducts.length === 0) {

    grid.innerHTML = `
      <div class="empty-products">
        Aucun produit trouvé.
      </div>
    `;

    return;

  }


  grid.innerHTML =
    filteredProducts.map(function(product) {

      return `
        <article class="product-card">

          <button
            type="button"
            class="product-image"
            onclick="openProduct(${product.id})"
            aria-label="${product.name}"
          >

            <span>
              ${product.emoji}
            </span>

          </button>


          <div class="product-content">

            <small>
              ${product.category}
            </small>

            <h3>
              ${product.name}
            </h3>

            <p>
              ${product.desc}
            </p>


            <div class="product-bottom">

              <strong>
                ${money(product.price)}
              </strong>


              <button
                type="button"
                class="primary"
                onclick="addToCart(${product.id})"
              >
                Ajouter au panier
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");

}


// =====================================
// DÉTAIL PRODUIT
// =====================================

function openProduct(id) {

  const product =
    products.find(function(item) {

      return item.id === Number(id);

    });


  const detail =
    document.getElementById(
      "productDetail"
    );


  const modal =
    document.getElementById(
      "productModal"
    );


  const overlay =
    document.getElementById(
      "overlay"
    );


  if (!product || !detail || !modal) {
    return;
  }


  detail.innerHTML = `
    <div class="product-detail">

      <div class="detail-image">

        ${product.emoji}

      </div>


      <div>

        <small>
          ${product.category}
        </small>

        <h2>
          ${product.name}
        </h2>

        <h3>
          ${money(product.price)}
        </h3>

        <p>
          ${product.desc}
        </p>


        <button
          type="button"
          class="primary full"
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


  modal.classList.remove("hidden");


  if (overlay) {

    overlay.classList.remove(
      "hidden"
    );

  }

}


// =====================================
// CHECKOUT
// =====================================

function openCheckout() {

  if (cart.length === 0) {

    toast(
      "Votre panier est vide."
    );

    return;

  }


  const summary =
    document.getElementById(
      "checkoutSummary"
    );


  if (summary) {

    summary.innerHTML = `

      ${cart.map(function(item) {

        return `
          <div class="summary-item">

            <span>
              ${item.emoji || "📦"}
              ${item.name}
              × ${item.qty}
            </span>

            <strong>
              ${money(
                Number(item.price) *
                Number(item.qty)
              )}
            </strong>

          </div>
        `;

      }).join("")}


      <div class="summary-total">

        <span>
          Total
        </span>

        <strong>
          ${money(getCartTotal())}
        </strong>

      </div>

    `;

  }


  closeModals();


  const checkoutModal =
    document.getElementById(
      "checkoutModal"
    );


  const overlay =
    document.getElementById(
      "overlay"
    );


  if (checkoutModal) {

    checkoutModal.classList.remove(
      "hidden"
    );

  }


  if (overlay) {

    overlay.classList.remove(
      "hidden"
    );

  }

}


// =====================================
// PAIEMENT
// =====================================

function updatePaymentInfo() {

  const payment =
    document.getElementById(
      "paymentSelect"
    );


  const natcashInfo =
    document.getElementById(
      "natcashPaymentInfo"
    );


  const moncashInfo =
    document.getElementById(
      "moncashPaymentInfo"
    );


  const proof =
    document.getElementById(
      "paymentProof"
    );


  if (!payment) {
    return;
  }


  if (natcashInfo) {

    natcashInfo.style.display =
      payment.value === "NatCash"
        ? "block"
        : "none";

  }


  if (moncashInfo) {

    moncashInfo.style.display =
      payment.value === "MonCash"
        ? "block"
        : "none";

  }


  if (proof) {

    proof.required =
      payment.value === "NatCash";

  }

}


// =====================================
// COMMUNES
// =====================================

function setupDeliveryFields() {

  const communeSelect =
    document.getElementById(
      "communeSelect"
    );


  if (!communeSelect) {
    return;
  }


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
      document.createElement(
        "option"
      );

    option.value = commune;

    option.textContent = commune;

    communeSelect.appendChild(
      option
    );

  });

}


// =====================================
// MESSAGE
// =====================================

function toast(message) {

  const element =
    document.getElementById(
      "toast"
    );


  if (!element) {

    alert(message);

    return;

  }


  element.textContent =
    message;


  element.classList.add(
    "show"
  );


  setTimeout(function() {

    element.classList.remove(
      "show"
    );

  }, 2500);

}


// =====================================
// RECHERCHE
// =====================================

function setupSearch() {

  const input =
    document.getElementById(
      "searchInput"
    );


  const button =
    document.getElementById(
      "searchBtn"
    );


  if (input) {

    input.addEventListener(
      "input",
      renderProducts
    );

  }


  if (button) {

    button.addEventListener(
      "click",
      renderProducts
    );

  }

}


// =====================================
// CATÉGORIES
// =====================================

function setupCategories() {

  document.querySelectorAll(
    ".nav-link"
  ).forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        document.querySelectorAll(
          ".nav-link"
        ).forEach(function(btn) {

          btn.classList.remove(
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

      }
    );

  });

}


// =====================================
// ÉVÉNEMENTS
// =====================================

function setupEvents() {

  const cartBtn =
    document.getElementById(
      "cartBtn"
    );


  if (cartBtn) {

    cartBtn.onclick =
      function(event) {

        event.preventDefault();

        openCart();

      };

  }


  const checkoutBtn =
    document.getElementById(
      "checkoutBtn"
    );


  if (checkoutBtn) {

    checkoutBtn.onclick =
      function(event) {

        event.preventDefault();

        openCheckout();

      };

  }


  const overlay =
    document.getElementById(
      "overlay"
    );


  if (overlay) {

    overlay.onclick =
      function() {

        closeModals();

      };

  }


  const payment =
    document.getElementById(
      "paymentSelect"
    );


  if (payment) {

    payment.addEventListener(
      "change",
      updatePaymentInfo
    );

  }


  document.querySelectorAll(
    "[data-close]"
  ).forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        closeModals();

      }
    );

  });

}


// =====================================
// FORMULAIRE COMMANDE
// =====================================

function setupOrderForm() {

  const form =
    document.getElementById(
      "orderForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      if (cart.length === 0) {

        toast(
          "Votre panier est vide."
        );

        return;

      }


      const formData =
        new FormData(form);


      const name =
        formData.get("name");


      const countryCode =
        formData.get(
          "countryCode"
        );


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
        !countryCode ||
        !phone ||
        !commune ||
        !area ||
        !landmark ||
        !payment
      ) {

        toast(
          "Veuillez remplir tous les champs."
        );

        return;

      }


      if (
        payment === "NatCash"
      ) {

        const proofInput =
          document.getElementById(
            "paymentProof"
          );


        if (
          !proofInput ||
          !proofInput.files ||
          proofInput.files.length === 0
        ) {

          toast(
            "Ajoutez votre preuve NatCash."
          );

          return;

        }

      }


      const orderNumber =
        "RC-" +
        Date.now()
          .toString()
          .slice(-8);


      const customerPhone =
        countryCode +
        " " +
        phone;


      alert(

        "Commande enregistrée !\n\n" +

        "Numéro : " +
        orderNumber +

        "\n\n" +

        "Client : " +
        name +

        "\n\n" +

        "Téléphone : " +
        customerPhone +

        "\n\n" +

        "Commune : " +
        commune +

        "\n\n" +

        "Zone : " +
        area +

        "\n\n" +

        "Paiement : " +
        payment +

        "\n\n" +

        "Total : " +
        money(
          getCartTotal()
        )

      );


      cart = [];


      saveCart();


      form.reset();


      updatePaymentInfo();


      closeModals();

    }
  );

}


// =====================================
// EXPOSER LES FONCTIONS
// POUR LES BOUTONS HTML
// =====================================

window.addToCart =
  addToCart;

window.changeQty =
  changeQty;

window.removeItem =
  removeItem;

window.openCart =
  openCart;

window.openProduct =
  openProduct;

window.openCheckout =
  openCheckout;

window.closeModals =
  closeModals;


// =====================================
// DÉMARRAGE
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    renderProducts();

    renderCart();

    setupSearch();

    setupCategories();

    setupEvents();

    setupDeliveryFields();

    setupOrderForm();

    updatePaymentInfo();

  }
);
