# 📡 Endpoints API - GR Platform

## Base URL
```
http://localhost:3000/api/v1
```

## 🔐 Autenticación

### POST /auth/graduates/register
Registrar nuevo graduado
```json
{
  "event_id": "uuid",
  "full_name": "string",
  "email": "string",
  "phone": "string (min 10)",
  "career": "string",
  "generation": "string",
  "group": "string (opcional)",
  "password": "string (min 6)"
}
```

### POST /auth/graduates/login
Iniciar sesión
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "graduate": { ...graduate_data }
}
```

## 👨‍🎓 Graduados (Requieren autenticación)

### GET /graduates/me
Obtener perfil del graduado

### GET /graduates/me/dashboard
Obtener dashboard con progreso

### POST /graduates/me/tickets
Crear/seleccionar boletos
```json
{
  "ticket_type": "individual | couple",
  "quantity": number
}
```

### GET /graduates/me/guests
Listar invitados

### POST /graduates/me/guests
Agregar invitados
```json
{
  "count": number
}
```

### PATCH /graduates/me/guests/:id
Actualizar invitado
```json
{
  "full_name": "string",
  "meal_type": "adult | child"
}
```

## 🗺️ Layout (Mesas)

### GET /tables
Obtener todas las mesas disponibles

### POST /tables/select
Seleccionar mesa
```json
{
  "table_id": "string"
}
```

## 🍽️ Comidas

### GET /meals
Obtener opciones de comidas

### POST /meals/assign
Asignar platillos a invitados
```json
{
  "assignments": [
    {
      "guest_id": "string",
      "meal_option_id": "string"
    }
  ]
}
```

## 💳 Pagos

### GET /payments/config
Obtener configuración de OpenPay (merchant_id, public_key)

### GET /payments/summary
Obtener resumen de pagos

### GET /payments/history
Obtener historial de pagos

### POST /payments/charge
Crear cargo de pago
```json
{
  "payment_method": "card | bank_account | store",
  "token": "string (solo para card)",
  "payment_type": "initial | monthly",
  "month_number": number (opcional, para monthly)
}
```

## 🌡️ Termo

### GET /thermo/status
Obtener estado del termo

### POST /thermo/customize
Personalizar termo
```json
{
  "prefix": "string",
  "name": "string"
}
```

## 🔔 Webhooks

### POST /webhooks/openpay
Webhook de OpenPay (no requiere autenticación)

---

## Autenticación

Todos los endpoints (excepto auth y webhooks) requieren el header:
```
Authorization: Bearer {token}
```

## Códigos de Estado

- `200` - OK
- `201` - Created
- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (sin token o token inválido)
- `404` - Not Found
- `500` - Internal Server Error
