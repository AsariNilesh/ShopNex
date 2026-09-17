// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("shopnexCart")) || [];

const count = document.getElementById("cart-count");
const buttons = document.querySelectorAll(".add-cart");
const cartBox = document.getElementById("cart-box");


// UPDATE CART COUNT

function updateCartCount() {

    if (!count) {
        return;
    }

    let totalItems = 0;

    cart.forEach(function (item) {
        totalItems += item.quantity;
    });

    count.innerText = totalItems;
}


// SAVE CART

function saveCart() {
    localStorage.setItem("shopnexCart", JSON.stringify(cart));
}


// ADD TO CART

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingItem = cart.find(function (item) {
            return item.id === id;
        });

        if (existingItem) {
            existingItem.quantity++;
        }

        // Add new product
        else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }

        saveCart();

        // Update number
        updateCartCount();
        
        showToast("Added to cart! 🛒");

        const originalText = button.innerText;

        button.innerText = "Added ✓";
        button.style.backgroundColor = "#16a34a";

        setTimeout(function () {
            button.innerText = originalText;
            button.style.backgroundColor = "";
        }, 1000);

    });

});


// SHOW CART

function showCart() {

    const oldPopup = document.getElementById("cart-popup");

    if (oldPopup) {
        oldPopup.remove();
        return;
    }

    const popup = document.createElement("div");

    popup.id = "cart-popup";
    popup.className = "cart-popup";

    // Empty cart
    if (cart.length === 0) {

        popup.innerHTML = `
            <div class="cart-header">
                <h2>Your Cart</h2>
                <button id="close-cart">×</button>
            </div>
            <p class="empty-cart">Your cart is empty 🛒</p>
        `;

    }
    // Cart has items
    else {

        let itemsHTML = "";
        let total = 0;

        cart.forEach(function (item) {

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            itemsHTML += `
                <div class="cart-item">
                    <div>
                        <h3>${item.name}</h3>
                        <p>₹${item.price} × ${item.quantity} = ₹${itemTotal}</p>
                    </div>
                    <div>
                        <button class="decrease" data-id="${item.id}">−</button>
                        <span> ${item.quantity} </span>
                        <button class="increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;

        });

        popup.innerHTML = `
            <div class="cart-header">
                <h2>Your Cart</h2>
                <button id="close-cart">×</button>
            </div>
            <div class="cart-items">
                ${itemsHTML}
            </div>
            <div class="cart-total">
                <h3>Total: ₹${total}</h3>
            </div>
            <button id="clear-cart">Clear Cart</button>
        `;

    }

    document.body.appendChild(popup);


    // CLOSE CART

    const closeButton = document.getElementById("close-cart");

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            popup.remove();
        });
    }

    // INCREASE ITEM
    const increaseButtons = document.querySelectorAll(".increase");

    increaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const itemId = button.dataset.id;

            const item = cart.find(function (i) {
                return i.id === itemId;
            });

            if (item) {
                item.quantity++;
                saveCart();
                updateCartCount();
                popup.remove();
                showCart();
            }

        });

    });

// DECREASE ITEM

    const decreaseButtons = document.querySelectorAll(".decrease");

    decreaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const itemId = button.dataset.id;

            const item = cart.find(function (i) {
                return i.id === itemId;
            });

            if (item) {

                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(function (i) {
                        return i.id !== itemId;
                    });
                }

                saveCart();
                updateCartCount();
                popup.remove();
                showCart();
            }

        });

    });


    // REMOVE ITEM

    const removeButtons = document.querySelectorAll(".remove-item");

    removeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const itemId = button.dataset.id;

            cart = cart.filter(function (item) {
                return item.id !== itemId;
            });

            saveCart();

            updateCartCount();

            popup.remove();
            showCart();

        });

    });


    // CLEAR CART

    const clearButton = document.getElementById("clear-cart");

    if (clearButton) {

        clearButton.addEventListener("click", function () {

            cart = [];

            saveCart();

            updateCartCount();

            popup.remove();

        });

    }

}


// CART ICON CLICK

if (cartBox) {

    cartBox.addEventListener("click", function () {
        showCart();
    });

}

updateCartCount();


// SEARCH BAR FILTER

const searchInput = document.getElementById("search-input");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const productCards = document.querySelectorAll(".product-card");

        productCards.forEach(function (card) {
            const productName = card.querySelector("h3").innerText.toLowerCase();

            if (productName.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}


// MOBILE MENU TOGGLE

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");

        if (navMenu.classList.contains("active")) {
            menuToggle.innerText = "✕";
        } else {
            menuToggle.innerText = "☰";
        }
    });
}


// CONTACT FORM SUBMIT

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        showToast("✅ Message sent successfully!");
        contactForm.reset();
    });
}

// TOAST NOTIFICATION

function showToast(message) {
    const oldtoast =document.querySelector(".toast");

    if(oldtoast){
        oldtoast.remove();
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText=message;

    document.body.appendChild(toast);

    setTimeout(function(){
        toast.remove();

    },2000);
}