const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");

const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

const idModal = document.getElementById("idModal");

// Actividad 2: Persistencia de datos en LocalStorage (claves de almacenamiento)
const CLAVE_PACIENTES = "guia6_pacientes";
const CLAVE_PAISES = "guia6_paises";

// Actividad 2: Función para leer y parsear la información respaldada en LocalStorage
const leerLista = (clave) => {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
};

// Actividad 2: Función para serializar y guardar los datos actualizados en LocalStorage
const guardarLista = (clave, lista) => {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch (error) {
    console.error("No se pudo guardar en LocalStorage:", error);
  }
};

// Actividad 2: Carga inicial de datos desde LocalStorage hacia la memoria del programa
let arrayPaciente = leerLista(CLAVE_PACIENTES);
let paisesExtra = leerLista(CLAVE_PAISES);

let indiceEdicion = null;

const htmlBotonGuardar = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;
const htmlBotonActualizar = `<i class="bi bi-check-circle-fill"></i> Actualizar datos`;

// Actividad 1: Función para resetear el estado y regresar del modo edición al modo registro
const salirModoEdicion = () => {
  indiceEdicion = null;
  buttonAgregarPaciente.innerHTML = htmlBotonGuardar;
};

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  salirModoEdicion();
  inputNombre.focus();
};

