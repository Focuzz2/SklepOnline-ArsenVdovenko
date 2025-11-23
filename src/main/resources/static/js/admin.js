document.addEventListener("DOMContentLoaded", () => {
    // === 1. ELEMENTY DLA ZAMÓWIEŃ ===
    const ordersContainer = document.getElementById('orders-container');
    const loadingMessage = document.getElementById('loading-message');
    const STATUSES = ["NEW", "ACCEPT", "SHIPPED", "DONE", "CANCELLED"];

    // === 2. ELEMENTY DLA PRODUKTÓW ===
    const addProductForm = document.getElementById("addProductForm");
    
    // ===========================================
    // A. LOGIKA DODAWANIA PRODUKTÓW (TWÓJ KOD)
    // ===========================================
    if (addProductForm) {
        addProductForm.addEventListener("submit", async (e) => {
            e.preventDefault();
        
            const name = document.getElementById("name").value.trim();
            const description = document.getElementById("description").value.trim();
            const price = parseFloat(document.getElementById("price").value);
            const quantity = parseInt(document.getElementById("quantity").value);
            const imageUrl = document.getElementById("imageUrl").value.trim();
        
            const product = { name, description, price, quantity, imageUrl };
        
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });
        
            if (response.ok) {
                alert("Produkt dodany!");
                e.target.reset();
            } else if (response.status === 403) {
                alert("Brak dostępu! Musisz mieć rolę ADMIN.");
            } else if (response.status === 401) {
                alert("Musisz się zalogować!");
                window.location.href = "/login.html";
            } else {
                try {
                    const errors = await response.json();
                    alert("Błąd: " + JSON.stringify(errors));
                } catch (jsonError) {
                    alert("Błąd dodawania produktu: " + response.statusText);
                }
            }
        });
    }

    // ===========================================
    // B. LOGIKA ZMIANY STATUSU
    // ===========================================

    async function updateOrderStatus(orderId, newStatus) {
        // Nowy status jest wysyłany jako zwykły String, aby Spring mógł go przekonwertować na OrderStatus
        try {
const response = await fetch(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'text/plain', // <<<<<< ЗМІНА ТУТ
    },
    body: newStatus // <<<<<< НАДСИЛАЄМО ЧИСТИЙ РЯДОК
});

            if (response.ok) {
                alert(`Status zamówienia #${orderId} zaktualizowano na: ${newStatus}`);
                // Przeładuj zamówienia, aby odświeżyć widok
                loadOrders(); 
            } else if (response.status === 403) {
                alert("Brak dostępu! Musisz mieć rolę ADMIN.");
            } else if (response.status === 404) {
                 alert("Błąd: Zamówienie nie znalezione.");
            } else {
                throw new Error(`Błąd aktualizacji statusu: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Błąd aktualizacji statusu:', error);
            alert('Wystąpił błąd podczas aktualizacji statusu. Sprawdź konsolę.');
        }
    }

    // ===========================================
    // C. LOGIKA ŁADOWANIA ZAMÓWIEŃ
    // ===========================================

    async function loadOrders() {
        if (!ordersContainer) return;

        try {
            const response = await fetch('/api/admin/orders');

            if (response.status === 403) {
                ordersContainer.innerHTML = '<h2>Błąd Autoryzacji</h2><p>Nie masz uprawnień do przeglądania tej strony. Zaloguj się jako administrator.</p>';
                return;
            }

            if (!response.ok) {
                throw new Error(`Błąd sieci: ${response.status} ${response.statusText}`);
            }

            const orders = await response.json();
            
            if (loadingMessage) loadingMessage.style.display = 'none';
            ordersContainer.innerHTML = ''; 
            
            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p>Brak zamówień w systemie.</p>'; 
                return;
            }

            renderOrders(orders);

        } catch (error) {
            console.error('Błąd ładowania zamówień:', error);
            ordersContainer.innerHTML = `<h2>Wystąpił błąd</h2><p>${error.message}. Sprawdź, czy serwer działa i czy endpoint jest poprawny.</p>`;
        }
    }

    function renderOrders(orders) {
        
        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-card';
            
            const date = new Date(order.orderDate).toLocaleString('pl-PL', { 
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
            });
            
            // Mapujemy pozycje zamówienia na listę HTML
            let itemsList = order.items.map(item => 
                `<li>${item.productName} (${item.quantity} szt.) - ${item.priceAtOrder.toFixed(2)} PLN/szt.</li>`
            ).join('');

            // TWORZYMY WYSZCZERZANĄ LISTĘ STATUSÓW
            const statusSelect = document.createElement('select');
            statusSelect.className = 'status-select';
            statusSelect.setAttribute('data-order-id', order.id);

            STATUSES.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if (status === order.status) {
                    option.selected = true; // Ustawia aktualny status
                }
                statusSelect.appendChild(option);
            });

            // DODAJEMY LISTENER DO ZMIANY
            statusSelect.addEventListener('change', (e) => {
                const newStatus = e.target.value;
                const orderId = e.target.getAttribute('data-order-id');
                updateOrderStatus(orderId, newStatus); 
            });


            orderDiv.innerHTML = `
                <h3>Zamówienie #${order.id}</h3>
                <p><strong>Data:</strong> ${date}</p>
                <p><strong>Klient:</strong> ${order.customerName} (${order.customerEmail})</p>
                <p><strong>Adres:</strong> ${order.customerAddress}</p>
                <p><strong>Telefon:</strong> ${order.customerPhone}</p>
                <p><strong>Suma całkowita:</strong> <span style="font-weight: bold; color: #ff6b6b;">${order.totalAmount.toFixed(2)} PLN</span></p>
                <h4>Pozycje:</h4>
                <ul>${itemsList}</ul>
                <div class="order-status-control">
                    <strong>Aktualny Status:</strong>
                    <span id="status-for-${order.id}"></span> 
                </div>
            `;
            
            // Wstawiamy listę wyboru do kontenera statusu
            orderDiv.querySelector(`#status-for-${order.id}`).appendChild(statusSelect);

            ordersContainer.appendChild(orderDiv);
        });
    }

    // Uruchomienie ładowania zamówień
    loadOrders();
});