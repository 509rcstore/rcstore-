Wi 👍🏽 Men li ankò pou w ka rekopye l dirèkteman. Se menm vèsyon an, ak Arcahaie + zòn yo + panier + NatCash + prèv peman + commandes + pending/paid + reçu.

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

const NATCASH_NUMBER = "41551464";

const PAYMENT_BUCKET =
  "preuves-de-paiement";


// =====================================
// COMMUNES
// =====================================

const communes = [
  "Arcahaie"
];


// =====================================
// ZONES - ARCAHAIE
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


let cart =
  JSON.parse(
    localStorage.getItem("rc_cart") || "[]"
  );

let currentCategory = "Tous";

const $ = id =>
  document.getElementById(id);


// =====================================
// PRIX
// =====================================

function money(number) {

  return new Intl.NumberFormat("fr-FR")
    .format(number) + " HTG";

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


// =====================================
// PRODUITS
// =====================================

function renderProducts() {

  const search =
    $("searchInput").value
      .toLowerCase()
      .trim();


  const list =
    products.filter(product =>
      (
        currentCategory === "Tous" ||
        product.category === currentCategory
      ) &&
      (
        !search ||
        product.name
          .toLowerCase()
          .includes(search) ||
        product.category
          .toLowerCase()
          .includes(search)
      )
    );


  $("resultCount").textContent =
    list.length + " produit(s)";


  $("productGrid").innerHTML =
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


// =====================================
// AJOUTER AU PANIER
// =====================================

function addToCart(id) {

  const product =
    products.find(
      item => item.id === id
    );


  if (!product) return;


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

function changeQty(id, difference) {

  const item =
    cart.find(
      product => product.id === id
    );


  if (!item) return;


  item.qty += difference;


  if (item.qty <= 0) {

    cart =
      cart.filter(
        product => product.id !== id
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
      product => product.id !== id
    );


  saveCart();

}


// =====================================
// AFFICHER PANIER
// =====================================

function renderCart() {

  const quantity =
    cart.reduce(
      (total, item) =>
        total + item.qty,
      0
    );


  $("cartCount").textContent =
    quantity;


  if (!cart.length) {

    $("cartItems").innerHTML =
      "<p>Votre panier est vide.</p>";

    $("cartTotal").textContent =
      "0 HTG";

    return;

  }


  $("cartItems").innerHTML =
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


  $("cartTotal").textContent =
    money(total);

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


  $("productDetail").innerHTML = `

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
          <strong>🚚 Livraison :</strong>
          environ 1 à 2 jours selon la zone.
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


  $("cartDrawer")
    .classList.remove("open");


  $("overlay")
    .classList.add("hidden");

}


// =====================================
// MESSAGE
// =====================================

function toast(message) {

  $("toast").textContent =
    message;


  $("toast")
    .classList.add("show");


  setTimeout(() => {

    $("toast")
      .classList.remove("show");

  }, 1800);

}


// =====================================
// COMMUNE + ZONE
// =====================================

function setupDeliveryFields() {

  const communeSelect =
    $("communeSelect");


  if (communeSelect) {

    communeSelect.innerHTML =
      '<option value="">Choisir une commune</option>';


    communes.forEach(commune => {

      const option =
        document.createElement("option");


      option.value =
        commune;


      option.textContent =
        commune;


      communeSelect.appendChild(
        option
      );

    });

  }


  const areaInput =
    document.querySelector(
      'input[name="area"]'
    );


  if (areaInput) {

    const zoneSelect =
      document.createElement("select");


    zoneSelect.name =
      "area";


    zoneSelect.required =
      true;


    zoneSelect.id =
      "zoneSelect";


    zoneSelect.innerHTML =
      '<option value="">Choisir une zone</option>';


    zones.forEach(zone => {

      const option =
        document.createElement("option");


      option.value =
        zone;


      option.textContent =
        zone;


      zoneSelect.appendChild(
        option
      );

    });


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


  if (!paymentSelect) return;


  let paymentInfo =
    $("natcashPaymentInfo");


  if (!paymentInfo) {

    paymentInfo =
      document.createElement("div");


    paymentInfo.id =
      "natcashPaymentInfo";


    paymentInfo.style.marginTop =
      "12px";


    paymentInfo.style.padding =
      "14px";


    paymentInfo.style.border =
      "1px solid #ddd";


    paymentInfo.style.borderRadius =
      "10px";


    paymentInfo.style.display =
      "none";


    paymentSelect.parentNode.appendChild(
      paymentInfo
    );

  }


  paymentSelect.addEventListener(
    "change",
    function() {

      if (
        this.value
          .toLowerCase()
          .includes("natcash")
      ) {

        paymentInfo.style.display =
          "block";


        paymentInfo.innerHTML = `

          <div>
            <strong>
              💰 Paiement NatCash
            </strong>
          </div>

          <p>
            Envoyez le montant de votre
            commande au numéro :
          </p>

          <h3>
            ${NATCASH_NUMBER}
          </h3>

          <p>
            Après le paiement, ajoutez
            une capture d'écran ou une
            photo comme preuve.
          </p>

          <input
            type="file"
            id="paymentProof"
            accept="image/jpeg,image/png,image/webp"
            required
          />

        `;

      } else {

        paymentInfo.style.display =
          "none";


        paymentInfo.innerHTML =
          "";

      }

    }
  );

}


// =====================================
// UPLOAD PREUVE
// =====================================

async function uploadPaymentProof(
  file,
  orderId
) {

  if (!file) {

    throw new Error(
      "Veuillez ajouter la preuve de paiement."
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
      "Format accepté : JPG, PNG ou WEBP."
    );

  }


  if (
    file.size >
    50 * 1024 * 1024
  ) {

    throw new Error(
      "La photo ne doit pas dépasser 50 MB."
    );

  }


  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();


  const filePath =
    orderId +
    "/" +
    Date.now() +
    "-preuve." +
    extension;


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

    const errorText =
      await response.text();


    throw new Error(
      "Impossible d'envoyer la preuve : " +
      errorText
    );

  }


  return filePath;

}


// =====================================
// CRÉER COMMANDE
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
          JSON.stringify(orderData)

      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();


    throw new Error(
      "Erreur lors de l'enregistrement de la commande : " +
      errorText
    );

  }


  const data =
    await response.json();


  return data[0];

}


// =====================================
// VÉRIFIER STATUT
// =====================================

let paymentCheckTimer =
  null;


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
              `${SUPABASE_URL}/rest/v1/commandes?id=eq.${encodeURIComponent(orderId)}&select=id,status,created_at,name,phone,commune,zone,items,total,payment_method`,
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
            "Vérification paiement :",
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

  const existing =
    document.getElementById(
      "rcReceiptBox"
    );


  if (existing)
    existing.remove();


  const items =
    Array.isArray(order.items)
      ? order.items
      : [];


  const itemsHtml =
    items.map(item => `

      <div style="
        display:flex;
        justify-content:space-between;
        gap:10px;
        margin:6px 0;
      ">

        <span>
          ${item.name} × ${item.qty}
        </span>

        <strong>
          ${money(
            item.price * item.qty
          )}
        </strong>

      </div>

    `).join("");


  const date =
    order.created_at
      ? new Date(
          order.created_at
        ).toLocaleString("fr-FR")
      : new Date()
          .toLocaleString("fr-FR");


  const receipt =
    document.createElement("div");


  receipt.id =
    "rcReceiptBox";


  receipt.style.position =
    "fixed";


  receipt.style.inset =
    "0";


  receipt.style.background =
    "rgba(0,0,0,.55)";


  receipt.style.zIndex =
    "99999";


  receipt.style.display =
    "flex";


  receipt.style.alignItems =
    "center";


  receipt.style.justifyContent =
    "center";


  receipt.style.padding =
    "18px";


  receipt.innerHTML = `

    <div
      id="rcReceiptContent"
      style="
        background:#fff;
        max-width:520px;
        width:100%;
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

        ${order.id}
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

        ${order.zone || ""}
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
        ${money(order.total || 0)}

      </h3>


      <p style="text-align:center">

        Merci pour votre achat
        chez RC STORE.

      </p>


      <div style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        justify-content:center;
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


  $("downloadReceiptBtn").onclick =
    () => downloadReceipt(order);


  $("closeReceiptBtn").onclick =
    () => receipt.remove();

}


// =====================================
// TÉLÉCHARGER REÇU
// =====================================

function downloadReceipt(
  order
) {

  const content =
    document.getElementById(
      "rcReceiptContent"
    );


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
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href =
    url;


  link.download =
    `recu-RC-STORE-${order.id}.txt`;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  URL.revokeObjectURL(url);

}


// =====================================
// BOUTONS
// =====================================

$("cartBtn").onclick =
  openCart;


$("overlay").onclick =
  closeModals;


document
  .querySelectorAll("[data-close]")
  .forEach(button => {

    button.onclick =
      closeModals;

  });


// =====================================
// RECHERCHE
// =====================================

$("searchInput").oninput =
  renderProducts;


$("searchBtn").onclick =
  renderProducts;


// =====================================
// CATÉGORIES
// =====================================

document
  .querySelectorAll(".nav-link")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(".nav-link")
        .forEach(item =>
          item.classList.remove(
            "active"
          )
        );


      button.classList.add(
        "active"
      );


      currentCategory =
        button.dataset.category;


      renderProducts();

    };

  });


// =====================================
// CHECKOUT
// =====================================

$("checkoutBtn").onclick = () => {

  if (!cart.length) {

    toast(
      "Votre panier est vide"
    );

    return;

  }


  $("cartDrawer")
    .classList.remove(
      "open"
    );


  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.qty,
      0
    );


  const quantity =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );


  $("checkoutSummary").innerHTML = `

    <div class="delivery-box">

      <strong>

        ${quantity} article(s)
        —
        ${money(total)}

      </strong>


      <span>

        🚚 Livraison estimée :
        1 à 2 jours selon la zone.

      </span>

    </div>

  `;


  $("checkoutModal")
    .classList.remove(
      "hidden"
    );


  $("overlay")
    .classList.remove(
      "hidden"
    );


  setupDeliveryFields();

  setupPaymentFields();

};


