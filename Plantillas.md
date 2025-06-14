# Módulo de Plantillas - Documentación de Implementación

## CONTEXTO DEL PROYECTO
Este documento detalla la implementación del módulo de Plantillas con funcionalidad completa de Presentación de Diapositivas, manteniendo sincronización total entre editor y preview, incluyendo tipografías y esquemas de colores consistentes con el módulo de Encabezados existente.

## OBJETIVO PRINCIPAL
Desarrollar el módulo de Plantillas con funcionalidad completa de Presentación de Diapositivas, manteniendo sincronización total entre editor y preview, incluyendo tipografías y esquemas de colores consistentes con el módulo de Encabezados existente.

## REQUISITOS CRÍTICOS DE SINCRONIZACIÓN
- **Sincronización Editor-Preview**: Todos los cambios deben reflejarse simultáneamente en ambas vistas
- **Consistencia Visual**: Tipografías y esquemas de colores deben coincidir exactamente con la implementación de Encabezados
- **Arquitectura Base**: Utilizar la misma estructura de código del módulo de Encabezados como referencia

## CHECKLIST DE IMPLEMENTACIÓN

### ☐ Fase 1: Limpieza y Preparación
- [ ] Eliminar toda la información visual existente en el módulo de plantillas
- [ ] Preparar estructura base limpia

### ☐ Fase 2: Funcionalidad de Agregado
- [ ] Implementar opción "Agregar Sección" idéntica al módulo de Encabezados
- [ ] Configurar modal de opciones para selección de plantillas
- [ ] Asegurar que las opciones seleccionadas se agreguen correctamente al área de plantillas

### ☐ Fase 3: Controles de Acción
- [ ] Implementar iconos de acción idénticos a los de la barra de anuncios
- [ ] Configurar funcionalidad de cada icono de acción

### ☐ Fase 4: Sistema de Persistencia
- [ ] Implementar sistema de guardado consistente con el resto del proyecto
- [ ] Revisar Claude.md para aplicar el sistema de guardado establecido

### ☐ Fase 5: Interactividad Avanzada
- [ ] Implementar funcionalidad drag & drop del módulo de Encabezados
- [ ] Configurar sistema de colapsadores similar al de Encabezados

### ☐ Fase 6: Vista de Configuración - Presentación de Diapositivas
- [ ] Crear panel de configuración usando la misma lógica de Encabezados
- [ ] Implementar vista según imagen: `C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\configuracion presentacion de diapositivas.png`

#### Especificaciones de Controles:
- **Select Diseño**:
  - Opciones: "Ancho Completo", "Página"
  - Referencia visual Ancho Completo: `C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\AnchoCompleto.png`
  - Referencia visual Página: `C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\Opcion Pagina.png`
  - Investigar comportamiento estándar de Shopify para cada opción

- **Select Altura**:
  - Opciones: "Adaptar a la Primera Imagen", "Pequeña", "Mediana", "Grande"

- **Select Paginación**:
  - Opciones: "Puntos", "Contador", "Números"

- **Select Animación**:
  - Opciones: "Ninguna", "Movimiento de Ambientes"

### ☐ Fase 7: Configuración Individual de Diapositivas
- [ ] Crear vista de configuración de diapositivas individuales
- [ ] Implementar según imágenes de referencia:
  - `C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\ConfiguracionDiapositiva1.png`
  - `C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\ConfiguracionDiapositiva2.png`
  - `C:\Users\hp\Documents\Visual Studio 2022\Projects\Hotel23\TestImages\ConfiguracionDiapositiva3.png`

### ☐ Fase 8: Controles de Visibilidad y Eliminación
- [ ] Implementar icono de ojo (mostrar/ocultar) con funcionamiento idéntico a Encabezados
- [ ] Implementar icono de papelera (eliminar) con funcionamiento idéntico a Encabezados

## ESPECIFICACIONES TÉCNICAS DETALLADAS

### Configuración Global de Presentación de Diapositivas

| Configuración | Acción del Usuario | Comportamiento Resultante |
|--------------|-------------------|--------------------------|
| Altura de diapositiva | Selección entre: Adaptar a primera imagen, Pantalla completa, Pequeña, Mediana, Grande | Adaptar: Altura basada en primera imagen; Pantalla completa: Ocupar altura visible del navegador; Altura Fija: Altura constante independiente del tamaño de imagen |
| Reproducción automática | Activar/Desactivar casilla | Activado: Cambio automático de diapositivas; Desactivado: Permanece estático hasta interacción manual |
| Intervalo entre diapositivas | Control deslizante 3-10 segundos | Define duración de visualización por diapositiva (solo si reproducción automática está activa) |
| Mostrar flechas de navegación | Activar/Desactivar casilla | Activado: Flechas < y > visibles; Desactivado: Sin flechas de navegación |
| Mostrar paginación | Activar/Desactivar casilla | Activado: Puntos de navegación visibles; Desactivado: Sin indicadores de página |
| Efecto de transición | Selección: Deslizar, Fundido | Deslizar: Transición lateral tipo carrusel; Fundido: Transición suave por desvanecimiento |

