document.addEventListener("DOMContentLoaded", () => {
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const usernameDisplay = document.getElementById('username-display');
    const adminLink = document.getElementById('admin-link');

    fetch('/api/current-user')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Not logged in");
            }
        })
        .then(user => {
            guestMenu.style.display = 'none';
            userMenu.style.display = 'flex';
            
            usernameDisplay.textContent = user.username;

            if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') {
                adminLink.style.display = 'inline';
            }
        })
        .catch(() => {
            guestMenu.style.display = 'block';
            userMenu.style.display = 'none';
        });
});