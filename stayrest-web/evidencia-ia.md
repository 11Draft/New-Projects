# Evidencia de uso responsable de inteligencia artificial

Proyecto: **StayRest — sitio web**
Integrantes: 
- Jesús Manuel Balderas Lozano
- Luz Maria Jimenez Hernandez
*Materia*: Innovación y Tecnologías de la Información — Tercer parcial

Esta evidencia documenta cómo se usó IA (Claude) como apoyo para convertir el prototipo `StayRest.py` (segundo parcial) en el sitio web entregado, tal como pide el punto 8 del proyecto final.

---

## 1. Prompt utilizado

> "Genera un proyecto basado en el contexto" (a partir de la guía del proyecto final en PDF y del archivo `StayRest.py` del segundo parcial, ambos adjuntos).

En esencia, se le pidió a la IA que tomara la lógica de negocio ya construida en Python y la transformara en un sitio HTML/CSS/JS que cumpliera los requisitos mínimos del parcial: encabezado, navegación, secciones de contenido, formulario/simulador, pie de página, al menos una interacción funcional en JavaScript y estructura de archivos publicable en GitHub Pages.

## 2. Respuesta obtenida

La IA generó cuatro archivos completos:

- **`index.html`** — estructura con las seis secciones pedidas (Inicio, Problema, Solución, Funcionamiento, Usuarios, Créditos), navegación y pie de página.
- **`style.css`** — identidad visual propia (paleta verde botella + dorado, tipografías Fraunces/Inter/IBM Plex Mono), con un elemento distintivo: tarjetas tipo "llave de hotel" y un boleto de confirmación estilo *boarding pass*.
- **`script.js`** — puerto de la lógica de `StayRest.py` a JavaScript: generación de 100 habitaciones, ocupación aleatoria inicial, filtrado por capacidad, cálculo de monto total, determinación de anticipo, generación de ID de reserva, cambio de habitación y cierre de instancia (calificación + queja + recomendación aleatoria).
- **`README.md`** — instrucciones de publicación en GitHub Pages y relación con los parciales anteriores.

## 3. Código modificado o corregido por el estudiante

> Espacio para completar por el estudiante antes de entregar. Ejemplos de lo que normalmente se ajusta en este paso:
>
> - Cambiar el nombre del grupo y del docente en la sección de Créditos (`index.html`, quedaron como marcadores `___________`).
> - Ajustar el rango de capacidad máxima (`max="6"`) del campo "Huéspedes" si se decide agregar o quitar tipos de servicio.
> - Revisar y, si se desea, personalizar los textos de recomendaciones en `RECOMENDACIONES` (`script.js`).
> - Sustituir el enlace de ejemplo del README por el enlace real una vez publicado en GitHub Pages.

## 4. Explicación de qué hace el código

- **`generarHabitaciones()`** crea el inventario de 100 habitaciones repartidas de forma equitativa entre los cuatro tipos de servicio, igual que `generar_habitaciones()` en Python.
- **`generarReservacionesAleatorias()`** ocupa entre 20% y 45% de las habitaciones al cargar la página, simulando que ya existían reservas previas.
- El formulario de la sección "Reservar" valida que ningún campo quede vacío y que los números estén en rango antes de continuar (equivalente a `leer_entero` / `leer_texto_no_vacio`).
- Al enviarlo, se filtran las habitaciones disponibles cuya capacidad máxima soporte al número de huéspedes (`filtrarPorCapacidad`), y se muestra un mensaje personalizado usando el nombre del titular.
- Al elegir una habitación se calcula el monto total (`precio × noches`) y se clasifica si requiere anticipo (Suite/Premium), mostrando un boleto de confirmación.
- Al confirmar, se genera un ID de reserva único y la habitación pasa a estado "Ocupada"; existe también la opción de cambiar de habitación después de confirmar.
- Al cerrar la instancia se pide una calificación del 1 al 5 y, si se registra una queja, el sistema elige aleatoriamente una recomendación para el equipo y lo indica en el resumen final.

## 5. Dificultades encontradas y cómo se resolvieron

> Espacio para completar por el estudiante con base en su propia experiencia al revisar, probar y publicar el sitio. Ejemplos de dificultades típicas en este tipo de conversión:
>
> - **Traducir el flujo de consola a interfaz gráfica:** en Python el programa pausa con `input()` en cada paso; en la web hubo que resolverlo con pasos visibles/ocultos (`hidden`) que se van revelando conforme el usuario avanza en el formulario.
> - **Mantener sincronizado el estado de las habitaciones:** al no haber una base de datos, el estado de ocupación vive en memoria del navegador (`state.habitaciones`) y se resetea si se recarga la página; se documentó esta limitación para la sección de conclusiones.
> - **Verificar la interacción en móvil:** se revisó que el formulario y las tarjetas de habitación se reacomoden en pantallas pequeñas (rejilla de una columna) antes de dar por terminada la interactividad.

---

*Este documento, junto con capturas de pantalla del sitio funcionando y el enlace de GitHub Pages, forma parte del PDF de entrega solicitado en el punto 9 del proyecto final.*
