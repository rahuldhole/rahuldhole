---
title: "Linux WiFi Drivers"
description: "Linux WiFi Drivers - Dive into the details of linux wifi drivers with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=Linux+WiFi+Drivers" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-25
badge: { label: "Linux" }
---

I bought USB wifi adapter Realtek Semiconductor Corp. USB3.0 802.11ac 1200M Adapter and connected it successfully on Ubuntu.

#### Following worked on Ubuntu 20.04.6 LTS
```
lsusb
sudo apt update
sudo apt install linux-generic
iwconfig
#nm-connection-editor
#nmcli connection up [YourWiFiConnectionName]
```