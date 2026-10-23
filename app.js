
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
