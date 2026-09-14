# StayRest — Sitio web

Proyecto final, tercer parcial de **Innovación y Tecnologías de la Información**.
Transforma el prototipo `StayRest.py` (segundo parcial) en un sitio web funcional con HTML, CSS y JavaScript, publicado en GitHub Pages.

## Integrante
- Jesús Manuel Balderas Lozano — Ingeniería en Sistemas Computacionales

## Enlace publicado
> Reemplaza esta línea con tu enlace de GitHub Pages una vez publicado, por ejemplo:
> `https://<tu-usuario>.github.io/stayrest-web/`

## Estructura del repositorio
```
stayrest-web/
├── index.html        # Estructura de la página (secciones del parcial)
├── style.css         # Estilos (paleta hotelera: verde botella + dorado)
├── script.js         # Lógica del simulador (puerto de StayRest.py)
├── img/               # Carpeta para imágenes, si se agregan
├── evidencia-ia.md    # Evidencia de uso responsable de IA
└── README.md
```

## Qué hace el sitio
El sitio conserva la misma lógica de negocio del prototipo en Python:

- Inventario de 100 habitaciones repartidas en 4 tipos de servicio (Estándar, Terraza, Suite, Premium).
- Al cargar la página se simulan reservaciones previas aleatorias (20%–45% ocupado), igual que `generar_reservaciones_aleatorias`.
- El formulario de la sección **Reservar** valida los datos (nombre, huéspedes, fecha, noches) antes de continuar.
- Se filtran las habitaciones disponibles según la capacidad máxima requerida (`filtrar_por_capacidad`).
- Al elegir una habitación se calcula el monto total (`precio × noches`) y se clasifica si requiere anticipo (Suite/Premium).
- El botón **Confirmar reserva** marca la habitación como ocupada y genera un ID de reserva automático, igual que `generar_id_reserva`.
- Existe la opción de **cambiar de habitación** después de seleccionar una, igual que `cambiar_habitacion`.
- Al cerrar la instancia se pide una calificación (1–5) y, si el huésped deja una queja, se genera una recomendación aleatoria para el equipo — igual que `generar_recomendacion` / `cerrar_instancia`.

## Cómo publicarlo en GitHub Pages
1. Crea un repositorio nuevo (por ejemplo `stayrest-web`) y sube estos archivos a la raíz.
2. Entra a **Settings → Pages** del repositorio.
3. En "Build and deployment", selecciona **Deploy from a branch**, rama `main`, carpeta `/root`.
4. Guarda y espera unos minutos; GitHub te dará el enlace público (`https://<usuario>.github.io/<repo>/`).
5. Pega ese enlace arriba, en este README y en el documento PDF de entrega.

## Cómo probarlo localmente
Solo abre `index.html` en el navegador — no requiere servidor ni instalación, es HTML/CSS/JS puro sin dependencias externas (excepto las tipografías de Google Fonts, que requieren conexión a internet).

## Continuidad con parciales anteriores
| Parcial | Entregable | Relación |
|---|---|---|
| 1er parcial | Pseudocódigo, algoritmo, variables | Reglas de negocio originales (capacidad, tipos de servicio, anticipo) |
| 2do parcial | `StayRest.py` (Python, modular) | Lógica implementada por primera vez en código |
| 3er parcial | Este sitio web | Misma lógica, en JavaScript, con interfaz gráfica publicada en línea |
