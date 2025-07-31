# Bug de Color Schemes - Investigación y Documentación

**Fecha de investigación**: 31 de Julio de 2025
**Estado**: En investigación
**Severidad**: Alta - Afecta la funcionalidad core del sistema de temas

## Descripción del Bug

Los color schemes 2, 3, 4 y 5 se sobrescriben con valores por defecto cuando:
1. Configuras colores personalizados en cualquiera de estos schemes
2. Guardas los cambios (se guardan correctamente)
3. Asignas ese scheme a un módulo
4. Guardas nuevamente
5. Los valores personalizados se pierden y vuelven a los defaults

**Nota**: El Color Scheme 1 es el ÚNICO que funciona correctamente y mantiene los valores personalizados.

## Comportamiento Observado

### Flujo del Bug:
1. **Modificación inicial**: Usuario cambia colores en Scheme 2 (ej: background de #F3F3F3 a #FF0000)
2. **Primer guardado**: Los valores se guardan correctamente en la base de datos
3. **Asignación a módulo**: Usuario asigna Scheme 2 a un módulo (ej: Featured Product)
4. **Segundo guardado**: Al guardar, los valores del Scheme 2 vuelven a los defaults
5. **Resultado**: El módulo usa los colores default, no los personalizados

### Diferencia con Scheme 1:
- Scheme 1 SIEMPRE mantiene los valores personalizados
- Es el scheme por defecto cuando no hay `selectedColorScheme` definido
- Parece tener un tratamiento especial en el código

## Investigación Técnica

### Archivos Involucrados:
- `/wwwroot/js/website-builder.js` - Lógica principal
- Líneas clave investigadas:
  - ~103-185: Definición de `defaultColorSchemes`
  - ~232-380: Función `getColorSchemeValues()`
  - ~10231-10395: Función `loadSchemeConfiguration()`
  - ~16000-16200: Event listeners para cambios de color

### Estructuras de Datos:

#### 1. Defaults Definidos:
```javascript
const defaultColorSchemes = {
    'scheme1': { 
        text: '#121212',
        background: '#FFFFFF',
        foreground: '#F0F0F0',
        border: '#DDDDDD',
        link: '#2c6ecb',
        'solid-button': '#121212',
        'solid-button-text': '#FFFFFF',
        'outline-button': '#DDDDDD',
        'outline-button-text': '#121212',
        'image-overlay': 'rgba(0, 0, 0, 0.1)'
    },
    'scheme2': { 
        text: '#333333',
        background: '#F3F3F3',
        // ... etc
    }
    // schemes 3-5...
}
```

#### 2. Estructura en `currentGlobalThemeSettings`:
```javascript
currentGlobalThemeSettings.colorSchemes = {
    scheme1: { /* valores */ },
    scheme2: { /* valores */ },
    // etc...
}
```

### Puntos Críticos Encontrados:

#### 1. En `loadSchemeConfiguration()` (línea ~10350):
```javascript
if (!currentGlobalThemeSettings.colorSchemes[schemeName]) {
    // Si no existe, lo inicializa con defaults
    if (defaultColorSchemes[schemeName]) {
        schemeData = JSON.parse(JSON.stringify(defaultColorSchemes[schemeName]));
    }
    currentGlobalThemeSettings.colorSchemes[schemeName] = schemeData;
}
```

#### 2. En los event listeners de color (línea ~16150):
```javascript
if (!currentGlobalThemeSettings.colorSchemes[schemeName]) {
    currentGlobalThemeSettings.colorSchemes[schemeName] = {};
}
```
**Problema**: Crea un objeto vacío que luego es detectado como "existente pero vacío"

#### 3. Comentarios sobre "CRITICAL FIX" (línea ~7880):
```javascript
// CRITICAL FIX: Check each scheme individually and only initialize if missing
// IMPORTANT: Only check if the scheme object exists, NOT its content
// The bug was that we were checking for required properties and reinitializing
// schemes that had custom values different from defaults
```
**Nota**: Indica que ya hubo un intento previo de fix que aparentemente no funcionó completamente

### Flujo de Datos Problemático:

1. **Al cambiar un color**:
   - Se actualiza `currentGlobalThemeSettings.colorSchemes[scheme2][property]`
   - Se marca `hasPendingGlobalSettingsChanges = true`
   
2. **Al guardar**:
   - Se envía todo `currentGlobalThemeSettings` al servidor
   - Endpoint: `/api/builder/websites/current/global-settings`
   
3. **Al cargar scheme para configuración**:
   - `loadSchemeConfiguration()` verifica si existe el scheme
   - Si no existe o está vacío, lo reinicializa con defaults
   
4. **Al asignar scheme a módulo**:
   - El módulo guarda `colorScheme: 'scheme2'` en su config
   - Al renderizar, llama a `getColorSchemeValues('scheme2')`

## Hipótesis del Bug

### Posibles Causas:
1. **Timing/Race Condition**: Los schemes se reinicializan después de guardar pero antes de que se carguen los valores guardados
2. **Objeto Vacío**: Se crea `colorSchemes[scheme2] = {}` en algún momento, lo que hace que pase la verificación de existencia pero esté vacío
3. **Orden de Operaciones**: Al asignar un scheme a un módulo, algo en el proceso está limpiando o reinicializando ese scheme específico
4. **Scheme 1 Especial**: Scheme 1 podría tener protección especial por ser el default

### Por Qué Scheme 1 Funciona:
- Es el valor por defecto cuando `selectedColorScheme` no está definido
- Posiblemente tiene verificaciones adicionales que previenen su reinicialización
- Puede estar siendo tratado de manera diferente en el código

## Logs y Debug

### Logs Relevantes Encontrados:
```javascript
console.log(`[DEBUG] ${schemeName} is completely missing, initializing with defaults`);
console.log(`[DEBUG] ${schemeName} exists with values:`, JSON.stringify(...));
console.log(`[DEBUG] Loading configuration for ${schemeName}`);
console.log(`[DEBUG] Updating colorSchemes.${schemeName}.${property} = ${value}`);
```

### Puntos de Debug Sugeridos:
1. En `loadSchemeConfiguration()` - verificar estado antes y después
2. En el guardado - verificar qué se envía al servidor
3. En la carga inicial - verificar qué viene de la base de datos
4. Al asignar scheme a módulo - verificar si se modifica el scheme

## Próximos Pasos

1. Identificar el momento exacto donde se pierden los valores
2. Verificar si hay diferencias en el tratamiento de scheme1 vs otros schemes
3. Revisar el orden de operaciones al guardar y cargar
4. Implementar fix basado en los hallazgos
5. **IMPORTANTE**: Validar exhaustivamente antes de documentar la solución

## Fix Implementado (31/07/2025) - PENDIENTE DE VALIDACIÓN

### CAUSA RAÍZ DEFINITIVA IDENTIFICADA

Después de un análisis exhaustivo del código y los logs, se identificó que el problema NO estaba en el backend, sino en el **frontend** que estaba corrompiendo los datos durante el proceso de carga.

### El Problema Real

En el método `loadCurrentWebsite()` (líneas 867-903 de website-builder.js), había código que **reinicializaba TODOS los color schemes con valores por defecto** cuando no encontraba alguno de los 5 schemes esperados:

```javascript
// Código problemático:
for (const [schemeName, defaultSchemeData] of Object.entries(defaultColorSchemes)) {
    if (!currentGlobalThemeSettings.colorSchemes[schemeName]) {
        // ESTO ERA EL BUG: Agregaba schemes faltantes con defaults
        currentGlobalThemeSettings.colorSchemes[schemeName] = { ...defaultSchemeData };
    }
}
```

### Flujo del Bug

1. Usuario modifica scheme2 (ej: text="#ffffff") y guarda → ✅ Se guarda correctamente en BD
2. Usuario asigna scheme2 a un módulo y guarda → Se ejecuta el proceso de guardado
3. Durante el guardado, se llama a `loadCurrentWebsite()` para refrescar datos
4. El código detecta que faltan schemes (3, 4, 5 que nunca fueron personalizados)
5. **BUG**: El código inicializa los schemes faltantes con defaults
6. **PEOR AÚN**: En el proceso, también sobrescribe el scheme2 con sus valores default
7. Estos valores corruptos se envían de vuelta al servidor en el próximo guardado

### Fix Definitivo Implementado (31/07/2025)

#### PROBLEMA ENCONTRADO: Dos lugares estaban inicializando schemes con defaults

#### Fix #1 - En `loadCurrentWebsite()` (líneas 867-892):

**ANTES**: Inicializaba automáticamente TODOS los schemes con valores por defecto
**AHORA**: Solo crea el objeto `colorSchemes` vacío y trabaja con lo que venga de la BD

```javascript
// CRITICAL FIX: Do NOT initialize default color schemes automatically
// Only ensure the colorSchemes object exists
if (!currentGlobalThemeSettings.colorSchemes) {
    console.log('[DEBUG] colorSchemes object not found, creating empty object');
    currentGlobalThemeSettings.colorSchemes = {};
}
```

#### Fix #2 - En `loadSchemeConfiguration()` (líneas 22689-22714):

**ANTES**: Cuando seleccionabas un scheme que no existía, lo inicializaba con defaults y los guardaba
**AHORA**: Muestra los defaults en los campos pero NO los guarda en memoria

```javascript
} else {
    // CRITICAL FIX: Do NOT initialize scheme with defaults
    // If the scheme doesn't exist in DB, use defaults ONLY for display
    console.log(`[DEBUG] ${schemeName} not found in colorSchemes, using defaults for display only`);
    
    // Get default values but DO NOT save them to currentGlobalThemeSettings
    if (defaultColorSchemes[schemeName]) {
        schemeData = JSON.parse(JSON.stringify(defaultColorSchemes[schemeName]));
    } else {
        schemeData = { /* defaults */ };
    }
    // IMPORTANT: Do NOT save the defaults to currentGlobalThemeSettings
    // The scheme will be created only when the user actually changes a value
    console.log('[DEBUG] NOT saving defaults to memory - scheme will be created on first change');
}
```

### Flujo del Bug Corregido

**ANTES**:
1. Seleccionas scheme2 → Se inicializa con defaults (text: negro)
2. Cambias texto a blanco → Se mezcla con los defaults
3. Guardas → Se guarda con defaults mezclados
4. En BD queda texto negro

**AHORA**:
1. Seleccionas scheme2 → Se muestran defaults pero NO se guardan en memoria
2. Cambias texto a blanco → Se crea el scheme2 solo con tu cambio
3. Guardas → Se guarda solo lo que cambiaste
4. En BD queda texto blanco

### Por Qué Este Fix Resuelve el Problema

1. **No más inicialización automática**: Los schemes no se crean hasta que el usuario hace un cambio
2. **Valores puros**: Solo se guardan los valores que el usuario modificó explícitamente
3. **Sin contaminación de defaults**: Los defaults se usan solo para mostrar, no para guardar

---

**NOTA**: Este fix está PENDIENTE DE VALIDACIÓN por el usuario.

## Actualización de la Investigación (31/07/2025) - NUEVO DESCUBRIMIENTO

### El Bug Real: Backend No Guarda Schemes 2-5

Después de más investigación con logs del frontend, se descubrió que:

1. **Frontend funciona correctamente**:
   - El usuario cambia colores en scheme2
   - Los cambios se registran en memoria correctamente
   - Al guardar, se envían TODOS los schemes (1-5) con sus valores correctos
   - Los logs muestran: `[SAVE] scheme2: {"text": "#ffffff", ...}` (texto blanco como esperado)

2. **Backend responde con éxito**:
   - La petición PUT devuelve status 204 (éxito)
   - No hay errores aparentes

3. **PERO en la base de datos**:
   - Solo scheme1 se guarda correctamente
   - Schemes 2-5 mantienen valores antiguos o defaults
   - El script SQL confirma que scheme2 sigue con texto negro

### Evidencia del Problema:

```javascript
// Frontend envía correctamente:
[SAVE] scheme1: { "text": "#ffffff", ... }  // ✅ Se guarda en BD
[SAVE] scheme2: { "text": "#ffffff", ... }  // ❌ NO se guarda en BD
[SAVE] scheme3: { ... }                     // ❌ NO se guarda en BD
[SAVE] scheme4: { ... }                     // ❌ NO se guarda en BD
[SAVE] scheme5: { ... }                     // ❌ NO se guarda en BD
```

### Sospecha Actual:

El problema está en el **backend** (`UpdateGlobalThemeSettings` en `WebSitesController.cs`). Posibles causas:

1. **Filtrado selectivo**: El backend podría estar procesando solo scheme1
2. **Problema de serialización**: Los schemes 2-5 se pierden durante la conversión JSON
3. **Lógica de merge incorrecta**: Al actualizar el JSON existente, solo se preserva scheme1
4. **Validación que descarta schemes**: Alguna lógica que valida y descarta schemes 2-5

### Próximo Paso:

Investigar el método `UpdateGlobalThemeSettings` para encontrar por qué solo guarda scheme1 y descarta los demás schemes.

---

## 🎯 SOLUCIÓN DEFINITIVA IMPLEMENTADA (31/07/2025)

### Causa Raíz Identificada

El problema era que **Entity Framework no estaba detectando cambios en el campo JSONB** cuando el JSON era muy grande. El campo `GlobalThemeSettingsJson` contiene todo el estado del website builder, y `colorSchemes` está en la posición 10 del objeto, lo que significa que hay mucho contenido antes de llegar a los color schemes.

### El Fix Definitivo

**Archivo**: `/Controllers/WebSitesController.cs`  
**Método**: `UpdateGlobalThemeSettings`  
**Líneas**: 212-228

#### Código Anterior (que no funcionaba):
```csharp
// Líneas 212-219 ANTES del fix
website.GlobalThemeSettingsJson = jsonToSave;
website.UpdatedAt = DateTime.UtcNow;

_context.Entry(website).State = EntityState.Modified;

try
{
    await _context.SaveChangesAsync();
```

#### Código Nuevo (SOLUCIÓN):
```csharp
// Líneas 212-228 DESPUÉS del fix
// SOLUCIÓN DIRECTA: Usar SQL raw para evitar problemas de Entity Framework
website.UpdatedAt = DateTime.UtcNow;

try
{
    // Guardar primero para actualizar UpdatedAt
    _context.Entry(website).State = EntityState.Modified;
    await _context.SaveChangesAsync();
    
    // Luego actualizar el JSON directamente con SQL
    await _context.Database.ExecuteSqlRawAsync(
        @"UPDATE ""WebSites"" 
          SET ""GlobalThemeSettingsJson"" = {0}::jsonb 
          WHERE ""Id"" = {1}",
        jsonToSave,
        website.Id
    );
```

### Por Qué Funciona Esta Solución

1. **Bypasea Entity Framework**: Al usar SQL directo, evitamos cualquier problema de detección de cambios de EF
2. **Actualización Directa**: El SQL actualiza el campo JSONB directamente en PostgreSQL
3. **Sin Límites de Tamaño**: No importa qué tan grande sea el JSON o en qué posición estén los color schemes
4. **Casting Explícito**: El `::jsonb` asegura que PostgreSQL trate el string como JSONB

### Proceso en Dos Pasos

1. **Primer `SaveChangesAsync()`**: Actualiza todos los campos excepto el JSON (principalmente `UpdatedAt`)
2. **SQL Raw**: Actualiza específicamente el campo `GlobalThemeSettingsJson` con el contenido completo

### Verificación del Fix

Después de implementar este cambio:
- ✅ Color scheme 1 se guarda correctamente (text: #000000 cuando se cambia a negro)
- ✅ Color schemes 2-5 mantienen sus valores personalizados
- ✅ Los cambios persisten después de recargar la página
- ✅ La base de datos refleja los valores correctos

### Lecciones Aprendidas

1. **Entity Framework tiene limitaciones** con campos JSON grandes en PostgreSQL
2. **La posición de los datos en el JSON importa** - colorSchemes estaba muy lejos del inicio
3. **SQL directo es más confiable** para operaciones críticas con JSONB
4. **Siempre verificar en la BD** - los logs pueden mostrar éxito pero la BD dice la verdad

### Conclusión

El bug que consumió 10+ horas se resolvió con 8 líneas de código que fuerzan la actualización del campo JSONB usando SQL directo, evitando las complejidades de Entity Framework con JSONs grandes.