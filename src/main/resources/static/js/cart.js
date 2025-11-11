document.addEventListener("DOMContentLoaded", () => {
    const cartButton = document.getElementById('cart-button-floating');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartSidebar = document.getElementById('close-cart-sidebar');
    const mainContent = document.getElementById('main-content');

    const productsContainer = document.getElementById('products');
    const cartList = document.getElementById('cart-list');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    const checkoutForm = document.getElementById('checkout-form');

    let cart = [];

    cartButton.onclick = () => {
        cartSidebar.classList.add('open');
        mainContent.classList.add('shrink-cart');
    };

    closeCartSidebar.onclick = () => {
        cartSidebar.classList.remove('open');
        mainContent.classList.remove('shrink-cart');
    };

    fetch('/api/products')
        .then(res => res.json())
        .then(data => {
            data.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>${product.price.toFixed(2)} PLN</p>
                    <button data-id="${product.id}">Dodaj do koszyka</button>
                `;
                productsContainer.appendChild(card);

                const btn = card.querySelector('button');
                btn.onclick = () => addToCart(product);
            });
        });

    function addToCart(product) {
        const existing = cart.find(p => p.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        updateCart();
    }

    window.removeFromCart = function(id) {
        cart = cart.filter(p => p.id !== id);
        updateCart();
    }

    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;
        let count = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} x ${item.quantity} 
                <button onclick="removeFromCart(${item.id})">&times;</button>
            `;
            cartList.appendChild(li);
            total += item.price * item.quantity;
            count += item.quantity;
        });
        cartCount.textContent = count;
        cartTotal.textContent = `Suma: ${total.toFixed(2)} PLN`;
    }

    checkoutButton.onclick = () => {
        checkoutFormContainer.style.display = 'block';
    };

checkoutForm.onsubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();

    if (name.length < 3) {
        alert('Imię i nazwisko musi mieć co najmniej 3 znaki');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        alert('Podaj poprawny adres e-mail');
        return;
    }
    if (address.length < 5) {
        alert('Adres jest za krótki');
        return;
    }
    if (!/^[0-9+\-\s]{6,}$/.test(phone)) {
        alert('Podaj poprawny numer telefonu');
        return;
    }

    alert('Dziękujemy za zamówienie! 🎉');
    cart = [];
    updateCart();
    checkoutFormContainer.style.display = 'none';
    checkoutForm.reset();
    cartSidebar.classList.remove('open');
    mainContent.classList.remove('shrink-cart');
};
});
