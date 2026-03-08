# pfSense basic firewall setup


**Important** Firewall rules are applied in top-to-bottom order

#### Create Alias
Add an alias to list all the private IP addresses as per RFC1918
`pfsense > firewall > Alias > IP > Add > Network`

```
# RFC1918
10.0.0.0/8 
172.16.0.0/12
192.168.0.0/16
```

# Create Rule

`pfsense > firewall > Rules > Add`

```
# Rule1 [All VLANs]
# to access internet and block all LAN addresses
Action: Pass
Protocol: Any
Source: Any
Destination: Ignore Alias RFC1918
Save!
```

```
# Rule2 [ExperimentalLAN]
# to access ExperimentalLAN from any LAN
Action: Pass
Protocol: Any
Source: Any
Destination: ExperimentalLAN
Save!
```


