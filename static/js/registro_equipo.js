document.addEventListener('DOMContentLoaded', function() {
    const form =   document.getElementById('registro-equipo-form');
    const tipoProducto = document.getElementById('tipo_producto');
    const tallasContainer = document.getElementById('tallas-container');
    const colorContainer = document.getElementById('color-container');

    const tallasOptions = {
        careta: ['Talla Única'],
        uniforme: ['00', '0', '1', '2', '3'],
        antebraceras: ['CH', 'MD', 'LG'],
        coderas: ['CH', 'MD', 'LG'],
        espinilleras: ['CH', 'MD', 'LG']
    };

    tipoProducto.addEventListener('change', function() {
        const selectedProduct = this.value;
        tallasContainer.innerHTML = '';
        colorContainer.style.display = 'none';

        if (selectedProduct) {
            const tallas = tallasOptions[selectedProduct];
            tallas.forEach(talla => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <label for="talla_${talla}">Talla ${talla}:</label>
                    <input type="checkbox" id="talla_${talla}" name="tallas" value="${talla}">
                    <label for="cantidad_${talla}">Cantidad:</label>
                    <input type="number" id="cantidad_${talla}" name="cantidad_${talla}" min="0" value="0">
                `;
                tallasContainer.appendChild(div);
            });

            if (selectedProduct === 'antebraceras' || selectedProduct === 'espinilleras') {
                colorContainer.style.display = 'block';
            }
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        fetch('/registro_equipo', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                form.reset();
                tallasContainer.innerHTML = '';
                colorContainer.style.display = 'none';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la solicitud.');
        });
    });
});