---
title: "Disk Management in Linux"
description: "Disk Management in Linux - Dive into the details of disk management in linux with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=Disk+Management+in+Linux" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-25
badge: { label: "Linux" }
---

`lsusb` check attached USBs
`lsblk` check attached storage blocks
`smartctl` check disk info
`df -H` check disk space


`mount /dev/sdd1 /mnt/usb` to mount a drive
`umount /mnt/usb` unmount it

#### Mount NTFS Drive

```
sudo apt update
sudo apt install ntfs-3g

sudo mount -t ntfs-3g /dev/sdb1 /mnt/myntfs
sudo umount /mnt/myntfs
# Troubleshoot when not mounting
ntfsfix /dev/sdd2

```


#### Auto mount on reboot
Using 'fstab'
- use `exfat-fuse` instead of ntfs if the drive is not ntfs
- get UUID by `blkid /dev/sddX`

```
# /etc/fstab
UUID="<FE1A9E921A9E4793 REPLACE THIS>" /mnt/new-mount-path ntfs defaults,x-systemd.automount 0 0

```
`mount -a` to apply fstab which is filesystem table