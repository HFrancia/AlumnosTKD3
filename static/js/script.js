document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');
    const editarForm = document.getElementById('editar-form');
    const pagoForm = document.getElementById('pago-form');
    const eliminarBotones = document.querySelectorAll('.eliminar-alumno');

    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(registroForm);
            fetch('/registro', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    registroForm.reset();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al registrar el alumno.');
            });
        });
    }

    if (editarForm) {
        editarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(editarForm);
            const alumnoId = formData.get('id');
            fetch(`/alumno/${alumnoId}`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al actualizar el alumno.');
            });
        });
    }

    if (pagoForm) {
        pagoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(pagoForm);
            const alumnoId = formData.get('alumno_id');
            fetch(`/registrar_pago/${alumnoId}`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    pagoForm.reset();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al registrar el pago');
            });
        });
    }

    if (eliminarBotones) {
        eliminarBotones.forEach(boton => {
            boton.addEventListener('click', function() {
                const alumnoId = this.dataset.id;
                if (confirm('¿Está seguro de que desea eliminar este alumno?')) {
                    fetch(`/eliminar_alumno/${alumnoId}`, {
                        method: 'POST'
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert(data.message);
                            location.reload();
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Ocurrió un error al eliminar el alumno.');
                    });
                }
            });
        });
    }
});