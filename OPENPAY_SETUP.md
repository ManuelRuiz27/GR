# Guía de Configuración de OpenPay

## Credenciales de Sandbox

Para probar el sistema de pagos, necesitas crear una cuenta en OpenPay Sandbox:

1. **Regístrate en OpenPay Sandbox**
   - Ve a: https://sandbox-dashboard.openpay.mx/
   - Crea una cuenta gratuita

2. **Obtén tus credenciales**
   - Merchant ID
   - Private Key (sk_...)
   - Public Key (pk_...)

3. **Configura el archivo .env**

```env
# OpenPay (Sandbox)
OPENPAY_MERCHANT_ID=tu_merchant_id
OPENPAY_PRIVATE_KEY=sk_tu_private_key
OPENPAY_PUBLIC_KEY=pk_tu_public_key

# Application
FRONTEND_URL=http://localhost:5173
```

## Tarjetas de Prueba

### Tarjetas Aprobadas
- **Visa**: 4111111111111111
- **MasterCard**: 5555555555554444
- **American Express**: 345678000000007

### Datos de Prueba
- **CVV**: Cualquier 3 dígitos (ej: 123)
- **Fecha de expiración**: Cualquier fecha futura (ej: 12/25)
- **Nombre**: Cualquier nombre (ej: JUAN PEREZ)

### Tarjetas Rechazadas (para pruebas)
- **Fondos insuficientes**: 4000000000000002
- **Tarjeta robada**: 4000000000000069

## Configurar Webhooks

1. **En el Dashboard de OpenPay**
   - Ve a Configuración → Webhooks
   - Agrega una nueva URL de webhook

2. **URL del Webhook**
   ```
   https://tu-dominio.com/webhooks/openpay
   ```
   
   Para desarrollo local, usa ngrok:
   ```bash
   ngrok http 3000
   ```
   
   Luego usa la URL de ngrok:
   ```
   https://abc123.ngrok.io/webhooks/openpay
   ```

3. **Eventos a suscribir**
   - `charge.succeeded`
   - `charge.failed`

## Probar el Sistema

### 1. Pago Inicial

```bash
# 1. Login
POST http://localhost:3000/api/v1/auth/graduates/login
{
  "email": "juan.test@example.com",
  "password": "password123"
}

# 2. Obtener resumen de pagos
GET http://localhost:3000/api/v1/payments/summary
Authorization: Bearer {token}

# 3. En el frontend:
# - Ve a Dashboard → Pagos
# - Click en "Pagar Ahora" en Pago Inicial
# - Ingresa tarjeta de prueba: 4111111111111111
# - CVV: 123, Fecha: 12/25
# - Click en "Pagar"
```

### 2. Mensualidades

Después de pagar el inicial, podrás pagar mensualidades:

```bash
# Verificar siguiente mensualidad
GET http://localhost:3000/api/v1/payments/summary
# Respuesta incluye: next_month: 1

# En el frontend:
# - Click en "Pagar Ahora" en Mensualidad 1
# - Ingresa datos de tarjeta
# - Confirma pago
```

### 3. Verificar Historial

```bash
GET http://localhost:3000/api/v1/payments/history
Authorization: Bearer {token}
```

## Desbloqueo de Termo

El termo se desbloquea automáticamente cuando el progreso de pago alcanza el umbral configurado (por defecto 50%):

```typescript
// En el evento
thermo_threshold: 50 // Porcentaje requerido

// Después de cada pago exitoso, el sistema:
// 1. Calcula el progreso: (total_pagado / total_amount) * 100
// 2. Si progreso >= thermo_threshold:
//    - Actualiza thermo_step a 'unlocked'
//    - El graduado puede personalizar su termo
```

## Seguridad

### Verificación de Firma de Webhooks

El sistema verifica automáticamente la firma de los webhooks usando HMAC-SHA256:

```typescript
// Backend: webhooks.controller.ts
const isValid = this.openpayService.verifyWebhookSignature(payload, signature);
if (!isValid) {
  throw new UnauthorizedException('Invalid webhook signature');
}
```

### Tokenización de Tarjetas

Las tarjetas NUNCA pasan por nuestro servidor:

1. Frontend captura datos de tarjeta
2. OpenPay.js crea un token (comunicación directa con OpenPay)
3. Frontend envía solo el token al backend
4. Backend usa el token para crear el cargo

## Troubleshooting

### Error: "OpenPay no está cargado"
- Recarga la página
- Verifica que las credenciales en .env sean correctas
- Revisa la consola del navegador

### Error: "Invalid webhook signature"
- Verifica que OPENPAY_PRIVATE_KEY sea correcta
- Asegúrate de que el webhook esté configurado en OpenPay dashboard

### Pago queda en "pending"
- Verifica que los webhooks estén configurados
- Revisa los logs del backend para ver si llegó el webhook
- En sandbox, los pagos se confirman inmediatamente

### Erro: "Initial payment must be made first"
- Debes pagar el enganche inicial antes de las mensualidades
- Verifica en el historial que el pago inicial esté como "paid"

## Producción

Para pasar a producción:

1. **Cambia las credenciales**
   ```env
   OPENPAY_MERCHANT_ID=tu_merchant_id_produccion
   OPENPAY_PRIVATE_KEY=sk_tu_private_key_produccion
   OPENPAY_PUBLIC_KEY=pk_tu_public_key_produccion
   NODE_ENV=production
   ```

2. **Actualiza el frontend**
   ```typescript
   // Payments.tsx
   window.OpenPay.setSandboxMode(false); // Cambiar a false
   ```

3. **Habilita 3D Secure**
   ```typescript
   // openpay.service.ts
   use_3d_secure: true, // Cambiar a true
   ```

4. **Configura HTTPS**
   - OpenPay requiere HTTPS en producción
   - Configura SSL en tu servidor

5. **Actualiza webhooks**
   - Usa tu dominio de producción
   - Verifica que sea HTTPS

---

**Documentación oficial**: https://www.openpay.mx/docs/
