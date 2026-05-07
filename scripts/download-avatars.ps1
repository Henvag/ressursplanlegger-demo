$ErrorActionPreference = "Stop"

$target = Join-Path $PSScriptRoot "..\\assets\\avatars"
New-Item -ItemType Directory -Force -Path $target | Out-Null

for ($i = 1; $i -le 10; $i++) {
  $url = "https://i.pravatar.cc/96?img=$i"
  $outFile = Join-Path $target ("avatar{0}.jpg" -f $i)
  Invoke-WebRequest -Uri $url -OutFile $outFile
}

Write-Host "Downloaded avatars to $target"

