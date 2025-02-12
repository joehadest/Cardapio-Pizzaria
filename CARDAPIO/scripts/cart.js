let cart = [];
const cartItemsContainer = document.querySelector('.cart-items');
const cartCountElement = document.querySelector('.cart-count');
const cartTotalElement = document.getElementById('cart-total');

function initializeCart() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    if (!cartItemsContainer) {
        console.error('Cart items container not found! Retrying...');
        // Retry initialization after DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            const retryContainer = document.querySelector('.cart-items');
            if (retryContainer) {
                cartItemsContainer = retryContainer;
                setupCartListeners();
                updateCartDisplay();
            } else {
                console.error('Failed to initialize cart after retry');
            }
        });
        return;
    }

    setupCartListeners();
    updateCartDisplay();
}

function setupCartListeners() {
    if (!cartItemsContainer) return;

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('quantity-btn')) {
            const itemId = target.closest('.cart-item').dataset.id;
            if (target.classList.contains('increase')) {
                updateQuantity(itemId, 1);
            } else if (target.classList.contains('decrease')) {
                updateQuantity(itemId, -1);
            }
        } else if (target.classList.contains('remove-item')) {
            const itemId = target.closest('.cart-item').dataset.id;
            removeFromCart(itemId);
        }
    });
}

function updateCartDisplay() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li class="empty-cart">Seu carrinho está vazio</li>';
    } else {
        cart.forEach(item => {
            const itemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(itemElement);
            total += item.price * (item.quantity || 1);
        });
    }

    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
    if (cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function createCartItemElement(item) {
    const itemElement = document.createElement('li');
    itemElement.className = 'cart-item';
    itemElement.dataset.id = item.id || Date.now().toString();

    itemElement.innerHTML = `
        <div class="cart-item-info">
            <span class="cart-item-title">${item.name}</span>
            ${item.size ? `<span class="cart-item-size">${item.size}</span>` : ''}
            <span class="cart-item-price">R$ ${Number(item.price).toFixed(2)}</span>
        </div>
        <div class="cart-item-quantity">
            <button class="quantity-btn decrease" onclick="updateQuantity('${itemElement.dataset.id}', -1)">-</button>
            <span>${item.quantity || 1}</span>
            <button class="quantity-btn increase" onclick="updateQuantity('${itemElement.dataset.id}', 1)">+</button>
            <button class="remove-item" onclick="removeFromCart('${itemElement.dataset.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    return itemElement;
}

function removeFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartDisplay();
        // Optionally: show removal feedback animation here if desired
    }
}

// Initialize cart when script loads
initializeCart();

// Export functions that need to be accessible from other scripts
window.addToCart = function (item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartDisplay();
};

window.toggleCartSidebar = function (show) {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const body = document.body;

    if (cartSidebar) {
        if (typeof show === 'boolean') {
            cartSidebar.classList.toggle('show', show);
            body.classList.toggle('cart-open', show);
        } else {
            cartSidebar.classList.toggle('show');
            body.classList.toggle('cart-open');
        }

        // Prevent scroll on body when cart is open
        if (cartSidebar.classList.contains('show')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
};

// Add this new function for checkout redirection
window.goToCheckout = function () {
    // First ensure cart stays open
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('show');
    }

    // Then show checkout section after a short delay
    setTimeout(() => {
        toggleCheckoutSection(true);
        // Optionally close cart sidebar after checkout is shown
        cartSidebar.classList.remove('show');
    }, 300);
};

// Add these event listeners at the bottom of the file
document.addEventListener('DOMContentLoaded', function () {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeBtn = cartSidebar?.querySelector('.close-btn');

    // Prevent touch events from bubbling up
    cartSidebar?.addEventListener('touchmove', function (e) {
        e.stopPropagation();
    }, { passive: true });

    cartSidebar?.addEventListener('click', function (e) {
        if (e.target === cartSidebar) {
            toggleCartSidebar(false);
        }
    });

    closeBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCartSidebar(false);
    });
});
