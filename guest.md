# 📋 Plan de Implementación - Módulo Clientes (Guests)

Este documento contiene la planificación completa para implementar el módulo de Clientes en el sistema Hotel.

## 📑 Tabla de Contenidos
1. [Estado Actual](#estado-actual)
2. [Campos a Agregar](#campos-a-agregar)
3. [Plan de Implementación](#plan-de-implementación)
4. [Migraciones](#migraciones)
5. [Notas Importantes](#notas-importantes)

---

## Estado Actual

### Modelo Guest Existente
El modelo `Guest` en `/Models/Guest.cs` actualmente tiene:

**Campos actuales:**
- `Id` (int) - Primary key
- `FirstName` (string, required, max 100)
- `LastName` (string, required, max 100)
- `Email` (string, required, unique, max 200)
- `Phone` (string?, max 20)
- `DocumentType` (string?, max 50)
- `DocumentNumber` (string?, max 50)
- `Address` (string?, max 200)
- `City` (string?, max 100)
- `Country` (string?, max 100)
- `PostalCode` (string?, max 20)
- `DateOfBirth` (DateTime?)
- `CreatedAt` (DateTime)
- `UpdatedAt` (DateTime?)
- `Reservations` (ICollection<Reservation>)

### Elementos Ya Implementados
- ✅ Opción "Clientes" en el menú lateral (pero con href="#")
- ✅ Traducciones ES/EN para "Clientes"
- ✅ Permisos en la BD: Clientes.Read, Clientes.Write, Clientes.Create
- ✅ Relación con Reservations configurada

---

## Campos a Agregar

### 1. Campos Básicos
- `CustomerId` (string, unique) - Formato: #XXXXXX
- `Username` (string, unique, max 50)
- `ProfileImageUrl` (string?, text) - Base64 de imagen
- `Status` (string, max 20) - Active/Inactive
- `TotalSpent` (decimal, precision 18,2)

### 2. Campos de Seguridad
- `PasswordHash` (string?)
- `TwoFactorEnabled` (bool, default false)
- `TwoFactorPhone` (string?, max 20)
- `LastLoginAt` (DateTime?)

### 3. Campos de Lealtad
- `LoyaltyPoints` (int, default 0)
- `LoyaltyTier` (string?, max 50) - Platinum/Gold/Silver
- `AccountBalance` (decimal, precision 18,2, default 0)

### 4. Campos de Contadores
- `WishlistCount` (int, default 0)
- `CouponsCount` (int, default 0)

### 5. Campos de Auditoría
- `IsDeleted` (bool, default false) - Soft delete
- `DeletedAt` (DateTime?)

### 6. Modelos Relacionados Nuevos

#### CustomerAddress
```csharp
public class CustomerAddress
{
    public int Id { get; set; }
    public int GuestId { get; set; }
    public string Type { get; set; } // Home/Office/Family
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string PostalCode { get; set; }
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public virtual Guest Guest { get; set; }
}
```

#### CustomerPaymentMethod
```csharp
public class CustomerPaymentMethod
{
    public int Id { get; set; }
    public int GuestId { get; set; }
    public string Type { get; set; } // Card/Bank/Other
    public string CardType { get; set; } // Visa/Mastercard/Amex
    public string LastFourDigits { get; set; }
    public string HolderName { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public virtual Guest Guest { get; set; }
}
```

#### CustomerDevice
```csharp
public class CustomerDevice
{
    public int Id { get; set; }
    public int GuestId { get; set; }
    public string Browser { get; set; }
    public string Device { get; set; }
    public string Location { get; set; }
    public DateTime LastActivity { get; set; }
    
    public virtual Guest Guest { get; set; }
}
```

#### CustomerNotificationPreference
```csharp
public class CustomerNotificationPreference
{
    public int Id { get; set; }
    public int GuestId { get; set; }
    public string Type { get; set; } // NewForYou/AccountActivity/etc
    public bool EmailEnabled { get; set; }
    public bool BrowserEnabled { get; set; }
    public bool AppEnabled { get; set; }
    
    public virtual Guest Guest { get; set; }
}
```

---

## Plan de Implementación

### ✅ Fase 1: Preparación del Modelo (Backend)

1. **Actualizar modelo Guest**
   - [ ] Agregar todos los campos nuevos listados arriba
   - [ ] Mantener campos existentes sin modificar
   - [ ] Agregar navegación a nuevas entidades relacionadas

2. **Crear modelos relacionados**
   - [ ] Crear CustomerAddress.cs
   - [ ] Crear CustomerPaymentMethod.cs
   - [ ] Crear CustomerDevice.cs
   - [ ] Crear CustomerNotificationPreference.cs

3. **Actualizar HotelDbContext**
   - [ ] Agregar DbSets para las 4 nuevas entidades
   - [ ] Configurar índices únicos (Username, CustomerId)
   - [ ] Configurar relaciones y delete behavior
   - [ ] Configurar precisión para decimales

4. **Crear Migración**
   - [ ] Nombre: `AddCustomerFieldsAndRelatedTables`

### ✅ Fase 2: Navegación

1. **Actualizar menú lateral**
   - [ ] Cambiar href de "#" a "@Url.Action("Index", "Customers")"
   - [ ] Mantener ícono fa-user-friends
   - [ ] Las traducciones ya están implementadas

### ✅ Fase 3: Controller

1. **Crear CustomersController**
   - [ ] Aplicar [Authorize]
   - [ ] Implementar Index con paginación
   - [ ] Implementar Create con validaciones
   - [ ] Implementar Edit con pestañas
   - [ ] Implementar Delete (soft delete)
   - [ ] Manejar upload de imagen (max 25MB, base64)

2. **Métodos especiales**
   - [ ] GenerateCustomerId() - Formato #XXXXXX único
   - [ ] CalculateTotalSpent() - Desde Orders/Reservations
   - [ ] UpdateLoyaltyTier() - Según puntos acumulados

### ✅ Fase 4: Vistas

1. **Index.cshtml**
   - [ ] Tabla responsiva con DataTables
   - [ ] Columnas: Avatar, Name, Email, CustomerId, Country, Orders, TotalSpent
   - [ ] Búsqueda y filtros
   - [ ] Botón "Add Customer" con var(--primary)

2. **Create.cshtml**
   - [ ] Formulario con campos básicos
   - [ ] Upload de imagen con preview
   - [ ] Validación client-side

3. **Edit.cshtml**
   - [ ] 4 pestañas: Overview, Security, Address & Billing, Notifications
   - [ ] Sin recargar página al cambiar pestaña
   - [ ] Guardar cambios por pestaña

4. **_ViewImports.cshtml**
   - [ ] Agregar @using Hotel.Models si es necesario

### ✅ Fase 5: JavaScript y CSS

1. **customers.js**
   - [ ] Manejo de pestañas
   - [ ] Upload y preview de imagen
   - [ ] Validaciones dinámicas
   - [ ] AJAX para operaciones sin recargar

2. **customers.css**
   - [ ] Estilos específicos del módulo
   - [ ] Usar var(--primary) para interactivos
   - [ ] Mantener dark mode compatible

### ✅ Fase 6: Traducciones

1. **Agregar keys de traducción**
   - [ ] customers.title, customers.add, customers.edit
   - [ ] Todos los labels de formularios
   - [ ] Mensajes de validación
   - [ ] Nombres de pestañas

---

## Migraciones

### Migración 1: AddCustomerFieldsAndRelatedTables

**Incluirá:**
1. Nuevos campos en tabla Guests
2. Creación de tabla CustomerAddresses
3. Creación de tabla CustomerPaymentMethods
4. Creación de tabla CustomerDevices
5. Creación de tabla CustomerNotificationPreferences
6. Índices únicos en Username y CustomerId
7. Foreign keys y relaciones

**Comando a ejecutar (por el usuario):**
```
Add-Migration AddCustomerFieldsAndRelatedTables
Update-Database
```

---

## Notas Importantes

### Reglas Críticas (de CLAUDE.md)
1. **Migraciones**: Solo proporcionar el nombre, el usuario ejecuta los comandos
2. **Confirmación**: Nunca afirmar que algo funciona, decir "cambios listos para probar"
3. **No refactorizar**: Solo implementar lo solicitado exactamente

### Patrones a Seguir (de keypoints.md)
1. **Traducciones**: Usar sistema regular (no Website Builder)
2. **Íconos**: Solo Font Awesome 6.4.0
3. **Color theme**: Respetar var(--primary)
4. **Editor**: Si se necesita texto enriquecido, usar contenteditable

### Guardado (de guardado.md)
1. **Fechas**: Siempre DateTime.UtcNow
2. **Imágenes**: Campo text, no varchar
3. **Validaciones**: ModelState.Remove para opcionales
4. **PostgreSQL**: Switch de timestamps habilitado

### Tipos de Documento
Cuando se implemente, agregar dropdown con:
- Crédito Fiscal
- Consumidor Final
- Gubernamental
- Régimen Especial

### Consideraciones de Seguridad
1. Soft delete para no perder historial
2. Encriptar datos sensibles de pago
3. Validar unicidad de email/username
4. Audit trail para cambios importantes

---

**Siguiente paso**: Implementar Fase 1 comenzando con la actualización del modelo Guest.