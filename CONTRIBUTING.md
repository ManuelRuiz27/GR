# Guía de Contribución

¡Gracias por tu interés en contribuir a la Plataforma GR! 🎉

## 📋 Proceso de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios siguiendo las convenciones
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos de Commits

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
feat(payments): add OpenPay SPEI integration
fix(auth): resolve JWT expiration issue
docs(readme): update installation instructions
refactor(graduates): simplify ticket creation logic
```

## 🌿 Estrategia de Branches

- `main` - Código en producción (protegida)
- `develop` - Rama de desarrollo principal
- `feature/*` - Nuevas funcionalidades
- `fix/*` - Correcciones de bugs
- `hotfix/*` - Correcciones urgentes en producción

## ✅ Checklist Pre-PR

Antes de crear un Pull Request, asegúrate de:

- [ ] El código compila sin errores
- [ ] Los tests pasan (`npm run test`)
- [ ] El código sigue las convenciones de estilo
- [ ] La documentación está actualizada
- [ ] Los commits siguen las convenciones
- [ ] No hay credenciales o datos sensibles

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm run test
```

## 📚 Estilo de Código

### TypeScript/JavaScript
- Usar TypeScript estricto
- Preferir `const` sobre `let`
- Usar arrow functions
- Nombres descriptivos en inglés

### React
- Componentes funcionales con hooks
- Props tipadas con TypeScript
- Usar Context API para estado global

### NestJS
- Seguir arquitectura modular
- DTOs para validación
- Decoradores apropiados

## 🐛 Reportar Bugs

Usa el template de issues de GitHub e incluye:

1. Descripción clara del problema
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Screenshots (si aplica)
5. Versión de Node.js y navegador

## 💡 Sugerir Features

Abre un issue con:

1. Descripción de la funcionalidad
2. Casos de uso
3. Mockups o ejemplos (si aplica)

## 📞 Contacto

Si tienes preguntas, abre un issue o contacta a los maintainers.

---

¡Gracias por contribuir! 🚀
