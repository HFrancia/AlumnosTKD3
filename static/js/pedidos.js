document.addEventListener('DOMContentLoaded', function() {
    const tablaPedidos = document.getElementById('tabla-pedidos');

    function cargarPedidos() {
        fetch('/pedidos')
            .then(response => response.json())
            .then(pedidos => {
                const tbody = tablaPedidos.querySelector('tbody');
                tbody.innerHTML = '';
                pedidos.forEach(pedido => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${pedido.fecha}</td>
                        <td>${pedido.nombre_solicitante}</td>
                        <td>${pedido.tipo_producto}</td>
                        <td>${pedido.talla}</td>
                        <td>${pedido.color || 'N/A'}</td>
                        <td>${pedido.cantidad}</td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al cargar los pedidos.');
            });
    }

    // Cargar todos los pedidos al iniciar la página
    cargarPedidos();
});