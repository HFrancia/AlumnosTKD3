document.addEventListener('DOMContentLoaded', function() {
    const buscarForm = document.getElementById('buscar-pedidos-form');

    buscarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(buscarForm);
        const searchParams = new URLSearchParams(formData);
        window.location.href = `/pedidos?${searchParams.toString()}`;
    });
});