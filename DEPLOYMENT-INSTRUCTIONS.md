# 📚 INSTRUCCIONES DE DEPLOYMENT - HOTEL23

## 🚀 Uso Rápido

### PowerShell (Windows)
```powershell
# Deployment normal
.\deploy-to-azure.ps1

# Deployment rápido sin backup
.\deploy-to-azure.ps1 -SkipBackup

# Deployment con mensaje personalizado
.\deploy-to-azure.ps1 -CommitMessage "Agregada funcionalidad de reservaciones"
```

### Bash (WSL/Linux)
```bash
# Dar permisos (solo primera vez)
chmod +x deploy.sh

# Deployment normal
./deploy.sh

# Deployment rápido sin backup
./deploy.sh --skip-backup

# Deployment con mensaje personalizado
./deploy.sh --message "Agregada funcionalidad de reservaciones"
```

## ⚙️ Configuración Inicial

### 1. Verificar SSH
Asegúrate de poder conectarte sin contraseña:
```bash
ssh azureuser@20.169.209.166
```

### 2. PowerShell Execution Policy
Solo si recibes error de permisos:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📊 Información del Servidor

- **IP**: 20.169.209.166
- **Usuario**: azureuser
- **Ruta App**: /home/azureuser/hotel-app
- **Puerto**: 5002
- **URL**: http://20.169.209.166

## 🔧 Opciones Avanzadas

### PowerShell
- `-SkipBackup`: No crear backup (más rápido)
- `-QuickDeploy`: Deployment rápido sin restore
- `-CommitMessage "texto"`: Mensaje personalizado

### Bash
- `--skip-backup`: No crear backup
- `--quick`: Deployment rápido
- `--message "texto"`: Mensaje personalizado

## 📝 Logs y Debugging

### Ver logs de la aplicación
```bash
ssh azureuser@20.169.209.166 'tail -50 /home/azureuser/hotel-app/app.log'
```

### Ver proceso en ejecución
```bash
ssh azureuser@20.169.209.166 'ps aux | grep dotnet'
```

### Verificar puerto
```bash
ssh azureuser@20.169.209.166 'lsof -i:5002'
```

## ⚠️ Solución de Problemas

### Error de compilación
- Verifica que no hay errores en Visual Studio
- Ejecuta `dotnet build` antes del deployment

### No se puede conectar por SSH
- Verifica tu clave SSH esté configurada
- Prueba conexión manual: `ssh azureuser@20.169.209.166`

### La aplicación no inicia
- Revisa los logs con el comando anterior
- Verifica que el puerto 5002 no esté ocupado

## 🔄 Proceso de Deployment con Cambios de BD

### ⚠️ IMPORTANTE: Siempre actualizar BD primero

1. **Generar script SQL de migraciones**:
   ```
   Script-Migration -From <MigracionAnterior> -To <MigracionNueva>
   ```

2. **Conectar a PostgreSQL Azure y ejecutar script**

3. **Ejecutar deployment del código**:
   ```powershell
   .\deploy-to-azure.ps1
   ```

## 🎯 Tips de Uso

1. **Para cambios pequeños**: Usa `-SkipBackup` para deployment más rápido
2. **Horario**: Evita deployments en horas pico
3. **Verificación**: Siempre verifica la app después del deployment
4. **Backups**: Se mantienen los últimos 3 backups automáticamente

---
**Última actualización**: Agosto 2025