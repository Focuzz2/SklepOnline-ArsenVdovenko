document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const imageUrl = document.getElementById("imageUrl").value.trim();

  if (name.length < 2) {
    alert("Nazwa musi mieć co najmniej 2 znaki!");
    return;
  }
  if (description.length < 5) {
    alert("Opis musi mieć co najmniej 5 znaków!");
    return;
  }
  if (isNaN(price) || price <= 0) {
    alert("Cena musi być dodatnia!");
    return;
  }
  if (isNaN(quantity) || quantity < 0) {
    alert("Ilość nie może być ujemna!");
    return;
  }
  if (!imageUrl) {
    alert("Adres zdjęcia nie może być pusty!");
    return;
  }

  const product = { name, description, price, quantity, imageUrl };

  const response = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (response.ok) {
    alert("Produkt dodany!");
    e.target.reset();
  } else {
    const errors = await response.json();
    console.error(errors);
    alert("Błąd walidacji: " + JSON.stringify(errors));
  }
});