### Configuración Individual de Diapositivas

| Configuración | Acción del Usuario | Comportamiento Resultante |
|--------------|-------------------|--------------------------|
| Imagen de fondo (Desktop) | Subir imagen para pantallas grandes | Imagen de fondo principal para dispositivos de escritorio y tablets |
| Imagen de fondo (Móvil) | Subir imagen optimizada para vertical | Con imagen: Visualización específica para móviles; Sin imagen: Recorte automático de imagen de escritorio |
| Título (Heading) | Escribir texto principal | Texto prominente superpuesto sobre imagen de fondo |
| Subtítulo/Párrafo | Escribir texto secundario | Texto complementario con menor prominencia visual |
| Posición del contenido | Seleccionar alineación | Ubicación del bloque de texto y botón dentro de la diapositiva |
| Texto del botón | Escribir etiqueta del botón | Texto visible en el botón de acción |
| Enlace del botón | Configurar URL de destino | Destino de redirección al hacer clic en el botón |
| Superposición y Colores | Ajustar colores y opacidad | Mejora de legibilidad y consistencia con identidad de marca |

## DOCUMENTACIÓN PARA FUTURAS IMPLEMENTACIONES

### Patrón Estándar para Nuevas Opciones del Modal:
1. **Estructura de Configuración Global**: Crear tabla de especificaciones con columnas: Configuración, Acción del Usuario, Comportamiento Resultante
2. **Estructura de Configuración Individual**: Definir elementos configurables por bloque/elemento individual
3. **Sistema de Sincronización**: Mantener consistencia entre editor y preview
4. **Controles de Acción**: Implementar iconos estándar (ojo, papelera, configuración)
5. **Persistencia**: Aplicar sistema de guardado unificado del proyecto

## NOTAS TÉCNICAS CRÍTICAS DEL SISTEMA SHOPIFY

### Sistema de Optimización de Imágenes
Shopify implementa un sistema automático de optimización que:
- Procesa la imagen maestra creando múltiples versiones en tamaños estandarizados
- Distribuye globalmente a través de CDN para carga rápida
- Entrega inteligente basada en dispositivo, resolución y conexión
- Convierte automáticamente a formatos modernos (WebP, AVIF)

**Recomendación**: Siempre cargar imágenes de máxima calidad disponible, ya que Shopify optimiza automáticamente para cada contexto de visualización.

## ENTREGABLES ESPERADOS
1. Archivo Plantillas.md completamente documentado ✓
2. Módulo de Plantillas funcional con Presentación de Diapositivas
3. Sincronización completa editor-preview
4. Consistencia visual con módulo de Encabezados
5. Sistema de guardado integrado
6. Documentación del patrón para futuras implementaciones

## ESTRUCTURA DE DATOS PROPUESTA

### Configuración Global de Slideshow
```javascript
currentSectionsConfig.slideshow = {
    config: {
        layout: 'fullWidth', // 'fullWidth' | 'page'
        height: 'adaptToFirstImage', // 'adaptToFirstImage' | 'small' | 'medium' | 'large'
        autoplay: false,
        autoplayInterval: 5, // 3-10 segundos
        showNavigationArrows: true,
        showPagination: true,
        paginationType: 'dots', // 'dots' | 'counter' | 'numbers'
        transitionEffect: 'slide', // 'slide' | 'fade'
        animation: 'none' // 'none' | 'ambientMovement'
    },
    slides: {
        'slide-1': {
            id: 'slide-1',
            order: 1,
            isHidden: false,
            desktopImage: '',
            mobileImage: '',
            title: '',
            subtitle: '',
            contentPosition: 'center', // 'left' | 'center' | 'right'
            buttonText: '',
            buttonLink: '',
            overlayColor: '',
            overlayOpacity: 0.3,
            colorScheme: 'scheme1'
        }
    },
    slideOrder: ['slide-1']
}
```

## PUNTOS CRÍTICOS DE IMPLEMENTACIÓN

### 1. Reutilización del Código de Encabezados
- Copiar estructura de renderizado y configuración
- Mantener misma lógica de drag & drop
- Aplicar mismo sistema de colapsadores

### 2. Sistema de Preview en Tiempo Real
- Implementar `renderSlideshow()` similar a `renderHeader()`
- Actualizar preview al cambiar cualquier configuración
- Mantener sincronización de estilos y fuentes

### 3. Gestión de Estados
- Variable global `currentSlideshowIndex` para navegación entre slides
- Flag `hasPendingSlideshowChanges` para cambios pendientes
- Mantener coherencia con el resto del sistema

### 4. Event Handlers Críticos
- Cambio de slide activo
- Upload de imágenes (desktop/mobile)
- Actualización de configuración global
- Navegación entre slides individuales

### 5. Validaciones Importantes
- Mínimo una slide activa (no oculta)
- Validación de URLs en botones
- Límites de caracteres en títulos/subtítulos
- Formato de imágenes soportado