// =====================================
// CONFIRMATION COMMANDE
// =====================================

$("orderForm")
  .addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const formData =
        new FormData(this);


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

        toast(
          "Veuillez remplir tous les champs."
        );

        return;

      }


      const total =
        cart.reduce(
          (sum, item) =>
            sum +
            item.price *
            item.qty,
          0
        );


      const items =
        cart.map(item => ({

          id:
            item.id,

          name:
            item.name,

          price:
            item.price,

          qty:
            item.qty,

          category:
            item.category

        }));


      const isNatCash =
        payment
          .toLowerCase()
          .includes(
            "natcash"
          );


      if (isNatCash) {

        const proofInput =
          document.getElementById(
            "paymentProof"
          );


        if (
          !proofInput ||
          !proofInput.files ||
          !proofInput.files[0]
        ) {

          toast(
            "Veuillez ajouter la preuve de paiement NatCash."
          );

          return;

        }

      }


      const submitButton =
        this.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Enregistrement...";

      }


      try {

        const order =
          await createOrder({

            name:
              name,

            phone:
              phone,

            commune:
              commune,

            zone:
              area,

            items:
              items,

            total:
              total,

            payment_method:
              payment,

            payment_proof:
              null,

            status:
              "pending"

          });


        if (isNatCash) {

          const proofInput =
            document.getElementById(
              "paymentProof"
            );


          const proofFile =
            proofInput.files[0];


          const proofPath =
            await uploadPaymentProof(
              proofFile,
              order.id
            );


          const updateResponse =
            await fetch(
              `${SUPABASE_URL}/rest/v1/commandes?id=eq.${encodeURIComponent(order.id)}`,
              {

                method:
                  "PATCH",

                headers: {

                  "Content-Type":
                    "application/json",

                  "apikey":
                    SUPABASE_KEY,

                  "Authorization":
                    `Bearer ${SUPABASE_KEY}`,

                  "Prefer":
                    "return=minimal"

                },

                body:
                  JSON.stringify({

                    payment_proof:
                      proofPath

                  })

              }
            );


          if (!updateResponse.ok) {

            throw new Error(
              "La preuve a été envoyée, mais son enregistrement a échoué."
            );

          }

        }


        $("checkoutModal")
          .classList.add(
            "hidden"
          );


        $("overlay")
          .classList.add(
            "hidden"
          );


        alert(

          "Merci " +
          name +
          " ! Votre commande #" +
          order.id +
          " a été enregistrée.\n\n" +

          "Paiement : " +
          (
            isNatCash
              ? "preuve NatCash reçue"
              : payment
          ) +

          "\n\n" +

          "Votre paiement est maintenant en attente de vérification par RC STORE. " +

          "Vous recevrez le reçu dès que le paiement sera accepté."

        );


        startPaymentStatusCheck(
          order.id
        );


        cart = [];


        saveCart();


        this.reset();


        setupDeliveryFields();


      } catch (error) {

        console.error(
          error
        );


        alert(

          "Une erreur est survenue :\n\n" +
          error.message

        );

      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            "Confirmer la commande";

        }

      }

    }
  );


// =====================================
// DÉMARRAGE
// =====================================

renderProducts();

renderCart();

setupDeliveryFields();
