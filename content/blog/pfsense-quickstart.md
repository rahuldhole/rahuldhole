---
title: "pfSense Quickstart"
description: "pfSense Quickstart - Dive into the details of pfsense quickstart with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=pfSense+Quickstart" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-24
badge: { label: "Networking" }
---

#### Prerequisite:
1. Create vmbrX/VLAN/etc virtual bridge in Proxmox > Network
2. Have an internet connection vmbr0 probably
3. 8 GB disk, 512 MB RAM, 1 CPU core and two IPs
4. watch a quick tutorial to see the latest updates

#### Steps: 
1. Using ISO creates a VM 
2. Add vmbr0 and vmbr1 and vmbr1 must be connected to the internet
3. make vmbr0 as a **private** LAN add a static ip 172.27.1.1/26 255.255.255.192 
4. DHCP vmbr1
5. Create some SSH or VPN tunnel connection and get access to 172.27.1.1
5. Go to http://172.27.1.1/
6. ID admin and pas: pfsense so set a new password
7. Go to interfaces > Assignments > Add Private LAN and WAN connections
8. Click on Private LAN or WAN | Go to Interfaces > Private LAN or WAN
9. Enable both 
10. IPv4 Configuration Type static IP in Private LAN and type 172.27.1.1 below in IPv4 Address and select CIDR as 26
11. Go to services > DHCP Server > Enable DHCP for Private LAN and select a DHCP range 172.27.1.10-172.27.1.60

#### Adding more bridges
1. repeat proxmox steps
2. Add new network in pfsense VM
3. Again go to the interfaces and configure them and set DHCP server
4. Set up firewall rules as 
    Action: Pass 
    Protocol: Any
    save to provide internet access
5. You may add one more rule to 
    Action: Block 
    Protocol: Any 
    Destination Private LAN
    and save it to block any network reaching Private LAN devices

#### Important notes after creation

1. In pfsense make it eth0 and make a working internet link as eth1 although eth0 would be a LAN and eth1 as WAN
2. Don't forget DNS servers and Firewall rules to allow everything.
3. Firewall Rule> Block access to private LAN from each LAN
4. In Pi Hole> enable DNS to resolve from any origin of network. Go to settings >DNS>Interfce

#### Issues
1. Sometimes DNS does not resolve in VMs so in that case add 1.1.1.1 or any secondary DNS server

### DNS Forwarding

Change domain to pfsense.private.babunet
and configure proxmox.private.babunet as DNS Forwarder > Host Overrides

To enable hosts visible by their hostnames. Or you may assign a custom hostname by custom IP as follows:
    1. ServicesDHCP > Server > DHCP Static Mappings
    2. Assign host+domain name
    3. in DNS 

##### Troubleshoot clear DNS cache in PC and browser
1.    `sudo systemd-resolve --flush-caches`
    chrome://net-internals
    Check DHCP lease under Status

2. When pfsense IP is not reachable means firewall rules need to be reordered or change