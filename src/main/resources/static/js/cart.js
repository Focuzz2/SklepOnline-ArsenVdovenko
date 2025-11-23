document.addEventListener("DOMContentLoaded", () => {
    // Елементи кошика (Ваші елементи)
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

    // ===========================================
    // 1. ФУНКЦІЯ КАСТОМНОГО АЛЕРТУ (Додано)
    // ===========================================
    
    // Створює та відображає просте, модальне вікно alertu (для кращого вигляду, ніж системний alert)
    function showCustomAlert(message) {
        const modalId = 'custom-alert-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'custom-modal'; // Додайте стилі в CSS для .custom-modal та .modal-content
            modal.innerHTML = `
                <div class="modal-content">
                    <p id="alert-message"></p>
                    <button id="alert-ok-button">OK</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('#alert-ok-button').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        modal.querySelector('#alert-message').textContent = message;
        modal.style.display = 'flex';
    }


    // ===========================================
    // 2. ФУНКЦІЇ ПРОДУКТІВ ТА КОРЗИНА (Ваша логіка)
    // ===========================================

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

            productsContainer.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', addToCart);
            });

        } catch (error) {
            console.error('Błąd ładowania produktów:', error);
        }
    }

    loadProducts();

    // Функція додавання в кошик
    function addToCart(e) {
        const id = parseInt(e.target.dataset.id); // Парсимо ID як число
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);

        if (cart[id]) {
            cart[id].quantity += 1;
        } else {
            cart[id] = { productId: id, name, price, quantity: 1 }; // Змінено на productId для бекенду
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
    // 3. ЛОГІКА ВІДКРИТТЯ/ЗАКРИТТЯ ТА ЧЕКАУТУ
    // ===========================================

    // Відкриття кошика
    cartButton.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        document.getElementById('main-content').classList.add('shrink-cart');
        
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
            showCustomAlert("Koszyk jest pusty! Dodaj coś przed opłaceniem."); // Змінено alert на showCustomAlert
            return;
        }
        checkoutButton.style.display = 'none'; 
        checkoutFormContainer.style.display = 'block';
    });

    // 2. Натискання на "Potwierdź zamówienie" (Фінальна дія)
    checkoutForm.addEventListener('submit', async (e) => { // Додано 'async'
        e.preventDefault(); 

        const itemsArray = Object.values(cart);

        if (itemsArray.length === 0) {
            showCustomAlert("Koszyk jest pusty! Nie można złożyć zamówienia.");
            return;
        }

        // 1. Збір даних
        const customerData = {
            name: document.getElementById('customer-name').value.trim(),
            email: document.getElementById('customer-email').value.trim(),
            address: document.getElementById('customer-address').value.trim(),
            phone: document.getElementById('customer-phone').value.trim(),
        };

        const totalValue = parseFloat(cartTotalDisplay.textContent.replace('Suma: ', '').replace(' PLN', ''));
        
        // Мапування об'єкта кошика на масив DTO
        const itemsDTO = itemsArray.map(item => ({
            productId: item.productId, // Використовуємо поле productId
            quantity: item.quantity,
            price: item.price // Ціна одиниці
        }));

        const orderDetails = {
            customer: customerData,
            items: itemsDTO,
            total: totalValue,
        };
        
        console.log('Dane zamówienia do wysłania:', orderDetails);

        // 2. ВІДПРАВКА НА БЕКЕНД (Виправлено)
        try {
            const response = await fetch('/api/orders', { // <-- ВИПРАВЛЕНИЙ ШЛЯХ (Усуває 404)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });

            if (response.status === 201) {
                // УСПІХ: Замовлення прийнято
                showCustomAlert(`Zamówienie przyjęte! Dziękujemy, ${customerData.name}.`);
                
                // Очищення кошика та UI
                cart = {};
                renderCart();
                checkoutForm.reset();
                
            } else if (response.status === 400) {
                // ПОМИЛКА: Продукт не знайдено (відкат транзакції)
                showCustomAlert('Błąd zamówienia! Niektóre produkty mogły zostać usunięte z magazynu. Proszę spróbować ponownie.');
            } else {
                // Інші помилки (403, 500)
                showCustomAlert(`Wystąpił nieoczekiwany błąd (Status: ${response.status}). Spróbuj ponownie.`);
            }

        } catch (error) {
            console.error('Błąd komunikacji z serwerem:', error);
            showCustomAlert('Błąd: Nie udało się połączyć z serwerem.');
        } finally {
            // Повертаємо UI у початковий стан
            cartSidebar.classList.remove('open');
            document.getElementById('main-content').classList.remove('shrink-cart');
            checkoutButton.style.display = 'block';
            checkoutFormContainer.style.display = 'none';
        }
    });

});