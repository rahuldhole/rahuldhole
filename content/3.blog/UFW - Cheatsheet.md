# UFW - Cheatsheet

## Most common commands
`sudo ufw enable`
`sudo ufw disable`
`sudo ufw status numbered`
`sudo ufw delete 1`
`sudo systemctl status ufw.service`

[More commands](https://blog.programster.org/ufw-cheatsheet)

#### Rules

```
ufw default deny # deny incoming by default
ufw allow from 90.16.45.159 # allow all from IP
```

### Troubleshoot
1. Disable it first and then add rule and enable it
2. `sudo ufw reload`

### Issues
1. It does not block docker ports well


### IPTable
Cheat sheet: https://andreafortuna.org/2019/05/08/iptables-a-simple-cheatsheet/