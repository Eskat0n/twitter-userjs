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
					$source = $scriptName
					$destination = $extVer.fullname + "\script.js"
					Copy-Item -Path $source -Destination $destination

					echo "UserJs script copied"
				}
			}			
		}
	}
}
else 
{
	echo "Could not locate Google Chrome extensions directory"
}