const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    const datos = new Array(
      nombre,
      apellido,
      fechaNacimiento,
      sexo,
      labelPais,
      direccion
    );
    const estabaEditando = indiceEdicion !== null;

    if (estabaEditando) {
      // Actividad 1: Actualización del registro existente con los nuevos valores del formulario
      arrayPaciente[indiceEdicion] = datos;
      mensaje.innerHTML = "Paciente actualizado correctamente";
    } else {
      arrayPaciente.push(datos);
      mensaje.innerHTML = "Se ha registrado un nuevo paciente";
    }
    // Actividad 2: Guardado automático de los cambios (alta o edición) en LocalStorage
    guardarLista(CLAVE_PACIENTES, arrayPaciente);

    toast.show();
    limpiarForm();

    if (estabaEditando) imprimirPacientes();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element, indice) => {
    // Actividad 1: Inclusión de atributos data-accion y data-indice para habilitar Editar y Eliminar
    $fila += `<tr>
      <td scope="row" class="text-center fw-bold">${contador}</td>
      <td>${element[0]}</td>
      <td>${element[1]}</td>
      <td>${element[2]}</td>
      <td>${element[3]}</td>
      <td>${element[4]}</td>
      <td>${element[5]}</td>
      <td>
        <button type="button" class="btn btn-primary" title="Editar"
          data-accion="editar" data-indice="${indice}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button type="button" class="btn btn-danger" title="Eliminar"
          data-accion="eliminar" data-indice="${indice}">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </td>
    </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  const contenedor = document.getElementById("idTablaPacientes");

  if (arrayPaciente.length === 0) {
    contenedor.innerHTML = "Ninguno";
    return;
  }

  let $table = `<div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
      <tr>
        <th scope="col" class="text-center" style="width:5%">#</th>
        <th scope="col" class="text-center" style="width:15%">Nombre</th>
        <th scope="col" class="text-center" style="width:15%">Apellido</th>
        <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
        <th scope="col" class="text-center" style="width:10%">Sexo</th>
        <th scope="col" class="text-center" style="width:10%">Pais</th>
        <th scope="col" class="text-center" style="width:25%">Dirección</th>
        <th scope="col" class="text-center" style="width:10%">Opciones</th>
      </tr>
      ${imprimirFilas()}
    </table>
  </div>`;
  contenedor.innerHTML = $table;
};

// Actividad 1: Función que carga los datos seleccionados en los campos del formulario para editarlos
const editarPaciente = (indice) => {
  const p = arrayPaciente[indice];

  inputNombre.value = p[0];
  inputApellido.value = p[1];
  inputFechaNacimiento.value = p[2];
  inputRdMasculino.checked = p[3] === "Hombre";
  inputRdFemenino.checked = p[3] === "Mujer";

  const opcion = Array.from(cmbPais.options).find((o) => o.text === p[4]);
  cmbPais.selectedIndex = opcion ? opcion.index : 0;

  inputDireccion.value = p[5];

  indiceEdicion = indice;
  buttonAgregarPaciente.innerHTML = htmlBotonActualizar;

  inputNombre.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Actividad 1: Función para suprimir un paciente del arreglo y refrescar la vista
const eliminarPaciente = (indice) => {
  const p = arrayPaciente[indice];

  if (confirm(`¿Desea eliminar al paciente ${p[0]} ${p[1]}?`)) {
    arrayPaciente.splice(indice, 1);
    // Actividad 2: Actualización del almacenamiento en LocalStorage tras eliminar el registro
    guardarLista(CLAVE_PACIENTES, arrayPaciente);

    if (indiceEdicion !== null) limpiarForm();

    imprimirPacientes();
    mensaje.innerHTML = "Paciente eliminado correctamente";
    toast.show();
  }
};

// Actividad 1: Manejador de eventos delegado para capturar las pulsaciones de los botones Editar y Eliminar
document.getElementById("idTablaPacientes").addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;

  const indice = parseInt(boton.dataset.indice);
  if (boton.dataset.accion === "editar") editarPaciente(indice);
  else if (boton.dataset.accion === "eliminar") eliminarPaciente(indice);
});

const crearOptionPais = (nombre) => {
  let option = document.createElement("option");
  option.textContent = nombre;
  option.value = cmbPais.children.length;
  cmbPais.appendChild(option);
};

// Actividad 2: Carga persistente de países adicionales agregados en sesiones anteriores
paisesExtra.forEach((nombre) => crearOptionPais(nombre));

const addPais = (e) => {
  if (e) e.preventDefault();

  let paisNew = inputNombrePais.value.trim();

  if (paisNew != "") {
    crearOptionPais(paisNew);
    paisesExtra.push(paisNew);
    // Actividad 2: Guardado persistente de países extra en LocalStorage
    guardarLista(CLAVE_PAISES, paisesExtra);

    inputNombrePais.value = "";

    const modalInstancia = bootstrap.Modal.getInstance(idModal);
    if (modalInstancia) modalInstancia.hide();

    mensaje.innerHTML = "País agregado correctamente";
    toast.show();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = (e) => {
  addPais(e);
};

idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

limpiarForm();
imprimirPacientes();

// =========================================================================================
// Actividad 3: Validaciones con Expresiones Regulares para ficha de estudiante
// =========================================================================================

// Definición de expresiones regulares requeridas
const patronesValidacion = {
  // Carnet: Dos letras seguidas de tres números (Ejemplo: AB001)
  carnet: /^[A-Za-z]{2}\d{3}$/,

  // Nombre completo: Solo letras y espacios (admite tildes y diéresis)
  nombreCompleto: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/,

  // DUI: 8 dígitos, un guion y 1 dígito verificador (########-#)
  dui: /^\d{8}-\d{1}$/,

  // NIT: 4 dígitos, guion, 6 dígitos, guion, 3 dígitos, guion y 1 dígito (####-######-###-#)
  nit: /^\d{4}-\d{6}-\d{3}-\d{1}$/,

  // Fecha de nacimiento: Formato día, mes y año numérico (DD/MM/AAAA o DD-MM-AAAA)
  fechaNacimiento: /^(0[1-9]|[12]\d|3[01])[/-](0[1-9]|1[0-2])[/-]\d{4}$/,

  // Correo electrónico estándar
  correo: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,

  // Edad: Únicamente caracteres numéricos enteros positivos
  edad: /^\d+$/
};

// Función de validación integral para la ficha del estudiante
function validarFichaEstudiante(estudiante) {
  let errores = [];

  if (!patronesValidacion.carnet.test(estudiante.carnet)) {
    errores.push("Carnet inválido. Formato requerido: dos letras y tres números (ej. AB001).");
  }
  if (!patronesValidacion.nombreCompleto.test(estudiante.nombre)) {
    errores.push("Nombre inválido. No debe contener números ni caracteres especiales.");
  }
  if (!patronesValidacion.dui.test(estudiante.dui)) {
    errores.push("DUI inválido. Formato requerido: ########-#.");
  }
  if (!patronesValidacion.nit.test(estudiante.nit)) {
    errores.push("NIT inválido. Formato requerido: ####-######-###-#.");
  }
  if (!patronesValidacion.fechaNacimiento.test(estudiante.fechaNacimiento)) {
    errores.push("Fecha inválida. Use formato DD/MM/AAAA o DD-MM-AAAA.");
  }
  if (!patronesValidacion.correo.test(estudiante.correo)) {
    errores.push("Correo electrónico con formato inválido.");
  }
  if (!patronesValidacion.edad.test(estudiante.edad)) {
    errores.push("Edad inválida. Debe contener solo números.");
  }

  return {
    valido: errores.length === 0,
    errores: errores
  };
}