# 🚨 SOLUCIÓN FINAL - Error 400 en Pagos OpenPay

## Problema Detectado

**Error en consola:**
```
POST http://localhost:3000/api/v1/payments/charge#1 400 (Bad Request)
Uncaught Error: Access to storage is not allowed from this context
```

**Causa:** Las credenciales de OpenPay no están configuradas correctamente en el backend.

---

## ✅ SOLUCIÓN PASO A PASO

### 1. Verificar Credenciales en `backend/.env`

Abre `backend/.env` y asegúrate de tener EXACTAMENTE esto:

```env
# OpenPay Credentials
OPENPAY_MERCHANT_ID=tu_merchant_id_real
OPENPAY_PRIVATE_KEY=sk_tu_private_key_real
OPENPAY_PUBLIC_KEY=pk_tu_public_key_real

# IMPORTANTE: NO uses comillas
# CORRECTO:   OPENPAY_MERCHANT_ID=mey6jxoshz9kqyr3vwkd
# INCORRECTO: OPENPAY_MERCHANT_ID="mey6jxoshz9kqyr3vwkd"
```

**Dónde obtener las credenciales:**
1. Ve a: https://sandbox-dashboard.openpay.mx
2. Inicia sesión
3. Ve a: **Configuración** → **API Keys**
4. Copia:
   - **Merchant ID** (sin `sk_` ni `pk_`)
   - **Private Key** (empieza con `sk_`)
   - **Public Key** (empieza con `pk_`)

### 2. Reiniciar Backend

Después de guardar `.env`:

```powershell
# Detén el backend (Ctrl+C en la terminal)
# Luego reinicia:
cd backend
npm run start:dev
```

**Espera a ver este mensaje:**
```
🚀 Application is running on: http://localhost:3000/api/v1
```

### 3. Verificar que las Credenciales se Cargaron

Abre tu navegador y ve a:
```
http://localhost:3000/api/v1/payments/config
```

Deberías ver algo como:
```json
{
  "merchant_id": "mey6jxoshz9kqyr3vwkd",
  "public_key": "pk_xxxxxxxxxxxxx"
}
```

**Si ves `null` o está vacío:** Las credenciales NO se cargaron correctamente del `.env`

### 4. Recargar Frontend

Una vez que el backend esté corriendo con las credenciales correctas:

1. Ve a: http://localhost:5173
2. Presiona **F5** para recargar
3. Abre la consola (F12)
4. Escribe: `window.OpenPay`
5. Deberías ver un objeto, NO `undefined`

### 5. Probar Pago

Usa la tarjeta de prueba:
```
Número: 4111 1111 1111 1111
Nombre: JUAN PEREZ
Mes: 12
Año: 25
CVV: 123
```

---

## 🔍 Verificación Rápida

### Checklist de Diagnóstico

- [ ] `backend/.env` tiene las 3 credenciales (MERCHANT_ID, PRIVATE_KEY, PUBLIC_KEY)
- [ ] Las credenciales NO tienen comillas
- [ ] Backend reiniciado después de cambiar `.env`
- [ ] `http://localhost:3000/api/v1/payments/config` devuelve las credenciales
- [ ] Frontend recargado (F5)
- [ ] `window.OpenPay` en consola devuelve un objeto
- [ ] Pago de prueba realizado

---

## 🎯 Ejemplo de `.env` Correcto

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/gr_platform"

# JWT
JWT_SECRET=tu_jwt_secret_aqui

# OpenPay (SANDBOX)
OPENPAY_MERCHANT_ID=mey6jxoshz9kqyr3vwkd
OPENPAY_PRIVATE_KEY=sk_abc123def456ghi789
OPENPAY_PUBLIC_KEY=pk_xyz987uvw654rst321

# Environment
NODE_ENV=development
PORT=3000
```

---

## 🆘 Si Sigue Fallando

### Error: "window.OpenPay is undefined"

**Solución:**
1. Verifica que `http://localhost:3000/api/v1/payments/config` devuelva las credenciales
2. Recarga el frontend (F5)
3. Revisa la consola del navegador para errores al cargar el script de OpenPay

### Error: "400 Bad Request"

**Solución:**
1. Verifica que el token se esté generando correctamente
2. Revisa los logs del backend para ver el error específico
3. Asegúrate de que `payment_type` sea `'initial'` o `'monthly'`

### Error: "Access to storage is not allowed"

**Solución:**
- Este error es secundario y se debe a localStorage
- No afecta el pago, pero puedes ignorarlo
- Se soluciona al arreglar el problema principal de OpenPay

---

## ✅ Cuando Funcione

Deberías ver:
1. ✅ El pago se procesa exitosamente
2. ✅ Mensaje de éxito en el frontend
3. ✅ Webhook enviado a ngrok (visible en http://localhost:4040)
4. ✅ Pago registrado en la base de datos

**Entonces el webhook funcionará automáticamente.**
