
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario-cliente");
    const clienteId = document.getElementById("cliente-id");
    const nombre = document.getElementById("nombre-cliente");
    const telefono = document.getElementById("telefono-cliente");
    const correo = document.getElementById("correo-cliente");
    const botonGuardar = document.getElementById("btn-guardar-cliente");
    const botonCancelar = document.getElementById("btn-cancelar-edicion");
    const listaClientes = document.getElementById("lista-clientes");

    if (!formulario || !listaClientes) {
        console.error("No se encontraron los elementos del módulo de clientes.");
        return;
    }

    let clientes = [];

    try {
        clientes = JSON.parse(
            localStorage.getItem("clientesSistemaReservas") || "[]"
        );
    } catch (error) {
        clientes = [];
    }

    function guardarClientes() {
        localStorage.setItem(
            "clientesSistemaReservas",
            JSON.stringify(clientes)
        );
    }

    function mostrarClientes() {
        listaClientes.replaceChildren();

        clientes.forEach((cliente) => {
            const fila = document.createElement("tr");

            [cliente.nombre, cliente.telefono, cliente.correo].forEach((dato) => {
                const celda = document.createElement("td");
                celda.textContent = dato;
                fila.appendChild(celda);
            });

            const celdaAcciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.textContent = "Modificar";
            botonEditar.addEventListener("click", () => {
                clienteId.value = cliente.id;
                nombre.value = cliente.nombre;
                telefono.value = cliente.telefono;
                correo.value = cliente.correo;

                botonGuardar.textContent = "Guardar cambios";
                botonCancelar.hidden = false;
                nombre.focus();
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", () => {
                const confirmar = confirm(
                    `¿Deseas eliminar al cliente ${cliente.nombre}?`
                );

                if (confirmar) {
                    clientes = clientes.filter((item) => item.id !== cliente.id);
                    guardarClientes();
                    mostrarClientes();
                }
            });

            celdaAcciones.append(botonEditar, botonEliminar);
            fila.appendChild(celdaAcciones);
            listaClientes.appendChild(fila);
        });
    }

    function cancelarModificacion() {
        formulario.reset();
        clienteId.value = "";
        botonGuardar.textContent = "Registrar cliente";
        botonCancelar.hidden = true;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const datos = {
            nombre: nombre.value.trim(),
            telefono: telefono.value.trim(),
            correo: correo.value.trim()
        };

        if (!datos.nombre || !datos.telefono || !datos.correo) {
            alert("Completa todos los campos.");
            return;
        }

        if (clienteId.value) {
            clientes = clientes.map((cliente) =>
                cliente.id === clienteId.value
                    ? { ...cliente, ...datos }
                    : cliente
            );
        } else {
            clientes.push({
                id: crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`,
                ...datos
            });
        }

        guardarClientes();
        mostrarClientes();
        cancelarModificacion();
    });

    botonCancelar.addEventListener("click", cancelarModificacion);

    mostrarClientes();
});



   // MODULO DE SERVICIOS
document.addEventListener("DOMContentLoaded", () => {
    const formularioServicio = document.getElementById("formulario-servicio");
    const servicioId = document.getElementById("servicio-id");
    const nombreServicio = document.getElementById("nombre-servicio");
    const precioServicio = document.getElementById("precio-servicio");
    const duracionServicio = document.getElementById("duracion-servicio");
    const botonGuardarServicio = document.getElementById("btn-guardar-servicio");
    const botonCancelarServicio = document.getElementById("btn-cancelar-edicion-servicio");
    const listaServicios = document.getElementById("lista-servicios");

    if (!formularioServicio || !listaServicios) {
        console.error("No se encontraron los elementos del módulo de servicios.");
        return;
    }

    let servicios = [];

    try {
        servicios = JSON.parse(
            localStorage.getItem("serviciosSistemaReservas") || "[]"
        );
    } catch (error) {
        servicios = [];
    }

    function guardarServicios() {
        localStorage.setItem(
            "serviciosSistemaReservas",
            JSON.stringify(servicios)
        );
    }

    function formatearPrecio(valor) {
        return `S/ ${Number(valor).toFixed(2)}`;
    }

    function mostrarServicios() {
        listaServicios.replaceChildren();

        if (servicios.length === 0) {
            const filaVacia = document.createElement("tr");
            const celdaVacia = document.createElement("td");
            celdaVacia.colSpan = 4;
            celdaVacia.textContent = "No hay servicios registrados aún.";
            filaVacia.appendChild(celdaVacia);
            listaServicios.appendChild(filaVacia);
            return;
        }

        servicios.forEach((servicio) => {
            const fila = document.createElement("tr");

            const celdas = [
                servicio.nombre,
                formatearPrecio(servicio.precio),
                `${servicio.duracion} min`
            ];

            celdas.forEach((dato) => {
                const celda = document.createElement("td");
                celda.textContent = dato;
                fila.appendChild(celda);
            });

            const celdaAcciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.textContent = "Modificar";
            botonEditar.addEventListener("click", () => {
                servicioId.value = servicio.id;
                nombreServicio.value = servicio.nombre;
                precioServicio.value = servicio.precio;
                duracionServicio.value = servicio.duracion;

                botonGuardarServicio.textContent = "Guardar cambios";
                botonCancelarServicio.hidden = false;
                nombreServicio.focus();
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", () => {
                const confirmar = confirm(
                    `¿Deseas eliminar el servicio "${servicio.nombre}"?`
                );

                if (confirmar) {
                    servicios = servicios.filter(
                        (item) => item.id !== servicio.id
                    );
                    guardarServicios();
                    mostrarServicios();
                }
            });

            celdaAcciones.append(botonEditar, botonEliminar);
            fila.appendChild(celdaAcciones);
            listaServicios.appendChild(fila);
        });
    }

    function cancelarModificacionServicio() {
        formularioServicio.reset();
        servicioId.value = "";
        botonGuardarServicio.textContent = "Registrar servicio";
        botonCancelarServicio.hidden = true;
    }

    formularioServicio.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nombre = nombreServicio.value.trim();
        const precio = parseFloat(precioServicio.value);
        const duracion = parseInt(duracionServicio.value, 10);

        if (!nombre || Number.isNaN(precio) || Number.isNaN(duracion)) {
            alert("Completa todos los campos.");
            return;
        }

        if (precio < 0) {
            alert("El precio no puede ser negativo.");
            return;
        }

        if (duracion <= 0) {
            alert("La duración debe ser mayor a 0 minutos.");
            return;
        }

        const datos = {
            nombre,
            precio,
            duracion
        };

        if (servicioId.value) {
            servicios = servicios.map((servicio) =>
                servicio.id === servicioId.value
                    ? { ...servicio, ...datos }
                    : servicio
            );
        } else {
            servicios.push({
                id: crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random()}`,
                ...datos
            });
        }

        guardarServicios();
        mostrarServicios();
        cancelarModificacionServicio();
    });

    botonCancelarServicio.addEventListener(
        "click",
        cancelarModificacionServicio
    );

    mostrarServicios();
});