
document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (event) {
            event.preventDefault(); // Zabraňuje výchozímu chování odkazu
            const dropdownMenu = this.nextElementSibling; // Vyhledá dropdown, který následuje
            dropdownMenu.classList.toggle('show'); // Přepíná třídu 'show'
        });
    });


    // Zavírá dropdown, když kliknete mimo něj
    window.addEventListener('click', function (event) {
        dropdownToggles.forEach(toggle => {
            const dropdownMenu = toggle.nextElementSibling;
            if (!toggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    });
});

document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(event) {
        event.preventDefault(); // Zabraňuje výchozímu chování odkazu
        const dropdown = this.nextElementSibling; // Najít dropdown pod tímto toggle

        dropdown.classList.toggle('show'); // Přepnout zobrazení dropdown
        this.classList.toggle('show'); // Přepnout třídu pro šipku
    });
});



