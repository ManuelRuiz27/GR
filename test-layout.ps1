# Script de prueba para Layout API
$token = "REEMPLAZA_CON_TU_TOKEN"

Write-Host "`n=== PRUEBA 1: Obtener Layout ===" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/events/550e8400-e29b-41d4-a716-446655440000/layout/overview' -Method GET -Headers @{Authorization="Bearer $token"}
    Write-Host "[OK] Layout obtenido exitosamente" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Total de mesas: $($data.tables.Count)" -ForegroundColor Gray
    Write-Host "   Mesa seleccionada: $($data.my_selection)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

Write-Host "`n=== PRUEBA 2: Seleccionar Mesa 1 ===" -ForegroundColor Cyan
try {
    # Primero obtener el ID de la Mesa 1
    $layoutResponse = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/events/550e8400-e29b-41d4-a716-446655440000/layout/overview' -Method GET -Headers @{Authorization="Bearer $token"}
    $layoutData = $layoutResponse.Content | ConvertFrom-Json
    $mesa1 = $layoutData.tables | Where-Object { $_.label -eq "Mesa 1" }
    
    if ($mesa1) {
        $body = @{table_id=$mesa1.id} | ConvertTo-Json
        $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/graduates/me/layout/selection' -Method POST -Body $body -ContentType 'application/json' -Headers @{Authorization="Bearer $token"}
        Write-Host "[OK] Mesa seleccionada exitosamente" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
    } else {
        Write-Host "[ERROR] No se encontró Mesa 1" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
}

Write-Host "`nPara obtener tu token, haz login primero:" -ForegroundColor Yellow
Write-Host '$body = @{email="juan.test@example.com";password="password123"} | ConvertTo-Json' -ForegroundColor Gray
Write-Host '$response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/graduates/login" -Method POST -Body $body -ContentType "application/json"' -ForegroundColor Gray
Write-Host '$data = $response.Content | ConvertFrom-Json' -ForegroundColor Gray
Write-Host 'Write-Host "Token: $($data.token)"' -ForegroundColor Gray
