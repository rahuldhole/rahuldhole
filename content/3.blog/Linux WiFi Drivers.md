# Linux WiFi Drivers
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
