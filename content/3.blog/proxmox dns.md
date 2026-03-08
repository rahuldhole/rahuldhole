# Proxmox DNS Management

Sometimes you can `dig` but can't `ping` it, flush the cache, and the check gateway. 

```
sudo systemd-resolve --flush-caches
# OR
sudo resolvectl flush-caches

## And check the gateway

# check routing 
ip r
```

In `Proxmox > Lab > System > DNS` add your DNS server names 
1. pfsense 192.168.1.1
2. Cloudflare 1.1.1.1
3. Router2 193.168.2.1

And then keep LXC DNS empty as the above host DNS will be applied automatically, just make sure to add the gateway when adding static IP for pfsense n/w in `LXC > Network`


## Troubleshoot
- While using LXC when everything looks good but still your network is not reachable then check the serially last network added in the LXC because the last LXC's gateway is taken into consideration for routing `ip r`.

  **Soltuions**

  1. Permanent solution is to edit LXC `nano /etc/pve/lxc/<103>.conf` reorder the net0, net1 and keep it in descending order of routing you want. If the gateway is not mentioned the network will not be registered into the routing table `main` of `/etc/iproute2/rt_tables`

  2. In urgency If you can't change the order then just turn the last network in LXC off->on.

- Proxmox's DNS resets after every reboot so does the LXC's. This is not bad it is expected behavior, don't need to force fixed DNS rather update every time we reboot or set the routing table in LXCs.
 