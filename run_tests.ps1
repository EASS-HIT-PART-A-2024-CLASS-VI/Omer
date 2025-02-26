Write-Host "Running Backend Tests..."
Set-Location backend
python -m pytest -v
Set-Location ..

Write-Host "`nRunning Frontend Tests..."
Set-Location frontend
npm test -- --watchAll=false
Set-Location ..

Write-Host "`nAll tests completed!" 