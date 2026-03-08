---
title: "pfSense basic firewall setup"
description: "pfSense basic firewall setup - Dive into the details of pfsense basic firewall setup with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=pfSense+basic+firewall+setup" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-25
badge: { label: "Networking" }
---

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