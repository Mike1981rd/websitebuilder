# 🏗️ Flujo de Construcción Claude-Usuario

## 📋 Resumen

Este documento define el proceso de colaboración entre Claude y el Usuario para construir módulos de manera impecable, sin errores y con todas las funcionalidades implementadas.

**Fecha de creación**: Enero 2025  
**Estado**: Activo  
**Aplicable a**: Todos los nuevos módulos del proyecto Hotel23

---

## 🎯 Principios Fundamentales

1. **Información completa antes de empezar**
2. **Claude prepara, Usuario ejecuta**
3. **Validación en cada paso**
4. **Comunicación clara y estructurada**
5. **Cero supuestos, todo explícito**

---

## 📐 Flujo de Trabajo Paso a Paso

### PASO 1: Definición del Módulo

**Usuario proporciona:**
```markdown
## Módulo: [Nombre]

### UI
- Vista Index: [Screenshot/Mockup]
- Vista Create/Edit: [Screenshot/Mockup]
- Otras vistas necesarias: [Screenshots]

### Funcionalidades
- [Lista de funcionalidades específicas]
- [Comportamientos esperados]
- [Validaciones necesarias]

### Reglas de Negocio
- [Restricciones]
- [Casos especiales]
- [Integraciones]
```

**Claude responde con:**
- Confirmación de entendimiento
- Preguntas de clarificación si hay
- Plan de implementación

---

### PASO 2: Modelo y Migración

**Claude prepara:**
```csharp
// 1. Modelo completo con todas las anotaciones
public class [Modelo]
{
    // Propiedades con validaciones
    // Relaciones de navegación
    // Índices si son necesarios
}

// 2. Comando de migración
// Ejecutar en Package Manager Console:
Add-Migration Create[Modelo]Table
```

**Usuario ejecuta:**
1. Copia el modelo al proyecto
2. Ejecuta el comando de migración en Visual Studio
3. Revisa la migración generada
4. Ejecuta `Update-Database`
5. Confirma: "Migración ejecutada exitosamente"

**⚠️ REGLA CRÍTICA**: Claude NUNCA ejecuta comandos de Entity Framework directamente

---

### PASO 3: Controller

**Claude prepara:**
```csharp
// Controller completo con:
- Constructor con dependencias
- Todas las acciones CRUD
- Manejo de errores con try-catch
- Logging
- Autorización
- Validaciones server-side
- Mensajes TempData
```

**Usuario:**
1. Crea el archivo del Controller
2. Copia el código
3. Confirma compilación exitosa

---

### PASO 4: Vistas

**Claude prepara:**
- Index.cshtml
- Create.cshtml
- Edit.cshtml
- _PartialViews necesarias
- JavaScript asociado
- CSS específico si es necesario

**Consideraciones:**
- Usar el layout correcto del proyecto
- Mantener estilo dark mode
- Incluir traducciones preparadas
- Responsive design

**Usuario:**
1. Crea las vistas en las carpetas correctas
2. Copia el código
3. Prueba la navegación

---

### PASO 5: JavaScript y Funcionalidades Avanzadas

**Claude prepara:**
- Event handlers
- Validaciones client-side
- Integraciones AJAX
- Funcionalidades especiales (drag & drop, etc.)

**Usuario:**
1. Integra el JavaScript
2. Prueba las funcionalidades
3. Reporta cualquier issue

---

### PASO 6: Testing y Refinamiento

**Usuario:**
- Prueba todos los casos de uso
- Reporta bugs o mejoras necesarias

**Claude:**
- Proporciona fixes específicos
- Sugiere optimizaciones

---

## 🔧 Plantilla de Trabajo para Colecciones

### 1. INFORMACIÓN REQUERIDA DEL USUARIO

```markdown
## Módulo: Colecciones

### UI
- Vista Index: [Adjuntar imagen]
- Vista Create: [Adjuntar imagen]
- Vista Edit: [Reutiliza Create o es diferente?]

### Campos Confirmados
- Title (requerido, 255 chars)
- Description (HTML rico)
- Handle (auto-generado, único)
- ImageUrl (upload con preview)
- IsActive (toggle)
- CollectionType (manual/smart)
- SortOrder (para productos)
- SEO Title (60 chars)
- SEO Description (160 chars)

### Funcionalidades Específicas
- [ ] Auto-generar handle desde título
- [ ] Preview SEO en tiempo real
- [ ] Upload imagen drag & drop
- [ ] Validar handle único via AJAX
- [ ] Contador de caracteres para SEO
- [ ] Editor HTML para descripción

### Comportamientos
- Al crear: Redirigir a Edit
- Al guardar: Mensaje de éxito y permanecer
- Al eliminar: Confirmar y redirigir a Index
- Handle: Convertir a lowercase y reemplazar espacios con guiones
```

