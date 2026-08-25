     // =====================================
// RC STORE — SCRIPT COMPLET
// =====================================


// =====================================
// PRODUITS
// =====================================

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


// =====================================
// SUPABASE
// =====================================

const SUPABASE_URL =
  "https://simlfhbsfsxthtzefufj.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ZKacsfCd6dI-srcCWJeh0g_PpYB6G-M";

const NATCASH_NUMBER =
  "41551464";

const PAYMENT_BUCKET =
  "preuves-de-paiement";


// =====================================
// COMMUNES
// =====================================

const communes = [
  "Arcahaie"
];


// =====================================
// ZONES
// =====================================

const zones = [
  "Saint-Médard",
  "Belle Fraîcheur",
  "Cortade",
  "Bourg",
  "Bas Cortade",
  "Boulard",
  "Merotte",
  "Corail",
  "Pont-Callebasse",
  "Carrefour Poy",
  "Pierre Michel",
  "Robert Vigner",
  "Thoman",
  "Poy la Ravine",
  "Barrière Poy",
  "Hostin",
  "Ponce",
  "Labarre",
  "Pont-Mathéux",
  "Saint-Ard",
  "Brois Brûlé",
  "Digue Mathéux",
  "Digue Broby"
];


// =====================================
// VARIABLES
// =====================================

let cart =
  JSON.parse(
    localStorage.getItem("rc_cart") || "[]"
  );

let currentCategory =
  "Tous";

let paymentCheckTimer =
  null;


// =====================================
// HELPER
// =====================================

const $ = id =>
  document.getElementById(id);


// =====================================
// PRIX
// =====================================

function money(number) {

  return new Intl.NumberFormat("fr-FR")
    .format(Number(number) || 0) +
    " HTG";

}


// =====================================
// PANIER
// =====================================

function saveCart() {

  localStorage.setItem(
    "rc_cart",
    JSON.stringify(cart)
  );

  renderCart();

}


function getCartTotal() {

  return cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
      Number(item.qty),
    0
  );

}


function getCartQuantity() {

  return cart.reduce(
    (sum, item) =>
      sum + Number(item.qty),
    0
  );

}


// =====================================
// PRODUITS
// =====================================

