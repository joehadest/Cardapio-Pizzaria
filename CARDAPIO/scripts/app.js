const pizzaItems = [
    { name: "Margherita", description: "Pizza clássica com molho de tomate e mussarela.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Pepperoni", description: "Pepperoni picante com queijo mussarela.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Vegetariana", description: "Carregada com vegetais frescos e mussarela.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Quatro Queijos", description: "Deliciosa combinação de quatro queijos.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Frango com Catupiry", description: "Frango desfiado com catupiry.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Calabresa", description: "Calabresa fatiada com cebola.", prices: { P: 25, M: 30, G: 35 } },
];

const drinkItems = [
    { name: "Coca-Cola", description: "Refrigerante de cola.", prices: { "350ML": 5, "1L": 6, "2L": 10 } },
    { name: "Guaraná", description: "Refrigerante de guaraná.", prices: { "350ML": 5, "1L": 6, "2L": 10 } },
    { name: "Fanta Laranja", description: "Refrigerante de laranja.", prices: { "350ML": 5, "1L": 6, "2L": 10 } },
    { name: "Água Mineral", description: "Água mineral sem gás.", prices: { "350ML": 2 } },
];

const burgerItems = [
    { name: "Cheeseburger", description: "Hambúrguer com queijo, alface, tomate e molho especial.", price: 20 },
    { name: "Bacon Burger", description: "Hambúrguer com bacon crocante, queijo e molho barbecue.", price: 25 },
    { name: "Veggie Burger", description: "Hambúrguer vegetariano com legumes grelhados e molho de iogurte.", price: 18 },
];

const sushiItems = [
    { name: "Combo 8 Peças", description: "8 peças de sushi.", price: 20 },
    { name: "Combo 10 Peças", description: "10 peças de sushi.", price: 25 },
    { name: "Combo 20 Peças", description: "20 peças de sushi.", price: 50 },
    { name: "Combo 30 Peças", description: "30 peças de sushi.", price: 75 },
    { name: "Combo 40 Peças", description: "40 peças de sushi.", price: 100 },
    { name: "Combo 50 Peças", description: "50 peças de sushi.", price: 125 },
];

const snackItems = [
    { name: "Batata Frita", description: "Porção de batata frita crocante.", price: 10 },
    { name: "Onion Rings", description: "Anéis de cebola empanados e fritos.", price: 12 },
    { name: "Frango a Passarinho", description: "Porção de frango a passarinho.", price: 15 },
];

function displayItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';

        // Criar ID seguro para o select removendo espaços e caracteres especiais
        const safeId = item.name.replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const priceHTML = containerId === 'pizza-list' || containerId === 'drink-list'
            ? `
                <select id="size-${safeId}" class="item-size">
                    ${Object.entries(item.prices).map(([size, price]) =>
                `<option value="${size}">${size} - R$${price.toFixed(2)}</option>`
            ).join('')}
                </select>
            `
            : `<p class="item-price">R$${item.price.toFixed(2)}</p>`;

        itemElement.innerHTML = `
            <div class="item-header">
                <div class="item-icon"></div>
                <h3>${item.name}</h3>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-options">
                ${priceHTML}
            </div>
            <button onclick="handleAddToCart('${safeId}', '${containerId}', '${item.name}', event)">
                <i class="fas fa-cart-plus"></i>
                Adicionar ao Carrinho
            </button>
        `;

        container.appendChild(itemElement);
    });
}

function handleAddToCart(safeId, containerId, originalName, event) {
    let price;
    let size = '';

    if (containerId === 'pizza-list') {
        const sizeSelect = document.querySelector(`#size-${safeId}`);
        size = sizeSelect.value;
        const pizza = pizzaItems.find(p => p.name === originalName);
        price = Number(pizza.prices[size]);
    } else if (containerId === 'drink-list') {
        const sizeSelect = document.querySelector(`#size-${safeId}`);
        size = sizeSelect.value;
        const drink = drinkItems.find(d => d.name === originalName);
        price = Number(drink.prices[size]);
    } else {
        const allItems = [...burgerItems, ...sushiItems, ...snackItems];
        const item = allItems.find(i => i.name === originalName);
        price = Number(item.price);
    }

    // Use a unique id based on timestamp if needed
    const newItem = {
        id: Date.now().toString(),
        name: originalName,
        size: size,
        price: price,
        quantity: 1
    };
    window.cart.push(newItem);

    // Refresh cart display (updateCartDisplay is defined in cart.js)
    updateCartDisplay();

    // Optional: show add-to-cart feedback and flying animation
    createFlyingItem(event);
    toggleCartSidebar(true);
}

