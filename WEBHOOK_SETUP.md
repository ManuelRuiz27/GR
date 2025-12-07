# 🔔 Configuración de Webhook OpenPay - Plataforma GR

## 📋 Requisitos Previos

- ✅ Credenciales de OpenPay configuradas en `.env`
- ✅ Backend corriendo en producción o con URL pública (ngrok para desarrollo)
- ✅ Cuenta de OpenPay con acceso al dashboard

---

## 🔧 Paso 1: Configurar Variables de Entorno

Asegúrate de tener estas variables en tu archivo `backend/.env`:

```env
# OpenPay Credentials
OPENPAY_MERCHANT_ID=tu_merchant_id
OPENPAY_PRIVATE_KEY=tu_private_key
OPENPAY_PUBLIC_KEY=tu_public_key
OPENPAY_SANDBOX=true  # false para producción
OPENPAY_WEBHOOK_SECRET=tu_webhook_secret  # Opcional pero recomendado
```

---

## 🌐 Paso 2: Obtener URL Pública del Webhook

### Opción A: Desarrollo Local con ngrok

```bash
# Instalar ngrok (si no lo tienes)
# Descargar de https://ngrok.com/download

# Exponer tu backend (puerto 3000)
ngrok http 3000

# Copiar la URL HTTPS que te da ngrok
# Ejemplo: https://abc123.ngrok.io
```

Tu URL de webhook será:
```
https://abc123.ngrok.io/api/v1/webhooks/openpay
```

### Opción B: Producción

Si ya tienes tu backend en producción:
```
https://tu-dominio.com/api/v1/webhooks/openpay
```

---

## 📝 Paso 3: Registrar Webhook en OpenPay Dashboard

### 3.1 Acceder al Dashboard de OpenPay

