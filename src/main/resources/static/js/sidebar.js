document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById('menu-button');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const closeSidebar = document.getElementById('close-sidebar');
    const mainContent = document.getElementById('main-content');

    menuButton.onclick = () => {
        sidebarMenu.classList.add('open');
        mainContent.classList.add('shrink-sidebar');
    };

    closeSidebar.onclick = () => {
        sidebarMenu.classList.remove('open');
        mainContent.classList.remove('shrink-sidebar');
    };

    const tabAbout = document.getElementById('tab-about');
    const tabContact = document.getElementById('tab-contact');
    const contentAbout = document.getElementById('content-about');
    const contentContact = document.getElementById('content-contact');

    tabAbout.onclick = () => {
        contentAbout.classList.add('active');
        contentContact.classList.remove('active');
    };

    tabContact.onclick = () => {
        contentContact.classList.add('active');
        contentAbout.classList.remove('active');
    };
});