function renderProducts() {

  const searchInput =
    $("searchInput");

  const search =
    searchInput
      ? searchInput.value
          .toLowerCase()
          .trim()
      : "";


  const list =
    products.filter(product => {

      const categoryOK =
        currentCategory === "Tous" ||
        product.category ===
          currentCategory;

      const searchOK =
        !search ||
        product.name
          .toLowerCase()
          .includes(search) ||
        product.category
          .toLowerCase()
          .includes(search);

      return categoryOK &&
        searchOK;

    });


  if ($("resultCount")) {

    $("resultCount")
      .textContent =
      list.length +
      " produit(s)";

  }


  if ($("productGrid")) {

    $("productGrid")
      .innerHTML =
      list.map(product => `

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

}


// =====================================
// AJOUT PANIER
// =====================================

function addToCart(id) {

  const product =
    products.find(
      item => item.id === id
    );


  if (!product) {

    toast(
      "Produit introuvable"
    );

    return;

  }


  const existing =
    cart.find(
      item => item.id === id
    );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      ...product,
      qty: 1
    });

  }


  saveCart();

  toast(
    "Produit ajouté au panier"
  );

}


// =====================================
// QUANTITÉ
// =====================================

function changeQty(
  id,
  difference
) {

  const item =
    cart.find(
      product => product.id === id
    );


  if (!item) return;


  item.qty += difference;


  if (item.qty <= 0) {

    cart =
      cart.filter(
        product =>
          product.id !== id
      );

  }


  saveCart();

}


// =====================================
// SUPPRIMER
// =====================================

function removeItem(id) {

  cart =
    cart.filter(
      product =>
        product.id !== id
    );

  saveCart();

}


// =====================================
// AFFICHER PANIER
// =====================================

function renderCart() {

  if (!$("cartCount"))
    return;


  const quantity =
    getCartQuantity();


  $("cartCount")
    .textContent =
    quantity;


  if (!$("cartItems"))
    return;


  if (!cart.length) {

    $("cartItems")
      .innerHTML =
      "<p>Votre panier est vide.</p>";

    if ($("cartTotal")) {

      $("cartTotal")
        .textContent =
        "0 HTG";

    }

    return;

  }


  $("cartItems")
    .innerHTML =
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


  if ($("cartTotal")) {

    $("cartTotal")
      .textContent =
      money(
        getCartTotal()
      );

  }

}


// =====================================
// DÉTAIL PRODUIT
// =====================================

function openProduct(id) {

  const product =
    products.find(
      item => item.id === id
    );


  if (!product) return;


  $("productDetail")
    .innerHTML = `

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
            environ 1 à 2 jours
            selon la zone.
          </p>

          <button
            class="primary"
            onclick="
              addToCart(${product.id});
              closeModals()
            "
          >
            Ajouter au panier
          </button>

        </div>

      </div>

    `;


  $("productModal")
    .classList.remove("hidden");


  $("overlay")
    .classList.remove("hidden");

}


// =====================================
// OUVRIR PANIER
// =====================================

function openCart() {

  $("cartDrawer")
    .classList.add("open");

  $("overlay")
    .classList.remove("hidden");

}


// =====================================
// FERMER
// =====================================

function closeModals() {

  document
    .querySelectorAll(".modal")
    .forEach(modal =>
      modal.classList.add("hidden")
    );


  if ($("cartDrawer")) {

    $("cartDrawer")
      .classList.remove("open");

  }


  if ($("overlay")) {

    $("overlay")
      .classList.add("hidden");

  }

}


// =====================================
// MESSAGE
// =====================================

function toast(message) {

  if (!$("toast")) {

    alert(message);

    return;

  }


  $("toast")
    .textContent =
    message;


  $("toast")
    .classList.add("show");


  setTimeout(() => {

    $("toast")
      .classList.remove("show");

  }, 2200);

}


// =====================================
// LIVRAISON
// =====================================

function setupDeliveryFields() {

  const communeSelect =
    $("communeSelect");


  if (communeSelect) {

    communeSelect.innerHTML =
      '<option value="">Choisir une commune</option>';


    communes.forEach(
      commune => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          commune;

        option.textContent =
          commune;

        communeSelect.appendChild(
          option
        );

      }
    );

  }


  const areaInput =
    document.querySelector(
      'input[name="area"]'
    );


  if (
    areaInput &&
    !document.querySelector(
      'select[name="area"]'
    )
  ) {

    const zoneSelect =
      document.createElement(
        "select"
      );

    zoneSelect.name =
      "area";

    zoneSelect.required =
      true;

    zoneSelect.id =
      "zoneSelect";


    zoneSelect.innerHTML =
      '<option value="">Choisir une zone</option>';


    zones.forEach(
      zone => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          zone;

        option.textContent =
          zone;

        zoneSelect.appendChild(
          option
        );

      }
    );


    areaInput.replaceWith(
      zoneSelect
    );

  }

}


// =====================================
// NATCASH
// =====================================

function setupPaymentFields() {

  const paymentSelect =
    document.querySelector(
      'select[name="payment"]'
    );


  if (!paymentSelect)
    return;


  const paymentInfo =
    $("natcashPaymentInfo");


  if (!paymentInfo)
    return;


  function updatePaymentInfo() {

    if (
      paymentSelect.value ===
      "NatCash"
    ) {

      paymentInfo.style.display =
        "block";


      const total =
        getCartTotal();


      paymentInfo.innerHTML = `

        <div>

          <strong>
            💰 Paiement par NatCash
          </strong>

        </div>

        <p>
          Envoyez le montant exact
          de votre commande au :
        </p>

        <h3>
          📱 ${NATCASH_NUMBER}
        </h3>

        <p>
          Montant à payer :
          <strong>
            ${money(total)}
          </strong>
        </p>

        <p>
          Après le paiement, ajoutez
          une capture d'écran du reçu.
        </p>

        <label>

          📸 Preuve de paiement

          <input
            type="file"
            id="paymentProof"
            accept="image/jpeg,image/png,image/webp"
          >

        </label>

      `;

    } else {

      paymentInfo.style.display =
        "none";

      paymentInfo.innerHTML =
        "";

    }

  }


  paymentSelect.addEventListener(
    "change",
    updatePaymentInfo
  );


  updatePaymentInfo();

}


// =====================================
// SUPABASE — CREER COMMANDE
// =====================================

async function createOrder(
  orderData
) {

  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/commandes`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${SUPABASE_KEY}`,

          "Prefer":
            "return=representation"
        },

        body:
          JSON.stringify(
            orderData
          )
      }
    );


  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      text ||
      "Impossible d'enregistrer la commande."
    );

  }


  const data =
    await response.json();


  if (!data.length) {

    throw new Error(
      "La commande n'a pas été retournée par Supabase."
    );

  }


  return data[0];

}


// =====================================
// SUPABASE — UPLOAD PREUVE
// =====================================

async function uploadPaymentProof(
  file,
  orderId
) {

  if (!file) {

    throw new Error(
      "Ajoutez la preuve de paiement."
    );

  }


  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];


  if (
    !allowedTypes.includes(
      file.type
    )
  ) {

    throw new Error(
      "Utilisez une image JPG, PNG ou WEBP."
    );

  }


  if (
    file.size >
    10 * 1024 * 1024
  ) {

    throw new Error(
      "La preuve ne doit pas dépasser 10 MB."
    );

  }


  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();


  const filePath =
    `${orderId}/${Date.now()}-preuve.${extension}`;


  const response =
    await fetch(
      `${SUPABASE_URL}/storage/v1/object/${PAYMENT_BUCKET}/${filePath}`,
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${SUPABASE_KEY}`,

          "apikey":
            SUPABASE_KEY,

          "Content-Type":
            file.type,

          "x-upsert":
            "false"
        },

        body: file
      }
    );


  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      "Erreur upload preuve : " +
      text
    );

  }


  return filePath;

}