### 2. ORDEN DE IMPLEMENTACIÓN

1. **Modelo y Migración** ✓
2. **CollectionsController básico**
3. **Vista Index**
4. **Vista Create**
5. **Vista Edit**
6. **JavaScript para handle y SEO**
7. **Upload de imágenes**
8. **Validaciones AJAX**
9. **Smart Collections (Fase 2)**

---

## 🖼️ UI Referencias para Colecciones

### Vista Index (collectionindex.png)
**Características observadas:**
- Tabla estilo Shopify con columnas: Título, Productos, Condiciones
- Checkbox para selección múltiple
- Botón "Crear colección" arriba a la derecha (negro)
- Dropdown "Más acciones" para bulk operations
- Iconos de búsqueda y filtros
- Imagen thumbnail de la colección
- Link "Más información sobre colecciones"
- Fondo blanco, diseño limpio

### Vista Create (crearcoleccion.png)
**Características observadas:**
- Layout de dos columnas (formulario principal | sidebar derecha)
- **Campos principales:**
  - Título (input simple)
  - Descripción (editor de texto rico con toolbar completo)
  - Tipo de colección (Radio buttons: Manual/Inteligente)
  - Productos (búsqueda y lista con ordenamiento)
- **Sidebar derecha:**
  - Publicación (Canales de ventas con checkboxes)
  - Imagen (drag & drop area punteada)
  - Plantilla de tema (selector dropdown)
- **SEO (colapsado):** "Publicación en motores de búsqueda"
- Botón "Guardar" arriba a la derecha
- Breadcrumb con flecha de regreso

**Elementos específicos del editor de texto:**
- Formato de párrafo dropdown
- Bold, Italic, Underline, Strikethrough
- Alineación, listas, links
- Insertar tabla, código
- Más opciones (...)

---

## ✅ Checklist de Calidad

Antes de cada entrega, Claude verifica:

### Código C#
- [ ] Compilación sin errores
- [ ] Nombres consistentes con el proyecto
- [ ] Try-catch en operaciones de BD
- [ ] Logs en acciones importantes
- [ ] Authorize en controller
- [ ] ValidateAntiForgeryToken en POST

### Vistas
- [ ] Layout correcto aplicado
- [ ] Estilo dark mode respetado
- [ ] Clases CSS consistentes
- [ ] Scripts en sección correcta
- [ ] Responsive design
- [ ] Mensajes de validación

### JavaScript
- [ ] Sin variables globales innecesarias
- [ ] Event handlers con namespaces
- [ ] Validaciones client-side
- [ ] Manejo de errores AJAX
- [ ] Console.logs removidos

### Base de Datos
- [ ] Migración lista para ejecutar
- [ ] Índices necesarios incluidos
- [ ] Constraints apropiados
- [ ] Valores default definidos

---

## 🚨 Puntos Críticos a Evitar

1. **NO** ejecutar comandos `dotnet ef` - Solo preparar
2. **NO** asumir estructura de carpetas - Preguntar
3. **NO** usar librerías no confirmadas
4. **NO** cambiar convenciones existentes
5. **NO** crear vistas sin ver las UI proporcionadas

---

## 📝 Formato de Comunicación

### Usuario solicita:
"Necesito implementar [módulo]. Te paso las UI:"
- [Adjunta imágenes]
- [Especifica comportamientos especiales]

### Claude responde:
"Entendido. Vamos a implementar [módulo] con estas características:
- [Lista de confirmación]
¿Procedemos con el Paso 1: Modelo y Migración?"

### Usuario confirma:
"Sí, procede" o "Ajusta esto: [cambios]"

---

## 🎯 Resultado Esperado

Al seguir este flujo:
1. **Cero errores** de compilación
2. **Funcionalidad completa** desde el primer intento
3. **Código mantenible** y consistente
4. **UI exacta** a lo solicitado
5. **Usuario satisfecho** 😊

---

*Este documento es la guía definitiva para nuestra colaboración. Cualquier desviación debe ser explícitamente acordada.*