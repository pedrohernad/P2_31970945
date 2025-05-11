document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.nav__mobile-toggle');
    const mobileMenu = document.querySelector('.nav__list--mobile');
    const body = document.body;
    
    // Crear overlay dinámicamente
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    
    toggleButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
        
        // Cambiar icono de hamburguesa a X
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
    
    // Cerrar menú al hacer clic en overlay
    overlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        this.classList.remove('active');
        body.classList.remove('no-scroll');
        toggleButton.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
    
    // Cerrar menú al hacer clic en un enlace (opcional)
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('no-scroll');
            toggleButton.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });
});