# 🚀 Guía Rápida de Prueba - Plataforma GR

## Datos de Prueba Incluidos

El seed ya crea automáticamente:
- ✅ **1 Evento**: "Graduación Arquitectura 2025"
  - ID: `550e8400-e29b-41d4-a716-446655440000`
  - Fecha: 30 de Junio, 2025
  - Lugar: Salón Las Palmas
  - Precio por boleto: $1,500 MXN
  - Plan: 6 meses
  - Enganche: $3,000 MXN
- ✅ **100 Mesas**: Mesa 1 a Mesa 100 (capacidad 10 personas c/u)

## Paso 1: Iniciar PostgreSQL con Docker

```bash
# En la raíz del proyecto (c:\Users\ruiz_\Music\GR)
docker-compose up -d

# Verificar que esté corriendo
docker ps
```

Deberías ver algo como:
```
CONTAINER ID   IMAGE              STATUS         PORTS
abc123...      postgres:15-alpine Up 2 seconds   0.0.0.0:5432->5432/tcp
```

## Paso 2: Configurar y Ejecutar Backend

```bash
cd backend

# Si es la primera vez, instalar dependencias
npm install

# Copiar variables de entorno (si no lo has hecho)
copy .env.example .env

# Generar Prisma Client
npx prisma generate

# Crear tablas en la base de datos
npx prisma migrate dev --name init

# Cargar datos de prueba (evento + 100 mesas)
npm run prisma:seed

# Iniciar servidor
npm run start:dev
```

Deberías ver:
```
🚀 Application is running on: http://localhost:3000/api/v1
```

## Paso 3: Probar Backend con curl

### 3.1 Registrar un Usuario de Prueba

```bash
curl -X POST http://localhost:3000/api/v1/auth/graduates/register -H "Content-Type: application/json" -d "{\"event_id\":\"550e8400-e29b-41d4-a716-446655440000\",\"full_name\":\"Juan Perez\",\"email\":\"juan@test.com\",\"phone\":\"4441234567\",\"career\":\"Ingenieria en Sistemas\",\"generation\":\"2020-2024\",\"group\":\"6A\",\"password\":\"password123\"}"
```

**Guarda el token que recibes en la respuesta!**

### 3.2 Login (si ya te registraste antes)

```bash
curl -X POST http://localhost:3000/api/v1/auth/graduates/login -H "Content-Type: application/json" -d "{\"email\":\"juan@test.com\",\"password\":\"password123\"}"
```

### 3.3 Ver Dashboard

```bash
# Reemplaza TU_TOKEN con el token que recibiste
curl -X GET http://localhost:3000/api/v1/graduates/me/dashboard -H "Authorization: Bearer TU_TOKEN"
```

### 3.4 Seleccionar Boletos (6 boletos)

```bash
curl -X POST http://localhost:3000/api/v1/graduates/me/tickets -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d "{\"tickets_count\":6}"
```

Verás el plan de pagos calculado automáticamente.

### 3.5 Ver Invitados Creados

```bash
curl -X GET http://localhost:3000/api/v1/graduates/me/guests -H "Authorization: Bearer TU_TOKEN"
```

Verás 6 invitados (tú + 5 invitados).

### 3.6 Agregar 2 Invitados Más (con retroactivos)

```bash
curl -X POST http://localhost:3000/api/v1/graduates/me/guests -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d "{\"additional_guests\":2}"
```

Verás el cálculo de retroactivos.

## Paso 4: Probar Frontend

### 4.1 Configurar Frontend

```bash
# En otra terminal
cd frontend

# Si es la primera vez
npm install

# Copiar variables de entorno
copy .env.example .env

# Iniciar servidor
npm run dev
```

### 4.2 Abrir en Navegador

Abre: `http://localhost:5173`

### 4.3 Flujo de Prueba en UI

**IMPORTANTE**: El frontend actual es una demo sin autenticación completa. Para probarlo:

1. **Opción A - Usar token manualmente**:
   - Abre las DevTools del navegador (F12)
   - Ve a Console
   - Ejecuta: `localStorage.setItem('token', 'TU_TOKEN_AQUI')`
   - Recarga la página

2. **Opción B - Probar componentes directamente**:
   - Tab **🎫 Boletos**:
     - Usa +/- para seleccionar cantidad (1-20)
     - Ve el cálculo en tiempo real
     - Haz clic en "Confirmar Boletos"
   - Tab **👥 Invitados**:
     - Ve la lista de invitados
     - Haz clic en "Editar" para cambiar nombres
     - Haz clic en "+ Agregar Invitados"
     - Selecciona cantidad y confirma
     - Observa el cálculo de retroactivos

## Paso 5: Ver Base de Datos (Opcional)

### Opción A: Prisma Studio

```bash
cd backend
npx prisma studio
```

Abre: `http://localhost:5555`

Podrás ver todas las tablas y datos.

### Opción B: Conectar con Cliente PostgreSQL

```
Host: localhost
Port: 5432
Database: plataforma_gr
User: postgres
Password: postgres123
```

## Datos de Prueba Disponibles

### Usuario de Prueba
- Email: `juan@test.com`
- Password: `password123`

### Evento
- ID: `550e8400-e29b-41d4-a716-446655440000`
- Nombre: "Graduación Arquitectura 2025"
- Fecha: 30 de Junio, 2025

### Mesas
- 100 mesas disponibles
- Capacidad: 10 personas cada una
- IDs: `table-1` a `table-100`

## Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar que Docker esté corriendo
docker ps

# Si no está, iniciarlo
docker-compose up -d
```

### Error: "Port 5432 already in use"
```bash
# Detener otros PostgreSQL
# O cambiar el puerto en docker-compose.yml
```

### Error: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

### Error: "Table does not exist"
```bash
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
```

### Frontend no conecta con Backend
```bash
# Verificar que backend esté corriendo en puerto 3000
# Verificar .env en frontend:
# VITE_API_URL=http://localhost:3000/api/v1
```

## Detener Todo

```bash
# Detener backend: Ctrl+C en la terminal

# Detener frontend: Ctrl+C en la terminal

# Detener Docker (mantiene datos)
docker-compose down

# Detener Docker y borrar datos
docker-compose down -v
```

## Próximos Pasos

Una vez que pruebes esto, puedes:
1. Implementar autenticación completa en frontend
2. Agregar más funcionalidades (Sprint 3: Croquis de mesas)
3. Personalizar los datos de prueba en `backend/prisma/seed.ts`

---

**¿Necesitas ayuda?** Revisa el README.md o el walkthrough.md para más detalles.
