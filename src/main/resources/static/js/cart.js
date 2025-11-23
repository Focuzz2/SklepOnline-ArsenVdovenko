document.addEventListener("DOMContentLoaded", () => {
    // Елементи кошика
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartButton = document.getElementById('cart-button-floating');
    const closeCartSidebar = document.getElementById('close-cart-sidebar');
    const cartList = document.getElementById('cart-list');
    const cartTotalDisplay = document.getElementById('cart-total');
    const cartCountDisplay = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Глобальна змінна для кошика
    let cart = {}; 

    // Отримання товарів з API і рендеринг
    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = ''; 

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="price">${product.price.toFixed(2)} PLN</p>
                    <button data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Dodaj do koszyka</button>
                `;
                productsContainer.appendChild(card);
            });

            // Додаємо слухачів до нових кнопок
            productsContainer.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', addToCart);
            });

        } catch (error) {
            console.error('Błąd ładowania produktów:', error);
        }
    }

    loadProducts(); // Завантажуємо продукти при старті

    // Функція додавання в кошик
    function addToCart(e) {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);

        if (cart[id]) {
            cart[id].quantity += 1;
        } else {
            cart[id] = { id, name, price, quantity: 1 };
        }
        renderCart();
    }

    // Функція рендерингу кошика
    function renderCart() {
        cartList.innerHTML = '';
        let total = 0;
        let count = 0;

        for (const id in cart) {
            const item = cart[id];
            const li = document.createElement('li');
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;

            li.innerHTML = `
                ${item.name} (${item.quantity} szt.) - ${(itemTotal).toFixed(2)} PLN
                <button data-id="${id}" class="remove-item">&times;</button>
            `;
            cartList.appendChild(li);
        }

        cartTotalDisplay.textContent = `Suma: ${total.toFixed(2)} PLN`;
        cartCountDisplay.textContent = count;
    }

    // Обробник для видалення товару з кошика
    cartList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            if (cart[id].quantity > 1) {
                cart[id].quantity -= 1;
            } else {
                delete cart[id];
            }
            renderCart();
        }
    });

    // ===========================================
    // ЛОГІКА ВІДКРИТТЯ/ЗАКРИТТЯ ТА ЧЕКАУТУ (НОВЕ)
    // ===========================================

    // Відкриття кошика
    cartButton.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        document.getElementById('main-content').classList.add('shrink-cart');
        
        // Скидаємо стан форми при відкритті кошика
        checkoutButton.style.display = 'block';
        checkoutFormContainer.style.display = 'none';
        checkoutForm.reset();
        
        renderCart();
    });

    // Закриття кошика
    closeCartSidebar.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        document.getElementById('main-content').classList.remove('shrink-cart');
    });

    // 1. Натискання на "Opłać" (Початок оформлення)
    checkoutButton.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            alert("Koszyk jest pusty! Dodaj coś przed opłaceniem.");
            return;
        }
        // Ховаємо кнопку Opłać і показуємо форму
        checkoutButton.style.display = 'none'; 
        checkoutFormContainer.style.display = 'block';
    });

    // 2. Натискання на "Potwierdź zamówienie" (Фінальна дія)
    checkoutForm.addEventListener('submit', async (e) => { // Змінюємо на async
        e.preventDefault(); // Запобігаємо стандартній відправці форми

        const customerData = {
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            address: document.getElementById('customer-address').value,
            phone: document.getElementById('customer-phone').value,
        };

        const orderDetails = {
            customer: customerData,
            items: Object.values(cart).map(item => ({ 
                productId: item.id, 
                quantity: item.quantity,
                price: item.price
            })), // Адаптуємо структуру для бекенду
            total: parseFloat(cartTotalDisplay.textContent.replace('Suma: ', '').replace(' PLN', '')),
        };
        
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });

            if (response.ok) {
                alert(`Zamówienie przyjęte! Dziękujemy, ${customerData.name}.`);
                // Очищення кошика та скидання UI
                cart = {};
                renderCart();
                checkoutForm.reset();
                
                // Повертаємо UI у початковий стан
                cartSidebar.classList.remove('open');
                document.getElementById('main-content').classList.remove('shrink-cart');
                checkoutButton.style.display = 'block';
                checkoutFormContainer.style.display = 'none';
            } else {
                const errorData = await response.json();
                alert(`Błąd zamówienia: ${errorData.message || response.statusText}`);
            }

        } catch (error) {
            console.error('Błąd wysyłania zamówienia:', error);
            alert('Wystąpił nieoczekiwany błąd podczas wysyłania zamówienia.');
        }
    });
});