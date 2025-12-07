# 🎓 Plataforma GR - Sistema de Gestión de Graduación

Sistema completo para la gestión de eventos de graduación con selección de boletos, asignación de mesas, menús personalizados, pagos integrados y personalización de regalos.

## ✨ Características

- 🎫 **Gestión de Boletos**: Selección flexible de cantidad de boletos
- 🪑 **Asignación de Mesas**: Croquis interactivo para selección de mesa
- 🍽️ **Menús Personalizados**: Selección de platillos para cada invitado
- 💳 **Pagos Integrados**: OpenPay (Tarjeta, SPEI, OXXO)
- 🎁 **Termo Personalizado**: Desbloqueable al alcanzar 70% de pagos
- 📊 **Dashboard Premium**: Seguimiento de progreso en tiempo real
- 🔐 **Autenticación Segura**: JWT con bcrypt

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT + Passport
- **Pagos**: OpenPay SDK
- **Validación**: class-validator

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Estilos**: Tailwind CSS (custom design system)
- **HTTP Client**: Axios

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn
- Cuenta OpenPay (sandbox para desarrollo)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/GR.git
cd GR
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección de Configuración)

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Seed de datos de prueba (opcional)
npx ts-node prisma/seed.ts

# Iniciar servidor de desarrollo
npm run start:dev
```

El backend estará disponible en `http://localhost:3000/api/v1`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## ⚙️ Configuración

### Variables de Entorno - Backend

Edita `backend/.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/gr_db"

# JWT
JWT_SECRET="tu-clave-secreta-muy-segura"

# OpenPay (obtener en https://sandbox-dashboard.openpay.mx)
OPENPAY_MERCHANT_ID=tu_merchant_id
OPENPAY_PRIVATE_KEY=sk_xxxxxxxxxxxxx
OPENPAY_PUBLIC_KEY=pk_xxxxxxxxxxxxx
OPENPAY_SANDBOX=true

# App
NODE_ENV=development
PORT=3000
```

### Credenciales de Prueba

Después de ejecutar el seed:

```
📧 Email:    demo@graduacion.com
🔑 Password: demo123
```

### Tarjetas de Prueba OpenPay

**Tarjeta exitosa:**
```
Número: 4111 1111 1111 1111
CVV: 123
Fecha: 12/25
Nombre: JUAN PEREZ
```

## 📁 Estructura del Proyecto

```
GR/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Autenticación
│   │   ├── graduates/      # Módulo de graduados
│   │   ├── payments/       # Integración de pagos
│   │   └── prisma/         # Servicio Prisma
│   ├── prisma/
│   │   ├── schema.prisma   # Esquema de BD
│   │   └── seed.ts         # Datos de prueba
│   └── package.json
│
├── frontend/               # App React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── context/        # Context API
│   │   └── services/       # API clients
│   └── package.json
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

## 🔄 Flujo de Usuario

1. **Registro/Login** → Autenticación JWT
2. **Selección de Boletos** → Cantidad + tipo de platillo
3. **Selección de Mesa** → Croquis interactivo
4. **Confirmación de Platillos** → Menú por invitado
5. **Pagos** → Pago inicial + mensualidades
6. **Termo Personalizado** → Desbloqueado al 70% de pagos
7. **Resumen** → Vista completa del evento

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Deployment

### Backend (Render/Railway)
```bash
npm run build
npm run start:prod
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Los archivos estarán en dist/
```

## 🤝 Contribución

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías de contribución.

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- Tu Nombre - [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- OpenPay por la integración de pagos
- NestJS y React communities
