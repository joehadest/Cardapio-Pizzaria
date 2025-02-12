document.addEventListener('DOMContentLoaded', function () {
    // Inicializar carrinho
    window.cart = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Setup dos eventos principais
    setupSidebar();
    setupCategories();
    setupCart();
    setupHeaderBehavior();
    setupHeaderScroll();

    // Display inicial dos itens
    displayItems(pizzaItems, 'pizza-list');
    displayItems(drinkItems, 'drink-list');
    displayItems(burgerItems, 'burger-list');
    displayItems(sushiItems, 'sushi-list');
    displayItems(snackItems, 'snack-list');

    // Atualizar display do carrinho
    updateCartDisplay();
    updateCartCount();

    // Restaurar estado do carrinho
    window.cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartDisplay();

    // Mostrar primeira categoria por padrão
    showTab('pizza-list');

    // Inicializar eventos do dropdown
    const categoriesButton = document.querySelector('.categories-button');
    if (categoriesButton) {
        categoriesButton.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleDropdown();
        });
    }
});

function setupSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const openBtn = document.querySelector('.open-btn');
    const closeBtn = document.querySelector('.sidebar .close-btn');

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar') &&
            !e.target.closest('.open-btn') &&
            sidebar?.classList.contains('show')) {
            toggleSidebar(false);
        }
    });

    openBtn?.addEventListener('click', () => toggleSidebar(true));
    closeBtn?.addEventListener('click', () => toggleSidebar(false));
}

function setupCategories() {
    const categoriesBtn = document.querySelector('.categories-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    categoriesBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.querySelectorAll('#dropdown-menu li').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(category);
            toggleDropdown();
        });
    });
}

function setupCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.cart-sidebar .close-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');

    cartBtn?.addEventListener('click', () => toggleCartSidebar(true));
    closeCartBtn?.addEventListener('click', () => toggleCartSidebar(false));
    checkoutBtn?.addEventListener('click', goToCheckout);

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cart-sidebar') &&
            !e.target.closest('.cart-btn') &&
            cartSidebar?.classList.contains('show')) {
            toggleCartSidebar(false);
        }
    });

    // Remover o footer duplicado
    const cartFooter = cartSidebar.querySelector('.cart-footer');
    if (cartFooter) {
        const oldTotal = cartFooter.querySelector('#cart-total');
        if (oldTotal) {
            oldTotal.remove();
        }
    }
}

function goToCheckout() {
    const cart = document.querySelector('.cart-sidebar');
    const checkoutSection = document.getElementById('checkout-section');

    if (window.cart.length === 0) {
        alert('Adicione itens ao carrinho antes de finalizar o pedido!');
        return;
    }

    // Mostra a seção de checkout
    checkoutSection.style.display = 'block';

    // Preenche o resumo do pedido
    const orderSummary = document.getElementById('order-summary');
    let summaryHTML = '<h3>Resumo do Pedido</h3>';
    let total = 0;

    window.cart.forEach(item => {
        summaryHTML += `
            <div class="order-item">
                <span>${item.name} ${item.size ? `(${item.size})` : ''}</span>
                <span>R$${item.price.toFixed(2)}</span>
            </div>
        `;
        total += item.price;
    });

    summaryHTML += `
        <div class="order-total">
            <strong>Total:</strong>
            <strong>R$${total.toFixed(2)}</strong>
        </div>
    `;

    orderSummary.innerHTML = summaryHTML;

    // Fecha o carrinho
    cart.classList.remove('show');

    // Scroll suave até a seção de checkout
    checkoutSection.scrollIntoView({ behavior: 'smooth' });
}

function setupHeaderBehavior() {
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.style.top = currentScroll > lastScroll ? '-60px' : '0';
        lastScroll = currentScroll;
    });
}

function setupHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function showTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');

    // Primeiro, iniciamos a animação de saída
    tabContents.forEach(content => {
        if (content.classList.contains('show')) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
        }
    });

    // Aguardamos a animação de saída terminar
    setTimeout(() => {
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('show');
        });

        // Mostramos a nova categoria
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.style.display = 'grid';
            // Força um reflow
            selectedTab.offsetHeight;
            selectedTab.classList.add('show');

            // Anima os itens individualmente
            const items = selectedTab.getElementsByClassName('item');
            Array.from(items).forEach((item, index) => {
                item.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
            });
        }

        // Salvar a categoria atual
        localStorage.setItem('lastCategory', tabId);
    }, 300);

    // Fechar dropdown após selecionar
    toggleDropdown();
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    const currentDisplay = dropdownMenu.style.display;

    if (currentDisplay === 'none' || currentDisplay === '') {
        dropdownMenu.style.display = 'block';
        dropdownMenu.classList.add('show');
    } else {
        dropdownMenu.style.display = 'none';
        dropdownMenu.classList.remove('show');
    }
}

