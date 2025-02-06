const pizzaItems = [
    { name: "Margherita", description: "Pizza clássica com molho de tomate e mussarela.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Pepperoni", description: "Pepperoni picante com queijo mussarela.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Vegetariana", description: "Carregada com vegetais frescos e mussarela.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Quatro Queijos", description: "Deliciosa combinação de quatro queijos.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Frango com Catupiry", description: "Frango desfiado com catupiry.", prices: { P: 25, M: 30, G: 35 } },
    { name: "Calabresa", description: "Calabresa fatiada com cebola.", prices: { P: 25, M: 30, G: 35 } },
];

const drinkItems = [
    { name: "Coca-Cola", description: "Refrigerante de cola.", price: 8 },
    { name: "Guaraná", description: "Refrigerante de guaraná.", price: 8 },
    { name: "Fanta Laranja", description: "Refrigerante de laranja.", price: 8 },
    { name: "Água Mineral", description: "Água mineral sem gás.", price: 8 },
];

let cart = [];

function displayItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            ${containerId === 'pizza-list' ? `
            <label for="size-${item.name}">Escolha o tamanho:</label>
            <select id="size-${item.name}" class="item-size" onchange="updatePrice('${item.name}', this.value)">
                <option value="P">Pequena (4 fatias) - R$${item.prices.P}</option>
                <option value="M">Média (6 fatias) - R$${item.prices.M}</option>
                <option value="G">Grande (8 fatias) - R$${item.prices.G}</option>
            </select>
            <p id="price-${item.name}">Preço: R$${item.prices.P}</p>` : `
            <p>Preço: R$${item.price}</p>`}
            <button onclick="addToCart('${item.name}', '${containerId}')">Adicionar ao Carrinho</button>
        `;
        container.appendChild(itemElement);
    });
}

function updatePrice(itemName, size) {
    const item = pizzaItems.find(p => p.name === itemName);
    const priceElement = document.getElementById(`price-${itemName}`);
    priceElement.innerText = `Preço: R$${item.prices[size]}`;
}

function searchItems() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredPizzas = pizzaItems.filter(pizza => pizza.name.toLowerCase().includes(searchInput));
    const filteredDrinks = drinkItems.filter(drink => drink.name.toLowerCase().includes(searchInput));
    displayItems(filteredPizzas, 'pizza-list');
    displayItems(filteredDrinks, 'drink-list');
}

function addToCart(itemName, containerId) {
    const size = containerId === 'pizza-list' ? document.getElementById(`size-${itemName}`).value : '';
    const item = containerId === 'pizza-list' ? pizzaItems.find(p => p.name === itemName) : drinkItems.find(d => d.name === itemName);
    const price = containerId === 'pizza-list' ? item.prices[size] : item.price;
    cart.push({ ...item, size, price });
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `${item.name} ${item.size ? `(${item.size})` : ''} - R$${item.price} <button onclick="removeFromCart(${index})">Remover</button>`;
        cartItems.appendChild(cartItem);
    });
    const totalElement = document.getElementById('total');
    totalElement.innerText = `Total: R$${total}`;
}

function placeOrder() {
    const address = document.getElementById('address').value;
    if (address === '') {
        alert('Por favor, insira o endereço de entrega.');
        return;
    }
    alert(`Pedido realizado com sucesso! Entregaremos em: ${address}`);
    cart = [];
    updateCart();
    document.getElementById('address').value = '';
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'flex';
}

// Display all items on initial load
document.addEventListener('DOMContentLoaded', () => {
    displayItems(pizzaItems, 'pizza-list');
    displayItems(drinkItems, 'drink-list');
});