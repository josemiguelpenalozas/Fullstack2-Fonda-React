# Fullstack2-Fonda-React

README formal y completo del proyecto Fullstack2-Fonda-React.

Descripción
-----------

`Fullstack2-Fonda-React` es una aplicación front-end construida con React y Vite que implementa la interfaz de administración para una tienda/evento llamada "Fonda". Proporciona pantallas para gestión de productos, categorías, usuarios, órdenes y un panel de métricas (dashboard) con gráficos. También incluye una página de historial de actividades con funcionalidades para filtrar, exportar y limpiar registros.

Principales características
- Interfaz de administración con layout y sidebar reutilizables.
- Dashboard con gráficos (Chart.js + react-chartjs-2) y métricas de ejemplo.
- Páginas para Productos, Categorías, Usuarios y Órdenes.
- Historial de actividades con filtros, exportación y limpieza del historial.
- Test suite con Vitest y Testing Library para componentes críticos.

Tecnologías
- React 19
- Vite
- Chart.js + react-chartjs-2
- Bootstrap 5 + Bootstrap Icons
- React Router DOM
- Vitest + @testing-library/react para tests

Requisitos previos
- Node.js (recomendado: >=16). Asegúrate de tener `npm` disponible.

Instalación
----------

Desde la raíz del proyecto, instala dependencias:

```bash
npm install
```

Scripts disponibles
-------------------

Los scripts definidos en `package.json` son:

- `npm run dev` — Inicia el servidor de desarrollo (Vite).
- `npm run build` — Crea la versión de producción.
- `npm run preview` — Previsualiza la versión de producción localmente (Vite preview).
- `npm run lint` — Ejecuta ESLint sobre el código.
- `npm test` — Ejecuta la suite de tests con Vitest.

Uso (desarrollo)
----------------

Levanta la aplicación en modo desarrollo:

```bash
npm run dev
```

Abre el navegador en la URL que Vite muestre (por defecto http://localhost:5173).

Ejecución de tests
------------------

La aplicación usa Vitest y Testing Library. Ejecuta todos los tests con:

```bash
npm test
# o con vitest directamente
npx vitest
```

Si quieres ejecutar Vitest en modo interacción/observador:

```bash
npx vitest --watch
```

Estructura del proyecto (resumen)
--------------------------------

Ramas y archivos clave en `src/`:

- `src/main.jsx` — Punto de entrada de la aplicación.
- `src/App.jsx` — Componente raíz.
- `src/pages/` — Contiene las páginas principales (Home, Productos, Admin, etc.).
- `src/components/` — Componentes reutilizables (Footer, Oferta, Producto, AdminLayout, Sidebar, charts, etc.).
- `src/components/admin/tests/` — Tests de integración/unitarios para la parte de administración (Vitest).
- `public/data/` — Archivos JSON con datos de ejemplo (`productos.json`, `ofertas.json`).

Consejos sobre tests
- La suite ya incluye mocks intensivos (por ejemplo, mocks para los componentes de charts y para `localStorage`) para mantener los tests aislados y rápidos.
- Para añadir tests nuevos, crea archivos `*.test.jsx` bajo la carpeta correspondiente y usa `@testing-library/react`.

Contribuir
---------

Si deseas contribuir:

1. Crea un fork y una rama feature/bugfix.
2. Añade tests para cambios nuevos o correcciones.
3. Abre un pull request describiendo los cambios y su justificación.

Notas y supuestos
-----------------
- Este README asume un entorno Node.js moderno. Si tu proyecto requiere una versión específica de Node o herramientas adicionales, añade esa información en la raíz del repositorio (archivo `ENG.md` o `CONTRIBUTING.md`).
- No se ha incluido un archivo de licencia en este repositorio; añade un `LICENSE` si quieres publicar el proyecto con una licencia específica.

Contacto
--------

Si necesitas ayuda con la configuración del proyecto, ejecución de tests o integración continua, comparte la salida de `npm test` o describe el problema y lo revisaré.

---

Archivo generado automáticamente: resumen del estado actual del proyecto.
