# 🔍 Guía de Troubleshooting - Sprint 3

## Problema: "No se guardan los cambios o las selecciones"

### ✅ Verificaciones Realizadas

1. **Backend corriendo**: ✅ Puerto 3000
2. **Frontend corriendo**: ✅ Puerto 5173
3. **Endpoints funcionando**: ✅ Probado con curl
4. **LayoutModule cargado**: ✅ Visible en logs de NestJS

### 🔧 Pasos para Resolver

#### 1. Recarga Completa del Navegador
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

O cierra y abre el navegador completamente.

#### 2. Verifica que Tengas Boletos Seleccionados

**El sistema requiere que selecciones boletos ANTES de poder seleccionar mesa.**

Flujo correcto:
1. Login → Dashboard
2. Tab "🎫 Boletos" → Selecciona cantidad (ej: 6)
3. Click "Confirmar Boletos"
4. Tab "👥 Invitados" → Verifica que se crearon
5. Click "🪑 Mesas" → Ahora sí puedes seleccionar

#### 3. Verifica en DevTools (F12)

**Console Tab:**
- No debe haber errores en rojo
- Si ves errores 401: Token expiró, haz login de nuevo
- Si ves errores 400: Probablemente no tienes boletos

**Network Tab:**
- Busca la petición a `/layout/overview`
- Debe retornar status 200
- Busca la petición a `/layout/selection`
- Debe retornar status 201

#### 4. Verifica el Token

Abre DevTools → Console → Ejecuta:
```javascript
localStorage.getItem('token')
```

Si es `null`, haz login de nuevo.

#### 5. Prueba Manual del Backend

```powershell
# 1. Login
$body = @{email='juan.test@example.com';password='password123'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/auth/graduates/login' -Method POST -Body $body -ContentType 'application/json'
$data = $response.Content | ConvertFrom-Json
$token = $data.token
Write-Host "Token: $token"

# 2. Verificar que tienes boletos
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/graduates/me/guests' -Method GET -Headers @{Authorization="Bearer $token"}
$response.Content

# 3. Obtener layout
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/events/550e8400-e29b-41d4-a716-446655440000/layout/overview' -Method GET -Headers @{Authorization="Bearer $token"}
$layoutData = $response.Content | ConvertFrom-Json
Write-Host "Mesas disponibles: $($layoutData.tables.Count)"
Write-Host "Mi selección actual: $($layoutData.my_selection)"

# 4. Seleccionar Mesa 1
$mesa1 = $layoutData.tables | Where-Object { $_.label -eq "Mesa 1" }
$body = @{table_id=$mesa1.id} | ConvertTo-Json
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/graduates/me/layout/selection' -Method POST -Body $body -ContentType 'application/json' -Headers @{Authorization="Bearer $token"}
$response.Content

# 5. Verificar que se guardó
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/events/550e8400-e29b-41d4-a716-446655440000/layout/overview' -Method GET -Headers @{Authorization="Bearer $token"}
$layoutData = $response.Content | ConvertFrom-Json
Write-Host "Mi selección ahora: $($layoutData.my_selection.table_label)"
```

### 🐛 Errores Comunes

#### Error: "You must select tickets first"
**Solución**: Ve a Dashboard → Boletos → Selecciona cantidad → Confirma

#### Error: "Unauthorized" (401)
**Solución**: Tu token expiró (15 min). Haz login de nuevo.

#### Error: "This table only has X seats available and you need Y"
**Solución**: Esa mesa está llena. Selecciona otra mesa verde.

#### Error: "Table not found"
**Solución**: El ID de la mesa es incorrecto. Verifica que estés usando el ID correcto.

### 📱 Verificación Visual

Cuando funcione correctamente, deberías ver:

1. **Página de Mesas**:
   - Grid de 100 mesas
   - Leyenda con colores
   - Mesas verdes (disponibles)
   - Si ya seleccionaste, una mesa azul (tu selección)

2. **Al hacer click en mesa verde**:
   - Modal aparece
   - Muestra número de mesa
   - Muestra capacidad y disponibles
   - Botón "Confirmar"

3. **Después de confirmar**:
   - Modal se cierra
   - Mesa cambia a azul
   - Aparece mensaje "Mesa actual: Mesa X"

### 🔄 Si Nada Funciona

1. Detén ambos servidores (Ctrl+C)
2. Reinicia Docker:
   ```powershell
   docker-compose down
   docker-compose up -d
   ```
3. Reinicia backend:
   ```powershell
   cd backend
   npm run start:dev
   ```
4. Reinicia frontend:
   ```powershell
   cd frontend
   npm run dev
   ```
5. Limpia caché del navegador
6. Haz login de nuevo

### 📞 Información de Debug

Si sigues teniendo problemas, proporciona:
- Errores en Console (F12)
- Errores en Network tab (F12)
- Screenshot de la página de mesas
- Output del script de prueba manual

---

**Última actualización**: 6 de Diciembre, 2025
