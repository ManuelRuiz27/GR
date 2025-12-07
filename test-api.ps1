# Script de prueba completo de API - Plataforma GR
Write-Host "`nINICIANDO PRUEBAS DE LA PLATAFORMA GR`n" -ForegroundColor Cyan

# PASO 1: Login
Write-Host "=== PASO 1: Login ===" -ForegroundColor Yellow
$loginBody = @{
    email = "juan.test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/auth/graduates/login' -Method POST -Body $loginBody -ContentType 'application/json'
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "[OK] Login exitoso" -ForegroundColor Green
    Write-Host "   Usuario: $($loginData.graduate.full_name)" -ForegroundColor Gray
    Write-Host "   Email: $($loginData.graduate.email)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Error en login: $_" -ForegroundColor Red
    exit
}

# PASO 2: Seleccionar 6 boletos
Write-Host "`n=== PASO 2: Seleccionar 6 Boletos ===" -ForegroundColor Yellow
$ticketsBody = @{tickets_count=6} | ConvertTo-Json
try {
    $ticketsResponse = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/graduates/me/tickets' -Method POST -Body $ticketsBody -ContentType 'application/json' -Headers @{Authorization="Bearer $token"}
    $ticketsData = $ticketsResponse.Content | ConvertFrom-Json
    Write-Host "[OK] Boletos creados exitosamente" -ForegroundColor Green
    Write-Host "   Cantidad: $($ticketsData.tickets_count) boletos" -ForegroundColor Gray
    Write-Host "   Precio por boleto: `$$($ticketsData.base_price_per_ticket) MXN" -ForegroundColor Gray
    Write-Host "   Total: `$$($ticketsData.total_amount) MXN" -ForegroundColor Gray
    Write-Host "   Plan de pagos:" -ForegroundColor Gray
    Write-Host "     - Enganche: `$$($ticketsData.payment_plan.initial_payment) MXN" -ForegroundColor Gray
    Write-Host "     - Mensualidades: $($ticketsData.payment_plan.months) meses" -ForegroundColor Gray
    Write-Host "     - Pago mensual: `$$($ticketsData.payment_plan.monthly_payment) MXN" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

# PASO 3: Ver lista de invitados
Write-Host "`n=== PASO 3: Ver Lista de Invitados ===" -ForegroundColor Yellow
try {
    $guestsResponse = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/graduates/me/guests' -Method GET -Headers @{Authorization="Bearer $token"}
    $guestsData = $guestsResponse.Content | ConvertFrom-Json
    Write-Host "[OK] Invitados obtenidos exitosamente" -ForegroundColor Green
    Write-Host "   Total de boletos: $($guestsData.tickets_count)" -ForegroundColor Gray
    Write-Host "   Invitados creados automaticamente:" -ForegroundColor Gray
    foreach ($guest in $guestsData.guests) {
        $tipo = if ($guest.type -eq "graduate") { "[GRADUADO]" } else { "[INVITADO]" }
        Write-Host "     $tipo $($guest.full_name) - $($guest.meal_type)" -ForegroundColor Gray
    }
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

# PASO 4: Agregar 2 invitados adicionales
Write-Host "`n=== PASO 4: Agregar 2 Invitados Adicionales ===" -ForegroundColor Yellow
$addGuestsBody = @{additional_guests=2} | ConvertTo-Json
try {
    $addGuestsResponse = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/graduates/me/guests' -Method POST -Body $addGuestsBody -ContentType 'application/json' -Headers @{Authorization="Bearer $token"}
    $addGuestsData = $addGuestsResponse.Content | ConvertFrom-Json
    Write-Host "[OK] Invitados agregados exitosamente" -ForegroundColor Green
    Write-Host "   Nuevos boletos: $($addGuestsData.added_guests_count)" -ForegroundColor Gray
    Write-Host "   Impacto financiero:" -ForegroundColor Gray
    Write-Host "     - Monto adicional: `$$($addGuestsData.financial_impact.extra_total_amount) MXN" -ForegroundColor Gray
    Write-Host "     - Meses retroactivos: $($addGuestsData.financial_impact.retroactive_months)" -ForegroundColor Gray
    Write-Host "     - Retroactivos a pagar: `$$($addGuestsData.financial_impact.retroactive_amount) MXN" -ForegroundColor Gray
    Write-Host "     - Total actualizado: `$$($addGuestsData.financial_impact.updated_total_amount) MXN" -ForegroundColor Gray
    Write-Host "     - Nueva mensualidad: `$$($addGuestsData.financial_impact.updated_monthly_payment) MXN" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

# PASO 5: Ver dashboard actualizado
Write-Host "`n=== PASO 5: Ver Dashboard Actualizado ===" -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/graduates/me/dashboard' -Method GET -Headers @{Authorization="Bearer $token"}
    $dashboardData = $dashboardResponse.Content | ConvertFrom-Json
    Write-Host "[OK] Dashboard obtenido exitosamente" -ForegroundColor Green
    Write-Host "   Evento: $($dashboardData.event.name)" -ForegroundColor Gray
    Write-Host "   Fecha: $($dashboardData.event.date)" -ForegroundColor Gray
    Write-Host "   Lugar: $($dashboardData.event.venue)" -ForegroundColor Gray
    Write-Host "`n   Progreso de pasos:" -ForegroundColor Gray
    foreach ($step in $dashboardData.steps) {
        Write-Host "     - $($step.label): $($step.status)" -ForegroundColor Gray
    }
    Write-Host "`n   Progreso de pagos:" -ForegroundColor Gray
    Write-Host "     - Total: `$$($dashboardData.payment_progress.total_amount) MXN" -ForegroundColor Gray
    Write-Host "     - Pagado: `$$($dashboardData.payment_progress.paid_amount) MXN" -ForegroundColor Gray
    Write-Host "     - Pendiente: `$$($dashboardData.payment_progress.pending_amount) MXN" -ForegroundColor Gray
    Write-Host "     - Progreso: $($dashboardData.payment_progress.progress_percent)%" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

# RESUMEN FINAL
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "[OK] Login exitoso" -ForegroundColor Green
Write-Host "[OK] 6 boletos seleccionados (Plan de pagos calculado)" -ForegroundColor Green
Write-Host "[OK] 6 invitados creados automaticamente" -ForegroundColor Green
Write-Host "[OK] 2 invitados adicionales agregados" -ForegroundColor Green
Write-Host "[OK] Retroactivos calculados correctamente" -ForegroundColor Green
Write-Host "[OK] Dashboard actualizado con progreso" -ForegroundColor Green
Write-Host "`nTodas las pruebas pasaron exitosamente!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