1. Ve a [OpenPay Dashboard](https://sandbox-dashboard.openpay.mx) (sandbox) o [Producción](https://dashboard.openpay.mx)
2. Inicia sesión con tus credenciales
3. Selecciona tu merchant

### 3.2 Configurar Webhook

1. **Navega a:** Configuración → Webhooks
2. **Click en:** "Agregar Webhook" o "Nuevo Webhook"
3. **Completa el formulario:**

   - **URL del Webhook:**
     ```
     https://tu-url.com/api/v1/webhooks/openpay
     ```
   
   - **Eventos a Suscribir:**
     - ✅ `charge.succeeded` - Cargo exitoso
     - ✅ `charge.failed` - Cargo fallido
     - ✅ `charge.cancelled` - Cargo cancelado
     - ✅ `charge.refunded` - Cargo reembolsado
     - ✅ `charge.created` - Cargo creado (opcional)
   
   - **Método HTTP:** POST
   
   - **Usuario/Contraseña:** (Dejar vacío si no usas autenticación básica)

4. **Guardar** la configuración

### 3.3 Obtener Webhook Secret (Opcional pero Recomendado)

OpenPay te proporcionará un **Webhook Secret** o **Signing Key**. Cópialo y agrégalo a tu `.env`:

```env
OPENPAY_WEBHOOK_SECRET=whsec_abc123xyz...
```

---

## 🔐 Paso 4: Verificar Firma del Webhook (Seguridad)

El backend ya está configurado para verificar la firma. Revisa el código en `webhooks.controller.ts`:

```typescript
// El webhook verifica automáticamente la firma
@Post()
async handleWebhook(
    @Body() body: any,
    @Headers('x-openpay-signature') signature: string,
) {
    // Verificación automática de firma
    const isValid = this.openpayService.verifyWebhookSignature(
        JSON.stringify(body),
        signature,
    );
    
    if (!isValid) {
        throw new UnauthorizedException('Invalid webhook signature');
    }
    
    // Procesar evento
    return this.paymentsService.handleWebhook(body);
}
```

---

## 🧪 Paso 5: Probar el Webhook

### 5.1 Prueba Manual desde OpenPay Dashboard

1. En el dashboard de OpenPay, ve a la sección de Webhooks
2. Encuentra tu webhook configurado
3. Click en "Probar" o "Test"
4. OpenPay enviará un evento de prueba

### 5.2 Prueba con Pago Real (Sandbox)

1. Realiza un pago de prueba desde el frontend
2. Usa una tarjeta de prueba de OpenPay:
   ```
   Número: 4111 1111 1111 1111
   CVV: 123
   Fecha: 12/25
   Nombre: JUAN PEREZ
   ```

3. Verifica los logs del backend:
   ```bash
   # En la terminal del backend deberías ver:
   [WebhooksController] Webhook received from OpenPay
   [WebhooksController] Webhook signature verified
   [PaymentsService] Processing webhook event: charge.succeeded
   ```

### 5.3 Verificar en Base de Datos

Verifica que el pago se actualizó correctamente:

```sql
-- En Prisma Studio o tu cliente SQL
SELECT * FROM "Payment" ORDER BY created_at DESC LIMIT 5;
```

El estado del pago debería cambiar a `'completed'` cuando el webhook se procese.

---

## 📊 Paso 6: Monitorear Webhooks

### Logs del Backend

Los webhooks se registran automáticamente en los logs:

```bash
# Ver logs en tiempo real
cd backend
npm run start:dev

# Buscar logs de webhooks
# Los verás como:
[WebhooksController] Webhook received from OpenPay
[WebhooksController] Webhook signature verified
[PaymentsService] Processing webhook event: charge.succeeded
[PaymentsService] Payment updated: payment_id
```

### Dashboard de OpenPay

1. Ve a: Webhooks → Historial
2. Verás todos los webhooks enviados con:
   - ✅ Estado (200 OK = exitoso)
   - ⏱️ Timestamp
   - 🔄 Reintentos
   - 📄 Payload completo

---

## ⚠️ Troubleshooting

### Problema: Webhook no se recibe

**Solución:**
1. Verifica que la URL sea accesible públicamente
2. Prueba la URL con curl:
   ```bash
   curl -X POST https://tu-url.com/api/v1/webhooks/openpay \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```
3. Revisa que el backend esté corriendo
4. Verifica que no haya firewall bloqueando

### Problema: Error 401 (Unauthorized)

**Solución:**
1. Verifica que `OPENPAY_WEBHOOK_SECRET` esté configurado correctamente
2. Revisa que la firma en el header `x-openpay-signature` sea válida
3. Temporalmente desactiva la verificación de firma para debugging:
   ```typescript
   // En webhooks.controller.ts (SOLO PARA DEBUG)
   // Comenta temporalmente la verificación:
   // if (!isValid) {
   //     throw new UnauthorizedException('Invalid webhook signature');
   // }
   ```

### Problema: Webhook se recibe pero no actualiza el pago

**Solución:**
1. Revisa los logs del backend para ver el error específico
2. Verifica que el `transaction_id` en el webhook coincida con el de la base de datos
3. Revisa la tabla `Payment` para confirmar que existe el registro

---

## 🔒 Mejores Prácticas de Seguridad

1. **SIEMPRE verifica la firma del webhook** en producción
2. **Usa HTTPS** para la URL del webhook
3. **Valida el payload** antes de procesarlo
4. **Implementa idempotencia** para evitar procesar el mismo evento dos veces
5. **Registra todos los eventos** para auditoría
6. **Responde rápido** (< 5 segundos) para evitar reintentos

---

## 📚 Eventos de OpenPay Soportados

El backend maneja estos eventos automáticamente:

| Evento | Descripción | Acción |
|--------|-------------|--------|
| `charge.succeeded` | Pago exitoso | Actualiza estado a `completed` |
| `charge.failed` | Pago fallido | Actualiza estado a `failed` |
| `charge.cancelled` | Pago cancelado | Actualiza estado a `cancelled` |
| `charge.refunded` | Pago reembolsado | Actualiza estado a `refunded` |

---

## 🎯 Checklist de Configuración

- [ ] Variables de entorno configuradas en `.env`
- [ ] Backend corriendo y accesible públicamente
- [ ] URL del webhook registrada en OpenPay Dashboard
- [ ] Eventos suscritos (charge.succeeded, charge.failed, etc.)
- [ ] Webhook secret configurado (opcional)
- [ ] Prueba manual realizada desde OpenPay
- [ ] Prueba con pago real (sandbox) exitosa
- [ ] Logs del backend mostrando webhooks recibidos
- [ ] Base de datos actualizándose correctamente

---

## 📞 Soporte

Si tienes problemas:

1. **Logs del Backend:** Revisa los logs para errores específicos
2. **Dashboard OpenPay:** Verifica el historial de webhooks
3. **Documentación OpenPay:** [https://www.openpay.mx/docs/webhooks.html](https://www.openpay.mx/docs/webhooks.html)
4. **Soporte OpenPay:** soporte@openpay.mx

---

## ✅ Verificación Final

Una vez configurado, realiza esta verificación:

```bash
# 1. Hacer un pago de prueba desde el frontend
# 2. Verificar logs del backend
# 3. Verificar en Prisma Studio que el pago se actualizó
# 4. Verificar en OpenPay Dashboard que el webhook se envió (200 OK)
```

Si todo funciona correctamente, verás:
- ✅ Webhook recibido en logs
- ✅ Firma verificada
- ✅ Pago actualizado en base de datos
- ✅ Estado 200 OK en OpenPay Dashboard

**¡Listo! Tu webhook está configurado y funcionando.**
