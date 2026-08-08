$envContent = Get-Content -Path .env.test -Raw
$envLines = $envContent -split "`n"
foreach ($line in $envLines) {
  if ($line -match "^DATABASE_URL=(.*)") {
    $dbUrl = $matches[1].Trim()
    $dbUrl = $dbUrl -replace "localhost", "127.0.0.1"
    $env:DATABASE_URL = $dbUrl
  }
}
npx.cmd jest --runInBand
