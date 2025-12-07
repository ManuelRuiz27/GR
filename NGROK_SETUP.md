# 🚀 Configuración Rápida de Ngrok para Webhook OpenPay

## Paso 1: Obtener Authtoken de Ngrok

1. Ve a https://dashboard.ngrok.com/signup
2. Regístrate gratis (con Google, GitHub o email)
3. Una vez dentro, ve a: https://dashboard.ngrok.com/get-started/your-authtoken
4. Copia tu authtoken (se ve así: `2abc123def456...`)

## Paso 2: Configurar Ngrok

Abre una nueva terminal PowerShell y ejecuta:

```powershell
# Configurar tu authtoken (solo una vez)
ngrok config add-authtoken TU_AUTHTOKEN_AQUI
```

## Paso 3: Levantar Túnel

```powershell
# Exponer el puerto 3000 (donde corre tu backend)
ngrok http 3000
```

## Paso 4: Copiar URL

Verás algo como esto:

```
Session Status                online
Account                       Tu Nombre (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Tu URL de webhook es:**
```
https://abc123.ngrok-free.app/api/v1/webhooks/openpay
```

## Paso 5: Registrar en OpenPay

1. Ve a https://sandbox-dashboard.openpay.mx
2. Configuración → Webhooks → Nuevo Webhook
3. URL: `https://abc123.ngrok-free.app/api/v1/webhooks/openpay`
4. Eventos:
   - ✅ charge.succeeded
   - ✅ charge.failed
   - ✅ charge.cancelled
5. Guardar

## ⚠️ IMPORTANTE

- **NO cierres la terminal de ngrok** mientras estés probando
- La URL cambia cada vez que reinicias ngrok (plan gratuito)
- Si reinicias ngrok, debes actualizar la URL en OpenPay Dashboard

## 🔍 Verificar que Funciona

1. Deja ngrok corriendo
2. Haz un pago de prueba desde tu frontend
3. Revisa los logs de tu backend (la otra terminal)
4. Deberías ver:
   ```
   [WebhooksController] Webhook received from OpenPay
   [WebhooksController] Webhook signature verified
   ```

## 📊 Monitorear Webhooks

Ngrok tiene una interfaz web local:
```
http://localhost:4040
```

Ahí puedes ver:
- Todas las peticiones HTTP que llegan
- Headers
- Body
- Respuestas

---

## 🆘 Si tienes problemas

**Error: "authtoken required"**
- Ejecuta: `ngrok config add-authtoken TU_TOKEN`

**Error: "port already in use"**
- Verifica que tu backend esté en el puerto 3000
- O usa otro puerto: `ngrok http 3001`

**Webhook no llega**
- Verifica que ngrok esté corriendo
- Verifica que la URL en OpenPay sea correcta
- Revisa http://localhost:4040 para ver si llegan peticiones

---

## ✅ Checklist

- [ ] Cuenta de ngrok creada
- [ ] Authtoken configurado
- [ ] Ngrok corriendo (`ngrok http 3000`)
- [ ] URL HTTPS copiada
- [ ] URL registrada en OpenPay Dashboard
- [ ] Eventos seleccionados en OpenPay
- [ ] Pago de prueba realizado
- [ ] Webhook recibido en logs del backend
