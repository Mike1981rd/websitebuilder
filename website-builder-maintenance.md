# Guía de Mantenimiento - Website Builder

## 🎯 Objetivo
Esta guía proporciona instrucciones paso a paso para mantener y extender el Website Builder sin romper funcionalidad existente.

## 📋 Checklist: Agregar Nueva Sección Fija (como Cart)

### 1. **Traducciones** ✏️
- [ ] Abrir `website-builder.js`
- [ ] Ir a línea ~4640 (sección español)
- [ ] Agregar después de `'sections.footer': 'Pie de página',`:
  ```javascript
  'sections.cart': 'Carrito',
  ```
- [ ] Ir a línea ~5488 (sección inglés)
- [ ] Agregar después de `'sections.footer': 'Footer',`:
  ```javascript
  'sections.cart': 'Cart',
  ```

### 2. **HTML en Lista de Bloques** 🎨
- [ ] Buscar función `renderBlockListView` (~línea 6400)
- [ ] Localizar el HTML del footer (~línea 6480)
- [ ] Agregar después del footer:
  ```javascript
  <!-- Cart -->
  <div class="sidebar-subsection" data-block-type="cart">
      <div class="subsection-header">
          <i class="material-icons">shopping_cart</i>
          <span data-i18n="sections.cart">Carrito</span>
      </div>
  </div>
  ```

### 3. **Click Handler** 🖱️
- [ ] Buscar `attachBlockListEventListeners` (~línea 13400)
- [ ] Encontrar el handler del footer (~línea 13440)
- [ ] Agregar después:
  ```javascript
  // Handle cart click
  else if (blockType === 'cart') {
      console.log('[DEBUG] Cart section clicked, opening settings');
      switchSidebarView('cartSettings');
  }
  ```

### 4. **Vista de Configuración** ⚙️
- [ ] Buscar `switchSidebarView` (~línea 6900)
- [ ] Encontrar el caso de footer (~línea 23000)
- [ ] Agregar nuevo caso:
  ```javascript
  } else if (viewName === 'cartSettings') {
      console.log('[DEBUG] Rendering cart settings');
      dynamicContentArea.innerHTML = renderCartSettings();
      attachCartEventListeners();
      setTimeout(applyTranslations, 0);
  ```

### 5. **Función de Renderizado** 📄
- [ ] Ir al final de las funciones de settings (después de footer ~línea 24000)
- [ ] Agregar nueva función:
  ```javascript
  function renderCartSettings() {
      const settings = currentSectionsConfig.cart || {};
      return `<!-- HTML de configuración -->`;
  }
  ```

### 6. **Event Listeners** 🎧
- [ ] Después de la función de renderizado
- [ ] Agregar:
  ```javascript
  function attachCartEventListeners() {
      // Event listeners específicos
  }
  ```

### 7. **Preview** 👁️
- [ ] Buscar función `renderPreview` (~línea 390)
- [ ] En el loop de sectionOrder
- [ ] Agregar caso para cart

## 🚨 Puntos Críticos a Verificar

### Antes de Guardar
1. **Sintaxis**: Verificar comas, llaves y paréntesis
2. **Traducciones**: Ambos idiomas (es/en)
3. **Console.logs**: Agregar para debugging

### Después de Implementar
1. **Click funciona**: La sección responde al click
2. **Vista se carga**: No hay errores en consola
3. **Traducciones aparecen**: Cambiar idioma y verificar
4. **Guardar funciona**: Los cambios se persisten

## 🔍 Comandos Útiles de Búsqueda

### En VS Code
- `Ctrl+F`: Buscar en archivo
- `Ctrl+G`: Ir a línea específica
- `Ctrl+Shift+F`: Buscar en todo el proyecto

### Patrones de búsqueda útiles
- `'sections.`: Para encontrar traducciones
- `else if (blockType`: Para click handlers
- `} else if (viewName`: Para casos en switchSidebarView
- `function render`: Para funciones de renderizado

## 📝 Plantilla de Documentación Post-Implementación

Después de agregar una nueva sección, actualizar `website-builder-lines.md`:

```markdown
## Cart Implementation
- Traducciones (es): Línea XXXX
- Traducciones (en): Línea XXXX
- Click handler: Línea XXXX
- Vista settings: Línea XXXX
- Función render: Línea XXXX
- Event listeners: Línea XXXX
```

## ⚠️ Reglas de Oro

1. **NUNCA** borrar código existente sin estar 100% seguro
2. **SIEMPRE** agregar console.log para debugging
3. **SIEMPRE** probar en ambos idiomas
4. **SIEMPRE** verificar que no se rompió nada más
5. **DOCUMENTAR** números de línea inmediatamente

## 🆘 Troubleshooting Común

### "Vista no carga"
- Verificar que el caso existe en switchSidebarView
- Verificar nombre exacto ('cartSettings' vs 'cartSetting')
- Verificar console.log aparece

### "Click no funciona"
- Verificar data-block-type en HTML
- Verificar else if en attachBlockListEventListeners
- Verificar que no hay error de sintaxis antes

### "Traducciones no aparecen"
- Verificar data-i18n correcto
- Verificar que se llama applyTranslations
- Verificar coma después de cada traducción