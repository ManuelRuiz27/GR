# ⚡ Solución Rápida: Configurar Ngrok Manualmente

## 🎯 Tu Authtoken
```
36VH45WEAx6TRwunBqocNtMFY4r_7Rkd85hoTXKXurVv41CcV
```

## 📝 Pasos para Configurar Ngrok

### Opción 1: Reiniciar Terminal (MÁS FÁCIL)

1. **Cierra** tu terminal PowerShell actual
2. **Abre una NUEVA** terminal PowerShell
3. Ejecuta:
   ```powershell
   ngrok config add-authtoken 36VH45WEAx6TRwunBqocNtMFY4r_7Rkd85hoTXKXurVv41CcV
   ```
4. Luego ejecuta:
   ```powershell
   ngrok http 3000
   ```

### Opción 2: Usar Ruta Completa

Si la Opción 1 no funciona, busca ngrok manualmente:

1. Abre el Explorador de Archivos
2. Ve a: `C:\Users\ruiz_\AppData\Local\Programs\ngrok`
3. Haz doble clic en `ngrok.exe`
4. Se abrirá una ventana de comando
5. En esa ventana, escribe:
   ```
   config add-authtoken 36VH45WEAx6TRwunBqocNtMFY4r_7Rkd85hoTXKXurVv41CcV
   ```
6. Presiona Enter
7. Luego escribe:
   ```
   http 3000
   ```
8. Presiona Enter

### Opción 3: Descargar Ngrok Manualmente

1. Ve a: https://ngrok.com/download
2. Descarga la versión para Windows
3. Descomprime el archivo ZIP
4. Copia `ngrok.exe` a: `C:\Users\ruiz_\Music\GR`
5. Abre terminal en esa carpeta
6. Ejecuta:
   ```powershell
   .\ngrok.exe config add-authtoken 36VH45WEAx6TRwunBqocNtMFY4r_7Rkd85hoTXKXurVv41CcV
   .\ngrok.exe http 3000
   ```

## ✅ Cuando Funcione

Verás algo como:

```
ngrok

Session Status                online
Account                       Tu Nombre
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

## 🎯 Tu URL de Webhook

Copia la URL que dice "Forwarding" (la parte HTTPS):

```
https://abc123.ngrok-free.app/api/v1/webhooks/openpay
```

Esa es tu URL de webhook para registrar en OpenPay.

## 📋 Siguiente Paso

Una vez que tengas la URL:

1. Ve a: https://sandbox-dashboard.openpay.mx
2. Configuración → Webhooks → Nuevo Webhook
3. Pega tu URL: `https://tu-url.ngrok-free.app/api/v1/webhooks/openpay`
4. Eventos:
   - ✅ charge.succeeded
   - ✅ charge.failed
   - ✅ charge.cancelled
5. Guardar

## ⚠️ IMPORTANTE

- **NO cierres** la ventana de ngrok mientras estés probando
- La URL cambia cada vez que reinicias ngrok
- Deja ngrok corriendo en segundo plano

---

## 🆘 Si Nada Funciona

Alternativa sin ngrok: Usa **Cloudflare Tunnel** (gratis, sin registro):

```powershell
# Descargar cloudflared
winget install cloudflare.cloudflared

# Crear túnel
cloudflared tunnel --url http://localhost:3000
```

Te dará una URL como: `https://abc-def-ghi.trycloudflare.com`

Tu webhook sería: `https://abc-def-ghi.trycloudflare.com/api/v1/webhooks/openpay`
