---
title: "Proxmox Recovery"
description: "Proxmox Recovery - Dive into the details of proxmox recovery with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=Proxmox+Recovery" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-25
badge: { label: "Proxmox" }
---

After a reboot of the `pvedaemon` and `webgui` everything crashed and after starting `webui` somehow in the process, I deleted the `config.db` and .conf files were lost I don't know how.
The best solution I found was to reset proxmox copy network config and VM dump files into the root (local), which I will discuss here.

```
root/var/lib/vz/dump/
```

and restore the VMs.

If needed to recover data from root or old VM disks (which is a proxmox's logical partitions for each VM)

1. Connect proxmox SSD to a Linux PC
2. install lvm2 pkg

```
sudo apt-get install lvm2
sudo pvscan
sudo vgchange -ay
sudo lvdisplay
sudo mount /dev/YourVolumeGroup/YourLogicalVolume /mnt/usb
```