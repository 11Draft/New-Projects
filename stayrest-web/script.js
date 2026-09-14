/* =============================================================================
   StayRest — script.js
   Puerto a JavaScript de la lógica de StayRest.py (segundo parcial).
   Mismas reglas de negocio: 100 habitaciones, 4 tipos de servicio, filtrado
   por capacidad, cálculo de monto, anticipo, confirmación, cambio de
   habitación y cierre de instancia (queja + calificación + recomendación).
   ============================================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------------------
     Config / "base de datos" en memoria (equivalente a TIPOS_SERVICIO)
     --------------------------------------------------------------------- */
  const TOTAL_HABITACIONES = 100;

  const TIPOS_SERVICIO = {
    Estandar: { capacidadMax: 2, precioBase: 800,  requiereAnticipo: false, label: "Estándar" },
    Terraza:  { capacidadMax: 6, precioBase: 1500, requiereAnticipo: false, label: "Terraza" },
    Suite:    { capacidadMax: 4, precioBase: 1800, requiereAnticipo: true,  label: "Suite" },
    Premium:  { capacidadMax: 2, precioBase: 3000, requiereAnticipo: true,  label: "Premium" },
  };

  const RECOMENDACIONES = [
    "Reforzar la capacitación del personal de atención al huésped.",
    "Revisar el mantenimiento preventivo de las instalaciones reportadas.",
    "Mejorar los tiempos de respuesta ante solicitudes durante la estancia.",
    "Verificar la limpieza y abastecimiento de amenidades en la habitación.",
  ];

  let contadorIdReserva = 1000;

  /* ---------------------------------------------------------------------
     Generación de habitaciones (equivalente a generar_habitaciones)
     --------------------------------------------------------------------- */
  function generarHabitaciones(total = TOTAL_HABITACIONES) {
    const tipos = Object.keys(TIPOS_SERVICIO);
    const habitaciones = [];
    for (let i = 0; i < total; i++) {
      const numero = 100 + i;
      const tipo = tipos[i % tipos.length];
      const info = TIPOS_SERVICIO[tipo];
      habitaciones.push({
        numHabitacion: numero,
        tipoServicio: tipo,
        capacidadMax: info.capacidadMax,
        precioPorUnidad: info.precioBase,
        estado: "Disponible",
      });
    }
    return habitaciones;
  }

  // Simula reservaciones previas al cargar la página (20%-45% ocupado)
  function generarReservacionesAleatorias(habitaciones, min = 0.2, max = 0.45) {
    const porcentaje = min + Math.random() * (max - min);
    const cantidad = Math.floor(habitaciones.length * porcentaje);
    const indices = new Set();
    while (indices.size < cantidad) {
      indices.add(Math.floor(Math.random() * habitaciones.length));
    }
    indices.forEach((idx) => { habitaciones[idx].estado = "Ocupada"; });
    return cantidad;
  }

  const obtenerDisponibles = (habitaciones) =>
    habitaciones.filter((h) => h.estado === "Disponible");

  const filtrarPorCapacidad = (disponibles, personas) =>
    disponibles.filter((h) => h.capacidadMax >= personas);

  const calcularMontoTotal = (precioPorUnidad, noches) =>
    Math.round(precioPorUnidad * noches * 100) / 100;

  const generarIdReserva = () => {
    contadorIdReserva += 1;
    const sufijo = 10 + Math.floor(Math.random() * 90);
    return `${contadorIdReserva}${sufijo}`;
  };

  const formatoMoneda = (n) =>
    n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  /* ---------------------------------------------------------------------
     Estado de la aplicación
     --------------------------------------------------------------------- */
  const state = {
    habitaciones: generarHabitaciones(),
    personas: null,
    noches: null,
    nombre: "",
    fecha: "",
    habitacionSeleccionada: null,
    reserva: null,
  };

  generarReservacionesAleatorias(state.habitaciones);

  /* ---------------------------------------------------------------------
     Referencias al DOM
     --------------------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);

  const availabilityBar = $("#availabilityBar");
  const reservaForm = $("#reservaForm");
  const simMessage = $("#simMessage");
  const roomRack = $("#roomRack");
  const roomRackGrid = $("#roomRackGrid");
  const ticketWrap = $("#ticketWrap");
  const ticketEl = $("#ticket");
  const confirmBtn = $("#confirmBtn");
  const changeRoomBtn = $("#changeRoomBtn");
  const closingWrap = $("#closingWrap");
  const closingForm = $("#closingForm");
  const closingResId = $("#closingResId");
  const summaryWrap = $("#summaryWrap");
  const summaryCard = $("#summaryCard");
  const restartBtn = $("#restartBtn");

  const navToggle = $("#navToggle");
  const navList = $("#navList");
  navToggle?.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navList?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navList.classList.remove("open"))
  );

  /* ---------------------------------------------------------------------
     Disponibilidad (equivalente a mostrar_resumen_disponibilidad)
     --------------------------------------------------------------------- */
  function pintarDisponibilidad() {
    const disponibles = obtenerDisponibles(state.habitaciones);
    const partes = [`<strong>${disponibles.length}</strong> de ${state.habitaciones.length} espacios libres`];
    Object.entries(TIPOS_SERVICIO).forEach(([key, info]) => {
      const cuantas = disponibles.filter((h) => h.tipoServicio === key).length;
      partes.push(`${info.label}: <strong>${cuantas}</strong>`);
    });
    availabilityBar.innerHTML = partes.map((p) => `<span>${p}</span>`).join("");
  }
  pintarDisponibilidad();

  /* ---------------------------------------------------------------------
     Validación de formulario (equivalente a leer_entero / leer_texto_no_vacio)
     --------------------------------------------------------------------- */
  function limpiarErrores(form) {
    form.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
  }

  function marcarError(nombreCampo, mensaje, form) {
    const errEl = form.querySelector(`[data-error-for="${nombreCampo}"]`);
    if (errEl) errEl.textContent = mensaje;
    const field = form.querySelector(`#${nombreCampo}`)?.closest(".field");
    field?.classList.add("has-error");
  }

  function validarReservaForm(data) {
    let ok = true;
    const errores = {};
    if (!data.nombre.trim()) {
      errores.nombre = "Este dato no puede quedar vacío.";
      ok = false;
    }
    const personasMax = Math.max(...Object.values(TIPOS_SERVICIO).map((t) => t.capacidadMax));
    if (!Number.isInteger(data.personas) || data.personas < 1 || data.personas > personasMax) {
      errores.personas = `Ingresa un número entre 1 y ${personasMax}.`;
      ok = false;
    }
    if (!data.fecha) {
      errores.fecha = "Selecciona una fecha de ingreso.";
      ok = false;
    }
    if (!Number.isInteger(data.noches) || data.noches < 1) {
      errores.noches = "Mínimo 1 noche.";
      ok = false;
    }
    return { ok, errores };
  }

  /* ---------------------------------------------------------------------
     Paso 1 → 2: enviar formulario, filtrar por capacidad
     --------------------------------------------------------------------- */
  reservaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErrores(reservaForm);

    const data = {
      nombre: reservaForm.nombre.value,
      personas: parseInt(reservaForm.personas.value, 10),
      fecha: reservaForm.fecha.value,
      noches: parseInt(reservaForm.noches.value, 10),
    };

    const { ok, errores } = validarReservaForm(data);
    if (!ok) {
      Object.entries(errores).forEach(([campo, msg]) => marcarError(campo, msg, reservaForm));
      simMessage.textContent = "";
      return;
    }

    state.nombre = data.nombre.trim();
    state.personas = data.personas;
    state.fecha = data.fecha;
    state.noches = data.noches;

    const disponibles = obtenerDisponibles(state.habitaciones);
    const opciones = filtrarPorCapacidad(disponibles, state.personas);

    // Mensaje personalizado (requisito: mostrar mensaje con el nombre)
    if (opciones.length === 0) {
      simMessage.textContent = `Lo sentimos, ${state.nombre}: no hay habitaciones disponibles para ${state.personas} persona(s) en este momento.`;
      roomRack.hidden = true;
      ticketWrap.hidden = true;
      return;
    }

    simMessage.textContent = `${state.nombre}, encontramos ${opciones.length} habitación(es) para ${state.personas} persona(s).`;
    pintarRoomRack(opciones);
    roomRack.hidden = false;
    ticketWrap.hidden = true;
    closingWrap.hidden = true;
    summaryWrap.hidden = true;
    roomRack.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------------------------------------------------------------------
     Rejilla de habitaciones (equivalente a mostrar_opciones_habitacion)
     --------------------------------------------------------------------- */
  function pintarRoomRack(opciones) {
    roomRackGrid.innerHTML = "";
    opciones.forEach((hab) => {
      const info = TIPOS_SERVICIO[hab.tipoServicio];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "rack-card";
      card.innerHTML = `
        <p class="rc-num">#${hab.numHabitacion}</p>
        <p class="rc-type">${info.label} · hasta ${hab.capacidadMax} pers.</p>
        <p class="rc-price">${formatoMoneda(hab.precioPorUnidad)} / noche</p>
        ${info.requiereAnticipo ? '<p class="rc-anticipo">Requiere anticipo</p>' : ""}
      `;
      card.addEventListener("click", () => seleccionarHabitacion(hab, card));
      roomRackGrid.appendChild(card);
    });
  }

  function seleccionarHabitacion(hab, cardEl) {
    roomRackGrid.querySelectorAll(".rack-card").forEach((c) => c.classList.remove("selected"));
    cardEl.classList.add("selected");
    state.habitacionSeleccionada = hab;

    // Clasificación if/else (requiere anticipo o no) + cálculo automático
    const info = TIPOS_SERVICIO[hab.tipoServicio];
    const montoTotal = calcularMontoTotal(hab.precioPorUnidad, state.noches);

    state.reserva = {
      idReserva: null,
      nombreTitular: state.nombre,
      fechaIngreso: state.fecha,
      habitacion: hab,
      noches: state.noches,
      montoTotal,
      requiereAnticipo: info.requiereAnticipo,
    };

    pintarTicket(false);
    ticketWrap.hidden = false;
    ticketWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------------------------------------------------------------------
     Boleto / confirmación (equivalente a mostrar_confirmacion)
     --------------------------------------------------------------------- */
  function pintarTicket(confirmado) {
    const r = state.reserva;
    const info = TIPOS_SERVICIO[r.habitacion.tipoServicio];
    ticketEl.className = "ticket" + (confirmado ? " confirmed" : "");
    ticketEl.innerHTML = `
      <div class="ticket-stamp">CONFIRMADO</div>
      <div class="ticket-main">
        <dl>
          <dt>Titular</dt><dd>${r.nombreTitular}</dd>
          <dt>Habitación</dt><dd>#${r.habitacion.numHabitacion} · ${info.label}</dd>
          <dt>Ingreso</dt><dd>${r.fechaIngreso}</dd>
          <dt>Duración</dt><dd>${r.noches} noche(s)</dd>
          <dt>Precio/noche</dt><dd>${formatoMoneda(r.habitacion.precioPorUnidad)}</dd>
          <dt>Monto total</dt><dd>${formatoMoneda(r.montoTotal)}</dd>
          <dt>Anticipo</dt><dd>${r.requiereAnticipo ? "Sí" : "No"}</dd>
        </dl>
      </div>
      <div class="ticket-id">${confirmado && r.idReserva ? "RES-" + r.idReserva : "SIN CONFIRMAR"}</div>
    `;
  }

  confirmBtn.addEventListener("click", () => {
    if (!state.reserva) return;
    state.reserva.habitacion.estado = "Ocupada";
    state.reserva.idReserva = generarIdReserva();
    pintarTicket(true);
    pintarDisponibilidad();

    closingResId.textContent = state.reserva.idReserva;
    closingWrap.hidden = false;
    closingWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // Cambio de habitación (equivalente a cambiar_habitacion)
  changeRoomBtn.addEventListener("click", () => {
    if (state.reserva?.habitacion?.estado === "Ocupada") {
      state.reserva.habitacion.estado = "Disponible";
      pintarDisponibilidad();
    }
    const disponibles = obtenerDisponibles(state.habitaciones);
    const opciones = filtrarPorCapacidad(disponibles, state.personas);
    if (opciones.length === 0) {
      simMessage.textContent = "No hay otras habitaciones disponibles para tu grupo. Se mantiene la selección original.";
      return;
    }
    pintarRoomRack(opciones);
    ticketWrap.hidden = true;
    roomRack.hidden = false;
    roomRack.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------------------------------------------------------------------
     Cierre de instancia: queja + calificación + recomendación
     (equivalente a cerrar_instancia / generar_recomendacion)
     --------------------------------------------------------------------- */
  closingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const calificacion = closingForm.calificacion.value;
    const queja = closingForm.queja.value.trim();

    if (!calificacion) {
      closingForm.calificacion.focus();
      return;
    }

    const r = state.reserva;
    const info = TIPOS_SERVICIO[r.habitacion.tipoServicio];
    let recomendacionHtml = `<p>No se registraron quejas. ¡Gracias por hospedarte con StayRest!</p>`;

    if (queja) {
      const recomendacion = RECOMENDACIONES[Math.floor(Math.random() * RECOMENDACIONES.length)];
      recomendacionHtml = `
        <div class="rec">
          <p><strong>Queja registrada:</strong> ${queja}</p>
          <p><strong>Recomendación generada para el equipo:</strong> ${recomendacion}</p>
          <p>Este comentario se tomará en cuenta para la próxima vez.</p>
        </div>`;
    }

    summaryCard.innerHTML = `
      <dl>
        <dt>Reserva</dt><dd>#${r.idReserva}</dd>
        <dt>Titular</dt><dd>${r.nombreTitular}</dd>
        <dt>Habitación</dt><dd>#${r.habitacion.numHabitacion} · ${info.label}</dd>
        <dt>Monto total</dt><dd>${formatoMoneda(r.montoTotal)}</dd>
        <dt>Calificación</dt><dd>${calificacion} / 5</dd>
      </dl>
      ${recomendacionHtml}
    `;

    closingWrap.hidden = true;
    summaryWrap.hidden = false;
    summaryWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------------------------------------------------------------------
     Reiniciar simulación
     --------------------------------------------------------------------- */
  restartBtn.addEventListener("click", () => {
    state.habitacionSeleccionada = null;
    state.reserva = null;
    reservaForm.reset();
    reservaForm.personas.value = 2;
    reservaForm.noches.value = 2;
    limpiarErrores(reservaForm);
    simMessage.textContent = "";
    roomRack.hidden = true;
    ticketWrap.hidden = true;
    closingWrap.hidden = true;
    summaryWrap.hidden = true;
    reservaForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