function adjustForKeyboard() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            document.body.classList.add('keyboard-open');
        });
        input.addEventListener('blur', () => {
            document.body.classList.remove('keyboard-open');
        });
    });
}

function handleHeaderVisibility() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const welcomeMessage = document.querySelector('.welcome-message');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.style.top = '-60px'; // Adjust as needed
            welcomeMessage.style.top = '-60px'; // Adjust as needed
        } else {
            header.style.top = '0';
            welcomeMessage.style.top = '60px'; // Adjust as needed
        }
        lastScrollTop = scrollTop;
    });
}

// Array para armazenar os itens do carrinho
let cartItems = [];

// Função para adicionar item ao carrinho
function addToCart(itemName, price) {
    cartItems.push({ name: itemName, price: parseFloat(price) });
    updateCart();
}

// Função para remover item do carrinho
function removeFromCart(index) {
    // Garantir que o cart está inicializado
    if (!window.cart) {
        window.cart = [];
        return;
    }

    // Obter elementos necessários
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('#cart-total');
    const cartCount = document.querySelector('.cart-count');

    if (!cartItems || !cartTotal || !cartCount) {
        console.warn('Elementos do carrinho não encontrados');
        return;
    }

    try {
        // Remove o item do array
        window.cart.splice(index, 1);

        // Atualiza o HTML do carrinho
        let total = 0;
        cartItems.innerHTML = '';

        window.cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    ${item.size ? `<span class="cart-item-size">${item.size}</span>` : ''}
                    <span class="cart-item-price">R$${item.price.toFixed(2)}</span>
                </div>
                <button type="button" class="remove-item-btn" onclick="removeFromCart(${idx})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(li);
            total += Number(item.price);
        });

        // Atualiza o total e o contador
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = window.cart.length;
        cartCount.style.display = window.cart.length > 0 ? 'flex' : 'none';

        // Salva no localStorage
        localStorage.setItem('cartItems', JSON.stringify(window.cart));

    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
    }
}

// Função para alternar a visibilidade do carrinho
function toggleCartSidebar(show) {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const body = document.body;

    if (!cartSidebar) return;

    if (show) {
        cartSidebar.classList.add('show');
        body.style.overflow = 'hidden';
        updateCartDisplay();
    } else {
        cartSidebar.classList.remove('show');
        body.style.overflow = 'auto';
    }
}

function updateCartDisplay() {
    const cartList = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartList || !cartTotal) return;

    cartList.innerHTML = '';
    let total = 0;

    window.cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center w-100">
                <span>${item.name} ${item.size ? `(${item.size})` : ''}</span>
                <div class="d-flex align-items-center">
                    <span class="me-3">R$ ${item.price.toFixed(2)}</span>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        cartList.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = total.toFixed(2);
}

function toggleSidebar(show) {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;

    if (!sidebar) return;

    if (typeof show === 'boolean') {
        sidebar.classList.toggle('show', show);
    } else {
        sidebar.classList.toggle('show');
    }

    if (sidebar.classList.contains('show')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const count = window.cart.length;
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';

        // Adiciona animação quando o contador é atualizado
        cartCount.classList.remove('cart-bump');
        void cartCount.offsetWidth; // Força um reflow
        cartCount.classList.add('cart-bump');
    }
}

function goToMainMenu() {
    // Mostra a primeira categoria (pizza-list) sem abrir o dropdown
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('show');
    });

    const pizzaList = document.getElementById('pizza-list');
    if (pizzaList) {
        pizzaList.style.display = 'grid';
        pizzaList.classList.add('show');
    }

    // Fecha o dropdown se estiver aberto
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
        dropdownMenu.classList.remove('show');
    }

    // Fecha o carrinho se estiver aberto
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar.classList.contains('show')) {
        cartSidebar.classList.remove('show');
    }

    // Fecha o menu lateral se estiver aberto
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    }

    // Rola suavemente para o topo
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
