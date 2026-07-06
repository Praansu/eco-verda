var cart = [];
var savedCart = localStorage.getItem('eco_cart');

if (savedCart) {
    cart = JSON.parse(savedCart);
}

window.onload = function () {
    updateCartDisplay();
};

function addToCart(name, price, image, inputId) {
    var input = document.getElementById(inputId);
    var quantity = input ? parseInt(input.value) : 1;
    var found = false;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].qty += quantity;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({ name: name, price: price, image: image, qty: quantity });
    }

    saveCart();
    alert("Added " + quantity + " " + name + " to cart!");
    openCart();
}

function deleteItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function saveCart() {
    localStorage.setItem('eco_cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    var container = document.getElementById('cartItemsContainer');
    var totalElement = document.getElementById('cartTotal');
    var countElement = document.getElementById('cart-count');

    if (!container) return;
    container.innerHTML = '';

    var total = 0;
    var itemCount = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty.</p>';
    } else {
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            total += item.price * item.qty;
            itemCount += item.qty;

            var itemDiv = document.createElement('div');
            itemDiv.style.display = "flex";
            itemDiv.style.alignItems = "center";
            itemDiv.style.marginBottom = "15px";
            itemDiv.style.borderBottom = "1px solid #eee";
            itemDiv.style.paddingBottom = "10px";

            itemDiv.innerHTML = '<img src="' + item.image + '" style="width:50px; height:50px; border-radius:5px; margin-right:10px;">' +
                '<div style="flex-grow:1;"><strong>' + item.name + '</strong><br>Rs. ' + item.price + ' x ' + item.qty + '</div>' +
                '<button onclick="deleteItem(' + i + ')" style="color:red; border:none; background:none; cursor:pointer; font-size: 20px;">&times;</button>';
            container.appendChild(itemDiv);
        }
    }

    if (totalElement) totalElement.textContent = "Rs. " + total.toFixed(2);
    if (countElement) countElement.textContent = itemCount;
}

function toggleCart() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.querySelector('.cart-overlay');

    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        overlay.style.display = 'none';
    } else {
        drawer.classList.add('open');
        overlay.style.display = 'block';
    }
}

function openCart() {
    var drawer = document.getElementById('cartDrawer');
    if (drawer && !drawer.classList.contains('open')) toggleCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    cart = [];
    saveCart();
    alert("Checkout successful! Thank you for your purchase.");
    toggleCart();
}