// ADD: Function to create flying animation when adding an item
function createFlyingItem(event) {
    const buttonRect = event.target.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-btn');
    if (!cartIcon) return;
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    // Start at the button's position
    flyingItem.style.left = `${buttonRect.left}px`;
    flyingItem.style.top = `${buttonRect.top}px`;

    // Set CSS variables for animation keyframes
    flyingItem.style.setProperty('--start-x', `${buttonRect.left}px`);
    flyingItem.style.setProperty('--start-y', `${buttonRect.top}px`);
    flyingItem.style.setProperty('--end-x', `${cartRect.left}px`);
    flyingItem.style.setProperty('--end-y', `${cartRect.top}px`);

    document.body.appendChild(flyingItem);

    flyingItem.addEventListener('animationend', () => {
        flyingItem.remove();
    });
}

function updatePrice(itemName, size) {
    const item = pizzaItems.find(p => p.name === itemName);
    const priceElement = document.getElementById(`price-${itemName}`);
    priceElement.innerText = `Preço: R$${item.prices[size]}`;
}

function updateDrinkPrice(name, size) {
    const item = drinkItems.find(drink => drink.name === name);
    const priceElement = document.getElementById(`price-${name}`);
    priceElement.textContent = `Preço: R$${item.prices[size]}`;
}

function placeOrder() {
    const address = document.getElementById('address').value;
    let phone = document.getElementById('phone').value;
    if (address === '') {
        alert('Por favor, insira o endereço de entrega.');
        return;
    }
    if (phone === '') {
        alert('Por favor, insira o número de WhatsApp.');
        return;
    }

    phone = cleanPhoneNumber(phone);

    let orderDetails = `Pedido realizado com sucesso! Entregaremos em: ${address}\n\nDetalhes do pedido:\n`;
    cart.forEach(item => {
        orderDetails += `${item.name} ${item.size ? `(${item.size})` : ''} - R$${item.price}\n`;
    });
    orderDetails += `\nTotal: R$${cart.reduce((total, item) => total + item.price, 0)}`;

    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappLink, '_blank');

    cart = [];
    updateCart();
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
}

function cleanPhoneNumber(phone) {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11 && phone[2] === '9') {
        phone = phone.slice(0, 2) + phone.slice(3);
    }
    if (!phone.startsWith('55')) {
        phone = '55' + phone;
    }
    return phone;
}

function adjustCartHeight() {
    document.addEventListener('DOMContentLoaded', () => {
        const cart = document.getElementById('cart');
        if (!cart) return;

        const originalHeight = cart.style.height || 'calc(100vh - 180px)';

        const updateHeight = () => {
            if (window.innerHeight < parseInt(originalHeight)) {
                cart.style.height = `${window.innerHeight - 20}px`;
            } else {
                cart.style.height = originalHeight;
            }
        };

        window.addEventListener('resize', updateHeight);
        updateHeight(); // Initial adjustment
    });
}

// Call the function
adjustCartHeight();

// Adicione a função restoreState para evitar o erro de referência
function restoreState() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        window.cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
    const lastCategory = localStorage.getItem('lastCategory');
    if (lastCategory) {
        showTab(lastCategory);
    }
}

function updateCartDisplay() {
    // Implement the logic to update the cart display
}

function showAddToCartFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = '<i class="fas fa-check"></i> Item adicionado ao carrinho';

    document.body.appendChild(feedback);

    // Force reflow
    feedback.offsetHeight;

    // Show feedback
    feedback.classList.add('show');

    // Remove feedback after animation
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function () {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const cashInfo = document.querySelector('.cash-info');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function () {
            if (this.value === 'cash') {
                cashInfo.classList.add('show');
            } else {
                cashInfo.classList.remove('show');
            }
        });
    });

    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const target = this.getAttribute('onclick').split("'")[1];
            tabContents.forEach(content => {
                if (content.id === target) {
                    content.classList.add('show');
                } else {
                    content.classList.remove('show');
                }
            });
        });
    });

    adjustForKeyboard();
    handleHeaderVisibility();
    displayItems(pizzaItems, 'pizza-list');
    displayItems(drinkItems, 'drink-list');
    displayItems(burgerItems, 'burger-list');
    displayItems(sushiItems, 'sushi-list');
    displayItems(snackItems, 'snack-list');
    restoreState();
});