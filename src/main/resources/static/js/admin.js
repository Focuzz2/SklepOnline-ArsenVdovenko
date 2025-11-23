document.getElementById("addProductForm").addEventListener("submit", async (e) => {
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
        window.location.href = "/login";
    } else {
      const errors = await response.json();
      alert("Błąd: " + JSON.stringify(errors));
    }
});