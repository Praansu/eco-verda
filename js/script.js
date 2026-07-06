// This array holds all the items people want to buy
var cart = [];

// Checking if there's an old cart saved in the browser so we don't lose it
var savedCart = localStorage.getItem('eco_cart');

// If we found a saved cart, turn it back into a list we can use
if (savedCart) {
    cart = JSON.parse(savedCart);
}

// When the page is finished loading, we show the current cart items
window.onload = function () {
    updateCartDisplay();
};

// This function adds a new item to the cart
// We need the name, how much it costs, its image, and which input box to check for quantity
function addToCart(name, price, image, inputId) {
    var input = document.getElementById(inputId);
    // If there's an input box, use that number. Otherwise, just add 1.
    var quantity = input ? parseInt(input.value) : 1;
    var found = false;

    // Checking if the item is already in the cart so we can just update the count
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].qty += quantity;
            found = true;
            break;
        }
    }

    // if it's a brand new item, add it to our list
    if (!found) {
        cart.push({ name: name, price: price, image: image, qty: quantity });
    }

    // Save our update and let the user know it worked
    saveCart();
    alert("Added " + quantity + " " + name + " to cart!");
    openCart();
}

// This function removes an item from the cart
function deleteItem(index) {
    // Delete the item at this position in the list
    cart.splice(index, 1);
    saveCart();
}

// This saves our cart to the browser's memory so it stays there even if the page refreshes
function saveCart() {
    localStorage.setItem('eco_cart', JSON.stringify(cart));
    updateCartDisplay();
}

// This is the big function that actually draws the cart on the screen
function updateCartDisplay() {
    var container = document.getElementById('cartItemsContainer');
    var totalElement = document.getElementById('cartTotal');
    var countElement = document.getElementById('cart-count');

    // If the cart container isn't on this page, just stop here
    if (!container) return;
    container.innerHTML = '';

    var total = 0;
    var itemCount = 0;

    // If the cart is empty, show a simple message
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty.</p>';
    } else {
        // Loop through everything in our cart list
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            // Calculating the total price and total number of items
            total += item.price * item.qty;
            itemCount += item.qty;

            // Creating the HTML to show each item's image, name, and price
            var itemDiv = document.createElement('div');
            itemDiv.style.display = "flex";
            itemDiv.style.alignItems = "center";
            itemDiv.style.marginBottom = "15px";
            itemDiv.style.borderBottom = "1px solid #eee";
            itemDiv.style.paddingBottom = "10px";

            // Adding the item info and an 'X' button to remove it
            itemDiv.innerHTML = '<img src="' + item.image + '" style="width:50px; height:50px; border-radius:5px; margin-right:10px;">' +
                '<div style="flex-grow:1;"><strong>' + item.name + '</strong><br>Rs. ' + item.price + ' x ' + item.qty + '</div>' +
                '<button onclick="deleteItem(' + i + ')" style="color:red; border:none; background:none; cursor:pointer; font-size: 20px;">&times;</button>';
            container.appendChild(itemDiv);
        }
    }

    // Updating the price and count numbers on the page
    if (totalElement) totalElement.textContent = "Rs. " + total.toFixed(2);
    if (countElement) countElement.textContent = itemCount;
}

// This function opens or closes the cart panel
function toggleCart() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.querySelector('.cart-overlay');

    // Switch between open and closed classes
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        overlay.style.display = 'none';
    } else {
        drawer.classList.add('open');
        overlay.style.display = 'block';
    }
}

// This is a helper function to make sure the cart is open
function openCart() {
    var drawer = document.getElementById('cartDrawer');
    if (drawer && !drawer.classList.contains('open')) toggleCart();
}

// This function handles the checkout button click
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // Clear the cart and save the empty list
    cart = [];
    saveCart();
    alert("Checkout successful! Thank you for your purchase.");
    toggleCart();
}
