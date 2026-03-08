# SOCKS5 Proxy Quickstart

Dante SOCKS5 Proxy Server

```
sudo apt update
sudo apt -y install dante-server
sudo systemctl is-enabled danted
sudo cp /etc/danted.conf{,.bak}
```

`sudo nano /etc/danted.conf` # change internet port eth0

```
logoutput: syslog
user.privileged: root
user.unprivileged: nobody

# The listening network interface or address.
internal: 0.0.0.0 port=1080

# The proxying network interface or address.
external: eth0 # *IMP internet port

# socks-rules determine what is proxied through the external interface.
socksmethod: username

# client-rules determine who can connect to the internal interface.
clientmethod: none

client pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
}

socks pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
}
```

## Secure SOCKS5

Create a non shell blank secure user
```
sudo useradd -r -s /bin/false your_dante_user
sudo passwd your_dante_user
```

```
sudo systemctl restart danted.service
systemctl status danted.service
```


## Test

```
curl -v -x socks5://rahul-socks:password@172.27.7.9:1080 http://example.com/
```

```
ssh -N -D 1080 rahul-socks@172.27.7.9
```
