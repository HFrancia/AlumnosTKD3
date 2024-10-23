document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-equipo-form');
    const productosContainer = document.getElementById('productos-container');
    const agregarProductoBtn = document.getElementById('agregar-producto');
    const tablaPedidosHoy = document.getElementById('tabla-pedidos-hoy');

    const productosOptions = {
        espinillera: {
            tallas: ['','CH', 'MD', 'LG'],
            colores: ['','blanco', 'azul', 'negro']
        },
        cabezal: {
            tallas: ['','CH', 'MD', 'LG'],
            colores: ['','blanco', 'azul', 'negro']
        },
        antebracera: {
            tallas: ['','CH', 'MD', 'LG'],
            colores: ['','blanco', 'azul', 'negro']
        },
        codera: {
            tallas: ['','CH', 'MD', 'LG'],
            colores: ['','blanco', 'azul', 'negro']
        },
        peto: {
            tallas: ['','CH', 'MD', 'LG'],
            colores: ['','blanco', 'azul', 'negro']
        },
        empeineras: {
            tallas: ['','CH', 'MD', 'LG'],
            colores: ['','blanco', 'azul', 'negro']
        },
        guantillas: {
            tallas: ['','CH', 'MD', 'LG'],
            colores: ['','blanco', 'azul', 'negro']
        },
        mica: {
            tallas: ['','Unitalla'],
            colores: []
        },
        uniforme: {
            tallas: ['','000','00', '0', '1', '2', '3', '4', '5', '6'],
            colores: ['','Cuello Blanco','Cuello Rojo/Negro','Cuello Negro']
        }
    };

    function createProductoForm() {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto-form');

        const tipoSelect = document.createElement('select');
        tipoSelect.name = 'tipo_producto';
        tipoSelect.required = true;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione un producto';
        tipoSelect.appendChild(defaultOption);

        for (const producto in productosOptions) {
            const option = document.createElement('option');
            option.value = producto;
            option.textContent = producto.charAt(0).toUpperCase() + producto.slice(1);
            tipoSelect.appendChild(option);
        }

        const tallaSelect = document.createElement('select');
        tallaSelect.name = 'talla';
        tallaSelect.required =   true;
        tallaSelect.style.display = 'none';

        const colorSelect = document.createElement('select');
        colorSelect.name = 'color';
        colorSelect.style.display = 'none';

        const cantidadInput = document.createElement('input');
        cantidadInput.type = 'number';
        cantidadInput.name = 'cantidad';
        cantidadInput.min = '1';
        cantidadInput.required = true;
        cantidadInput.style.display = 'none';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Eliminar';
        removeBtn.addEventListener('click', function() {
            productoDiv.remove();
        });

        tipoSelect.addEventListener('change', function() {
            const selectedProduct = this.value;
            tallaSelect.innerHTML = '';
            colorSelect.innerHTML = '';

            if (selectedProduct) {
                const producto = productosOptions[selectedProduct];

                producto.tallas.forEach(talla => {
                    const option = document.createElement('option');
                    option.value = talla;
                    option.textContent = talla;
                    tallaSelect.appendChild(option);
                });

                producto.colores.forEach(color => {
                    const option = document.createElement('option');
                    option.value = color;
                    option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
                    colorSelect.appendChild(option);
                });

                tallaSelect.style.display = 'inline-block';
                cantidadInput.style.display = 'inline-block';

                if (producto.colores.length > 0) {
                    colorSelect.style.display = 'inline-block';
                } else {
                    colorSelect.style.display = 'none';
                }
            } else {
                tallaSelect.style.display = 'none';
                colorSelect.style.display = 'none';
                cantidadInput.style.display = 'none';
            }
        });

        productoDiv.appendChild(tipoSelect);
        productoDiv.appendChild(tallaSelect);
        productoDiv.appendChild(colorSelect);
        productoDiv.appendChild(cantidadInput);
        productoDiv.appendChild(removeBtn);

        return productoDiv;
    }

    agregarProductoBtn.addEventListener('click', function() {
        const productoForm = createProductoForm();
        productosContainer.insertBefore(productoForm, agregarProductoBtn);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const productos = [];

        document.querySelectorAll('.producto-form').forEach(productoForm => {
            const tipo = productoForm.querySelector('[name="tipo_producto"]').value;
            const talla = productoForm.querySelector('[name="talla"]').value;
            const color = productoForm.querySelector('[name="color"]').value;
            const cantidad = productoForm.querySelector('[name="cantidad"]').value;

            if (tipo && talla && cantidad) {
                productos.push({ tipo, talla, color, cantidad: parseInt(cantidad) });
            }
        });

        const data = {
            nombre_solicitante: formData.get('nombre_solicitante'),
            productos: productos
        };

        fetch('/registro_equipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                form.reset();
                document.querySelectorAll('.producto-form').forEach(form => form.remove());
                cargarPedidosHoy();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la solicitud.');
        });
    });

    function cargarPedidosHoy() {
        fetch('/pedidos_hoy')
            .then(response => response.json())
            .then(pedidos => {
                const tbody = tablaPedidosHoy.querySelector('tbody');
                tbody.innerHTML = '';
                pedidos.forEach(pedido => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${pedido.nombre_solicitante}</td>
                        <td>${pedido.tipo_producto}</td>
                        <td>${pedido.talla}</td>
                        <td>${pedido.color || 'N/A'}</td>
                        <td>${pedido.cantidad}</td>
                        <td><button class="eliminar-pedido" data-id="${pedido.id}">Eliminar</button></td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al cargar los pedidos de hoy.');
            });
    }

    tablaPedidosHoy.addEventListener('click', function(e) {
        if (e.target.classList.contains('eliminar-pedido')) {
            const pedidoId = e.target.getAttribute('data-id');
            eliminarPedido(pedidoId);
        }
    });

    function eliminarPedido(pedidoId) {
        fetch(`/eliminar_pedido/${pedidoId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                cargarPedidosHoy();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al eliminar el pedido.');
        });
    }

    // Cargar pedidos de hoy al iniciar la página
    cargarPedidosHoy();
});