// =====================================
// METTRE A JOUR LA COMMANDE
// =====================================

async function updateOrder(
  orderId,
  updateData
) {

  const response =
    await fetch(
      `${SUPABASE_URL}/rest/v1/commandes?id=eq.${encodeURIComponent(orderId)}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          "apikey":
            SUPABASE_KEY,

          "Authorization":
            `Bearer ${SUPABASE_KEY}`,

          "Prefer":
            "return=representation"
        },

        body:
          JSON.stringify(
            updateData
          )
      }
    );


  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      text ||
      "Impossible de mettre à jour la commande."
    );

  }


  const data =
    await response.json();


  return data[0] || null;

}


// =====================================
// VÉRIFIER LE STATUT
// =====================================

function startPaymentStatusCheck(
  orderId
) {

  if (paymentCheckTimer) {

    clearInterval(
      paymentCheckTimer
    );

  }


  paymentCheckTimer =
    setInterval(
      async () => {

        try {

          const response =
            await fetch(
              `${SUPABASE_URL}/rest/v1/commandes?id=eq.${encodeURIComponent(orderId)}&select=*`,
              {
                headers: {
                  "apikey":
                    SUPABASE_KEY,

                  "Authorization":
                    `Bearer ${SUPABASE_KEY}`
                }
              }
            );


          if (!response.ok)
            return;


          const data =
            await response.json();


          if (!data.length)
            return;


          const order =
            data[0];


          if (
            order.status === "paid" ||
            order.status === "paye" ||
            order.status === "accepted"
          ) {

            clearInterval(
              paymentCheckTimer
            );


            showPaidReceipt(
              order
            );

          }

        } catch (error) {

          console.error(
            error
          );

        }

      },
      5000
    );

}


// =====================================
// REÇU
// =====================================

function showPaidReceipt(
  order
) {

  const old =
    $("rcReceiptBox");


  if (old)
    old.remove();


  let items = [];


  try {

    items =
      typeof order.items ===
      "string"
        ? JSON.parse(
            order.items
          )
        : (
            Array.isArray(
              order.items
            )
              ? order.items
              : []
          );

  } catch {

    items = [];

  }


  const itemsHtml =
    items.map(
      item => `

        <div style="
          display:flex;
          justify-content:space-between;
          gap:10px;
          margin:7px 0;
        ">

          <span>
            ${item.name || "Produit"}
            ×
            ${item.qty || 1}
          </span>

          <strong>
            ${money(
              Number(item.price || 0) *
              Number(item.qty || 1)
            )}
          </strong>

        </div>

      `
    ).join("");


  const date =
    order.created_at
      ? new Date(
          order.created_at
        ).toLocaleString(
          "fr-FR"
        )
      : new Date()
          .toLocaleString(
            "fr-FR"
          );


  const receipt =
    document.createElement(
      "div"
    );


  receipt.id =
    "rcReceiptBox";


  receipt.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    z-index:99999;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:18px;
  `;


  receipt.innerHTML = `

    <div
      id="rcReceiptContent"
      style="
        background:white;
        width:100%;
        max-width:520px;
        max-height:90vh;
        overflow:auto;
        border-radius:16px;
        padding:22px;
        font-family:Arial,sans-serif;
      "
    >

      <div style="text-align:center">

        <h2>
          RC STORE
        </h2>

        <h3>
          REÇU DE PAIEMENT
        </h3>

        <p>
          ✅ Paiement accepté
        </p>

      </div>

      <hr>

      <p>
        <strong>
          N° commande :
        </strong>
        ${order.id || ""}
      </p>

      <p>
        <strong>
          Client :
        </strong>
        ${order.name || ""}
      </p>

      <p>
        <strong>
          Téléphone :
        </strong>
        ${order.phone || ""}
      </p>

      <p>
        <strong>
          Commune :
        </strong>
        ${order.commune || ""}
      </p>

      <p>
        <strong>
          Zone :
        </strong>
        ${order.zone || order.area || ""}
      </p>

      <p>
        <strong>
          Date :
        </strong>
        ${date}
      </p>

      <p>
        <strong>
          Paiement :
        </strong>
        ${order.payment_method || "NatCash"}
      </p>

      <hr>

      <h4>
        Commande
      </h4>

      ${itemsHtml}

      <hr>

      <h3 style="text-align:right">

        Total :
        ${money(
          order.total || 0
        )}

      </h3>

      <p style="text-align:center">

        Merci pour votre achat
        chez RC STORE.

      </p>

      <div style="
        display:flex;
        gap:10px;
        justify-content:center;
        flex-wrap:wrap;
        margin-top:18px;
      ">

        <button
          id="downloadReceiptBtn"
          style="
            padding:12px 16px;
            border:0;
            border-radius:8px;
            cursor:pointer;
          "
        >
          📥 Télécharger le reçu
        </button>

        <button
          id="closeReceiptBtn"
          style="
            padding:12px 16px;
            border:0;
            border-radius:8px;
            cursor:pointer;
          "
        >
          Fermer
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    receipt
  );


  $("downloadReceiptBtn")
    .onclick =
    () =>
      downloadReceipt(
        order
      );


  $("closeReceiptBtn")
    .onclick =
    () =>
      receipt.remove();

}


// =====================================
// TÉLÉCHARGER REÇU
// =====================================

function downloadReceipt(
  order
) {

  const content =
    $("rcReceiptContent");


  if (!content)
    return;


  const text =
    content.innerText;


  const blob =
    new Blob(
      [text],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    `recu-RC-STORE-${order.id || "commande"}.txt`;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  URL.revokeObjectURL(
    url
  );

}


// =====================================
// CHECKOUT
// =====================================

function openCheckout() {

  if (!cart.length) {

    toast(
      "Votre panier est vide."
    );

    return;

  }


  if ($("cartDrawer")) {

    $("cartDrawer")
      .classList.remove(
        "open"
      );

  }


  const total =
    getCartTotal();


  const quantity =
    getCartQuantity();


  if ($("checkoutSummary")) {

    $("checkoutSummary")
      .innerHTML = `

        <div class="delivery-box">

          <strong>
            ${quantity}
            article(s) —
            ${money(total)}
          </strong>

          <span>
            🚚 Livraison estimée :
            1 à 2 jours selon la zone.
          </span>

        </div>

      `;

  }


  if ($("checkoutModal")) {

    $("checkoutModal")
      .classList.remove(
        "hidden"
      );

  }


  if ($("overlay")) {

    $("overlay")
      .classList.remove(
        "hidden"
      );

  }


  setupDeliveryFields();
  setupPaymentFields();

}


// =====================================
// SOUMISSION COMMANDE
// =====================================

async function submitOrder(
  event
) {

  event.preventDefault();


  if (!cart.length) {

    toast(
      "Votre panier est vide."
    );

    return;

  }


  const form =
    event.currentTarget;


  const formData =
    new FormData(form);


  const name =
    String(
      formData.get("name") || ""
    ).trim();


  const phone =
    String(
      formData.get("phone") || ""
    ).trim();


  const commune =
    String(
      formData.get("commune") || ""
    ).trim();


  const area =
    String(
      formData.get("area") || ""
    ).trim();


  const landmark =
    String(
      formData.get("landmark") || ""
    ).trim();


  const payment =
    String(
      formData.get("payment") || ""
    ).trim();


  if (
    !name ||
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


  const proofInput =
    $("paymentProof");


  const proofFile =
    proofInput &&
    proofInput.files
      ? proofInput.files[0]
      : null;


  if (
    payment === "NatCash" &&
    !proofFile
  ) {

    toast(
      "Ajoutez la preuve du paiement NatCash."
    );

    return;

  }


  const total =
    getCartTotal();


  const quantity =
    getCartQuantity();


  const items =
    cart.map(
      item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        qty: Number(item.qty),
        category: item.category
      })
    );


  const button =
    form.querySelector(
      'button[type="submit"]'
    );


  if (button) {

    button.disabled =
      true;

    button.textContent =
      "Enregistrement...";

  }


  try {

    // ---------------------------------
    // CRÉER COMMANDE
    // ---------------------------------

    const orderData = {

      name,

      phone,

      commune,

      zone: area,

      landmark,

      payment_method:
        payment,

      total,

      quantity,

      items,

      status:
        payment === "NatCash"
          ? "pending"
          : "pending",

      created_at:
        new Date().toISOString()

    };


    const order =
      await createOrder(
        orderData
      );


    if (!order ||
        !order.id) {

      throw new Error(
        "La commande n'a pas reçu de numéro."
      );

    }


    // ---------------------------------
    // UPLOAD PREUVE NATCASH
    // ---------------------------------

    let proofPath =
      null;


    if (
      payment === "NatCash"
    ) {

      proofPath =
        await uploadPaymentProof(
          proofFile,
          order.id
        );


      await updateOrder(
        order.id,
        {
          payment_proof:
            proofPath
        }
      );

    }


    // ---------------------------------
    // SUCCÈS
    // ---------------------------------

    toast(
      "Commande enregistrée !"
    );


    cart = [];


    saveCart();


    form.reset();


    if ($("natcashPaymentInfo")) {

      $("natcashPaymentInfo")
        .style.display =
        "none";

      $("natcashPaymentInfo")
        .innerHTML =
        "";

    }


    closeModals();


    setTimeout(() => {

      showPendingMessage(
        order
      );

    }, 500);


    // Vérifier si admin valide
    // le paiement

    if (
      payment === "NatCash"
    ) {

      startPaymentStatusCheck(
        order.id
      );

    }

  } catch (error) {

    console.error(
      "Commande:",
      error
    );


    toast(
      error.message ||
      "Une erreur est survenue."
    );

  } finally {

    if (button) {

      button.disabled =
        false;

      button.textContent =
        "Confirmer la commande";

    }

  }

}


// =====================================
// MESSAGE EN ATTENTE
// =====================================

function showPendingMessage(
  order
) {

  const old =
    $("rcPendingBox");


  if (old)
    old.remove();


  const box =
    document.createElement(
      "div"
    );


  box.id =
    "rcPendingBox";


  box.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    z-index:99998;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:18px;
  `;


  box.innerHTML = `

    <div style="
      background:#fff;
      width:100%;
      max-width:480px;
      border-radius:16px;
      padding:25px;
      text-align:center;
      font-family:Arial,sans-serif;
    ">

      <div style="
        font-size:45px;
      ">
        ⏳
      </div>

      <h2>
        Commande reçue
      </h2>

      <p>
        Votre commande
        <strong>
          #${order.id}
        </strong>
        a bien été enregistrée.
      </p>

      <p>
        Votre paiement NatCash est
        <strong>
          en attente de vérification.
        </strong>
      </p>

      <p>
        Après validation du paiement,
        votre reçu sera disponible.
      </p>

      <button
        id="closePendingBtn"
        class="primary"
        style="
          margin-top:15px;
          padding:12px 20px;
        "
      >
        Compris
      </button>

    </div>

  `;


  document.body.appendChild(
    box
  );


  $("closePendingBtn")
    .onclick =
    () =>
      box.remove();

}


// =====================================
// BOUTONS
// =====================================

function setupButtons() {

  if ($("cartBtn")) {

    $("cartBtn")
      .onclick =
      openCart;

  }


  if ($("overlay")) {

    $("overlay")
      .onclick =
      closeModals;

  }


  document
    .querySelectorAll(
      "[data-close]"
    )
    .forEach(button => {

      button.onclick =
        closeModals;

    });


  if ($("checkoutBtn")) {

    $("checkoutBtn")
      .onclick =
      openCheckout;

  }


  if ($("orderForm")) {

    $("orderForm")
      .addEventListener(
        "submit",
        submitOrder
      );

  }


  if ($("searchInput")) {

    $("searchInput")
      .addEventListener(
        "input",
        renderProducts
      );

  }


  if ($("searchBtn")) {

    $("searchBtn")
      .onclick =
      renderProducts;

  }


  document
    .querySelectorAll(
      ".nav-link"
    )
    .forEach(button => {

      button.onclick =
        () => {

          document
            .querySelectorAll(
              ".nav-link"
            )
            .forEach(item =>
              item.classList
                .remove(
                  "active"
                )
            );


          button.classList
            .add("active");


          currentCategory =
            button.dataset.category;


          renderProducts();

        };

    });

}


// =====================================
// DÉMARRAGE
// =====================================

function init() {

  renderProducts();

  renderCart();

  setupButtons();

}


init();    
