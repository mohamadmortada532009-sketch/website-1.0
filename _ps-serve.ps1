# Temporary static server equivalent to serve.js (Node is not installed).
$root = $PSScriptRoot
$port = 8123
$types = @{
  '.html' = 'text/html'
  '.js'   = 'text/javascript'
  '.css'  = 'text/css'
  '.csv'  = 'text/csv'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.json' = 'application/json'
  '.ico'  = 'image/x-icon'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "up on http://localhost:$port"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($rel -eq '/' -or $rel -eq '') { $rel = '/index.html' }
    $rel = $rel.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
    $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if (-not $file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
      $bytes = [Text.Encoding]::UTF8.GetBytes('forbidden')
    } elseif (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes('not found')
    } else {
      $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
      $res.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { 'text/plain' })
      $bytes = [IO.File]::ReadAllBytes($file)
      $res.StatusCode = 200
    }
  } catch {
    $res.StatusCode = 500
    $bytes = [Text.Encoding]::UTF8.GetBytes('error')
  }
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
  $res.Close()
}
