$ErrorActionPreference = 'Stop'

$engines = @(
  'cyber-chess.js','connect4.js','sql-dungeon.js','network-defender.js','packet-rush.js',
  'api-outbreak.js','devops-pipeline.js','memory-matrix.js','regex-vault.js','evidence-quest.js'
)

foreach ($engine in $engines) {
  $path = Join-Path 'js/engines' $engine
  if (-not (Test-Path $path)) { throw "Missing engine: $path" }
}

$index = Get-Content -Raw index.html
foreach ($engine in $engines) {
  $needle = "js/engines/$engine"
  if ($index -notlike "*$needle*") { throw "Engine not referenced by index.html: $engine" }
}

$allEngineCode = ($engines | ForEach-Object { Get-Content -Raw (Join-Path 'js/engines' $_) }) -join "`n"
if ($allEngineCode -match '\beval\s*\(') { throw 'Security violation: eval() detected' }
if ($allEngineCode -match 'new\s+Function\s*\(') { throw 'Security violation: new Function() detected' }

Write-Host 'Game Lab integrity check passed: 10 engines, runtime references, eval-free engine code.'
