const pedidos = [];

const campoProducto = document.querySelector("#producto");
const campoPrecio = document.querySelector("#precio");
const campoCantidad = document.querySelector("#cantidad");
const campoPrecioMaximo = document.querySelector("#precio-maximo");

const botonAgregar = document.querySelector("#boton-agregar");
const botonFiltrar = document.querySelector("#boton-filtrar");
const botonMostrarTodos = document.querySelector("#boton-mostrar-todos");
const botonLimpiar = document.querySelector("#boton-limpiar");

const cuerpoTabla = document.querySelector("#cuerpo-tabla");
const elementoTotalUnidades = document.querySelector("#total-unidades");
const elementoMontoTotal = document.querySelector("#monto-total");  
const elementoMensaje = document.querySelector("#mensaje");


function leerFormulario() {
  return {
    producto: campoProducto.value.trim(),
    precio: Number(campoPrecio.value),
    cantidad: Number(campoCantidad.value),
  };
}

function validarPedido({ producto, precio, cantidad }) {
  const errores = [];

  if (producto === "") {
    errores.push("El nombre del producto no puede estar vacío.");
  }

  if (!(precio > 0)) {
    errores.push("El precio unitario debe ser mayor que cero.");
  }
  if (!(cantidad > 0 && cantidad % 1 === 0)) {
    errores.push("La cantidad debe ser un número entero positivo.");
  }

  return errores;
}

function calcularSubtotal({ precio, cantidad }) {
  return precio * cantidad;
}

function calcularTotalUnidades(lista) {
  return lista
    .map((pedido) => pedido.cantidad)
    .reduce((acumulado, cantidad) => acumulado + cantidad, 0);
}

function calcularMontoTotal(lista) {
  return lista
    .map(calcularSubtotal)
    .reduce((acumulado, subtotal) => acumulado + subtotal, 0);
}

function filtrarPorPrecioMaximo(lista, precioMaximo) {
  return lista.filter((pedido) => pedido.precio <= precioMaximo);
}

function formatearDinero(valor) {
  return `$${valor.toFixed(2)}`;
}

function mostrarMensaje(texto, tipo) {
  elementoMensaje.textContent = texto;
  elementoMensaje.className = texto === "" ? "" : `mt-3 mb-0 alert alert-${tipo}`;
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearFila(pedido) {
  const { producto, precio, cantidad } = pedido;
  const fila = document.createElement("tr");

  const celdas = [
    crearCelda(producto),
    crearCelda(formatearDinero(precio)),
    crearCelda(cantidad),
    crearCelda(formatearDinero(calcularSubtotal(pedido))),
  ];

  celdas.forEach((celda) => fila.appendChild(celda));
  return fila;
}

function crearFilaVacia() {
  const fila = document.createElement("tr");
  const celda = crearCelda("No hay pedidos para mostrar.");
  celda.colSpan = 4;
  celda.className = "text-center text-muted";
  fila.appendChild(celda);
  return fila;
}

function actualizarTabla(lista) {
  const filas = lista.length === 0 ? [crearFilaVacia()] : lista.map(crearFila);

  cuerpoTabla.textContent = "";
  filas.forEach((fila) => cuerpoTabla.appendChild(fila));
}

function actualizarIndicadores(lista) {
  elementoTotalUnidades.textContent = calcularTotalUnidades(lista);
  elementoMontoTotal.textContent = formatearDinero(calcularMontoTotal(lista));
}


function mostrarPedidos(lista) {
  actualizarTabla(lista);
  actualizarIndicadores(lista);
}

function limpiarFormulario() {
  campoProducto.value = "";
  campoPrecio.value = "";
  campoCantidad.value = "";
  campoProducto.focus();
}

function manejarAgregarPedido() {
  const nuevoPedido = leerFormulario();
  const errores = validarPedido(nuevoPedido);

  if (errores.length > 0) {
    mostrarMensaje(errores.join(" "), "danger");
    return;
  }

  pedidos.push(nuevoPedido);
  campoPrecioMaximo.value = "";
  mostrarPedidos(pedidos);
  mostrarMensaje("Pedido agregado correctamente.", "success");
  limpiarFormulario();
}

function manejarFiltrar() {
  const precioMaximo = Number(campoPrecioMaximo.value);

  if (!(precioMaximo > 0)) {
    mostrarMensaje("Ingrese un precio máximo mayor que cero para filtrar.", "warning");
    return;
  }

  const pedidosFiltrados = filtrarPorPrecioMaximo(pedidos, precioMaximo);
  mostrarPedidos(pedidosFiltrados);
  mostrarMensaje(
    `Mostrando ${pedidosFiltrados.length} de ${pedidos.length} pedidos (precio ≤ ${formatearDinero(precioMaximo)}).`,
    "info"
  );
}

function manejarMostrarTodos() {
  campoPrecioMaximo.value = "";
  mostrarPedidos(pedidos);
  mostrarMensaje("", "");
}

function manejarLimpiar() {
  pedidos.length = 0; // vacía el mismo arreglo
  campoPrecioMaximo.value = "";
  mostrarPedidos(pedidos);
  mostrarMensaje("Se eliminaron todos los pedidos.", "secondary");
}

botonAgregar.addEventListener("click", manejarAgregarPedido);
botonFiltrar.addEventListener("click", manejarFiltrar);
botonMostrarTodos.addEventListener("click", manejarMostrarTodos);
botonLimpiar.addEventListener("click", manejarLimpiar);

mostrarPedidos(pedidos);
