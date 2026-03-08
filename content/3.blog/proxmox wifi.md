---
title: "Proxmox WiFi Connection Story"
description: "Proxmox WiFi Connection Story - Dive into the details of proxmox wifi connection story with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=Proxmox+WiFi+Connection+Story" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-23
badge: { label: "Proxmox" }
---

I bought usb wifi adapter Realtek Semiconductor Corp. USB3.0 802.11ac 1200M Adapter, to connect with my Dell PowerEdge R630
But I didn't know how to connect it to Proxmox.

## Via bypass to VM
### Bypass USB

```
lsusb | grep Realtek
# Bus 001 Device 003: ID 0bda:b812 Realtek Semiconductor Corp. RTL88x2bu [AC1200 Techkey]
qm set [REPLACE_VMID] -usb0 host=[REPLACE_ID]
qm set 998 -usb0 host=0bda:b812
# Restart VM
```

### Bypass in LXC

Via official docs (Worked but not so well tried installing many drivers don't remember all) (Note: restart server multiple times don't worry)
Articles:
* https://pve.proxmox.com/wiki/WLAN
* https://wiki.debian.org/WiFi/HowToUse
* https://ubuntuforums.org/showthread.php?t=1238387
* http://forums.debian.net/viewtopic.php?t=17199
* https://wiki.archlinux.org/index.php/WPA_supplicant#Configuration
* https://w1.fi/cgit/hostap/plain/wpa_supplicant/wpa_supplicant.conf


#### Add wpa_supplicant

```
# Command to generate passphrase psk
su -l -c "wpa_passphrase Livebox-6130_5GHz real_password > /etc/wpa_supplicant.conf"
```

```
# nano /etc/wpa_supplicant/wpa_supplicant-wlx90de806f0ac9.conf
trl_interface=/run/wpa_supplicant

network={
        ssid="Livebox-6130_5GHz"
        #psk="real_password"
        psk=578647825626be5ee793b531dfd9dd525530cc2ce8fa8e06096e8d67bff0a3ca
}
```

```
# ip link up
sudo ip link set wlx90de806f0ac9 up
ip link

# connect wifi
sudo wpa_supplicant -B -i wlx90de806f0ac9 -c /etc/wpa_supplicant/wpa_supplicant-wlx90de806f0ac9.conf

# get IP
dhclient wlx90de806f0ac9
# or reload it by > dhclient wlx90de806f0ac9 -r
```

```
# wlx90de806f0ac9 is wifi adapter interface name `iwconfig`
# nano /etc/network/interfaces
auto wlx90de806f0ac9
iface wlx90de806f0ac9 inet dhcp
        wpa-driver wext
        wpa-conf /etc/wpa_supplicant/wpa_supplicant-wlx90de806f0ac9.conf
        wireless-rate 54M

## Apply (WORKED)
# before make sure it can connect via `sudo wpa_supplicant -B -i wlx90de806f0ac9 -c /etc/wpa_supplicant/wpa_supplicant-wlx90de806f0ac9.conf`
sudo pkill -f "wpa_supplicant|dhclient|iwp|iwe|iwconfig|ifconfig|iwlist"
sudo systemctl restart networking
```


##### Trying to create a bridge other ways (worked but still need somem tests)

```
# /etc/network/interfaces
allow-hotplug wlx90de806f0ac9
iface wlx90de806f0ac9 inet dhcp
        wpa-driver wext
        wpa-conf /etc/wpa_supplicant/wpa_supplicant-wlx90de806f0ac9.conf
        wireless-rate 54M

auto vmbr2
iface vmbr2 inet static
    address 192.168.200.1/24
    #gateway 192.168.1.1
    bridge-ports none 
    bridge-stp off
    bridge-fd 0
    post-up echo 1 > /proc/sys/net/ipv4/ip_forward
    post-up iptables -t nat -A POSTROUTING -s '192.168.200.0/24' -o wlx90de806f0ac9 -j MASQUERADE
    post-down iptables -t nat -D POSTROUTING -s '192.168.200.0/24' -o wlx90de806f0ac9 -j MASQUERADE
    post-up   iptables -t raw -I PREROUTING -i fwbr+ -j CT --zone 1
    post-down iptables -t raw -D PREROUTING -i fwbr+ -j CT --zone 1
```


______________

Bypass is a simple solution but what if I want it on the proxmox itself?

## Via Network Manager (Works Well Tested)
```
lsusb
# 0bda:b812 Realtek Semiconductor Corp. RTL88x2bu [AC1200 Techkey]
apt update
apt install wireless-tools # I installed it for iwconfig specially
iwconfig
apt upgrade
apt install pve-headers-$(uname -r)
apt install pve-firmware
reboot
iwconfig
```

#### To connect a wifi (https://www.makeuseof.com/connect-to-wifi-with-nmcli/)

```
apt install network-manager
nmcli device wifi list # dev or device both are same
nmcli dev status # similar to iwconfig to find wifi interface name like wlx90de806f0ac9
nmcli connection up "SSID Name in double quotes" password "password double quotes"
nmcli --ask dev wifi connect "Livebox-6130_5GHz" # ask
nmcli connection up "Livebox-6130_5GHz" password "Helloworld"
nmcli radio wifi # check status 
nmcli radio wifi on
nmcli radio wifi off
```

#### See IP info

```
nano /etc/NetworkManager/system-connections/Livebox_5GHz.nmconnection 
```

#### Failures
1. adding wifi into `/etc/network/interfaces` does not work



## Troublshoot
1. Always make sure ip link is UP