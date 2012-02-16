$scriptName = "muyou.twitter.user.js"
$extensions = "$env:AppData\..\Local\Google\Chrome\User Data\Default\Extensions"

if ((Test-Path $extensions) -eq $true)
{
	foreach ($ext in Get-Childitem $extensions)
	{
		foreach ($extVer in Get-Childitem $ext.fullname)
		{
			$manifest = $extVer.fullname + "\manifest.json"
			if ((Test-Path $manifest) -eq $true)
			{	
				if ((Get-Content $manifest) -like "*$scriptName*")
				{
					echo $manifest
					$source = $scriptName
					$destination = $extVer.fullname + "\script.js"
					Copy-Item -Path $source -Destination $destination
				}
			}			
		}
	}
}
else 
{
	echo "Could not locate Google Chrome extensions directory"
}