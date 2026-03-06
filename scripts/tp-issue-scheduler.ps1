# tp-issue-scheduler.ps1
# Auto-run Claude CLI to process GitHub Issues (triggered by Windows Task Scheduler)

$projectDir = "C:\Users\Ray\Desktop\ClaudeProjet\trip-planner"
$logFile = "$projectDir\scripts\tp-issue.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Add-Content -Path $logFile -Value "[$timestamp] Start tp-issue" -Encoding UTF8

Set-Location $projectDir
claude --dangerously-skip-permissions -p "/tp-issue" 2>&1 | Add-Content -Path $logFile -Encoding UTF8

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "[$timestamp] Done" -Encoding UTF8
Add-Content -Path $logFile -Value "---" -Encoding UTF8
