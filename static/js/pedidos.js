document.addEventListener('DOMContentLoaded', function() {
    const tablaPedidos = document.getElementById('tabla-pedidos');
    const modal = document.getElementById('confirmacion-modal');
    const confirmarBtn = document.getElementById('confirmar-eliminar');
    const cancelarBtn = document.getElementById('cancelar-eliminar');
    const notificacion = document.getElementById('notificacion');
    let pedidoIdAEliminar = null;

    tablaPedidos.addEventListener('click', function(e) {
        if (e.target.classList.contains('eliminar-pedido')) {
            pedidoIdAEliminar = e.target.getAttribute('data-id');
            modal.style.display = 'block';
        }
    });

    confirmarBtn.addEventListener('click', function() {
        if (pedidoIdAEliminar) {
            eliminarPedido(pedidoIdAEliminar);
        }
    });

    cancelarBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        pedidoIdAEliminar = null;
    });

    function eliminarPedido(pedidoId) {
        fetch(`/eliminar_pedido/${pedidoId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion(data.message, 'success');
                // Eliminar la fila de la tabla
                const fila = document.querySelector(`button[data-id="${pedidoId}"]`).closest('tr');
                fila.remove();
            } else {
                mostrarNotificacion(data.message, 'error');
            }
            modal.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Ocurrió un error al eliminar el pedido.', 'error');
            modal.style.display = 'none';
        });
    }

    function mostrarNotificacion(mensaje, tipo) {
        notificacion.textContent = mensaje;
        notificacion.className = `notificacion ${tipo}`;
        notificacion.style.display = 'block';
        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 3000);
    }
});