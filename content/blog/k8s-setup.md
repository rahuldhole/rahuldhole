---
title: "Kubernetes Cluster Setup Guide"
description: "Kubernetes Cluster Setup Guide - Dive into the details of kubernetes cluster setup guide with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=Kubernetes+Cluster+Setup+Guide" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-06-16
badge: { label: "DevOps" }
---

## Common Installation on both worker and control plane nodes

```sh
# using 'sudo su' is not a good practice.
sudo apt update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
sudo apt install docker.io -y
sudo usermod -aG docker $USER
sudo chmod 777 /var/run/docker.sock

# Update the Version if needed
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt update && sudo apt install kubeadm kubectl kubelet -y

# VM related setup
sudo apt install containerd
sudo mkdir /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml > /dev/null
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
echo "Enabled SystemdCgroup in containerd default config"

sudo sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
echo "IPv4 forwarding has been enabled. Bridging enabled!"

echo "br_netfilter" | sudo tee /etc/modules-load.d/k8s.conf > /dev/null
echo "br_netfilter has been added to /etc/modules-load.d/k8s.conf."

sudo swapoff -a
echo "Disabled swap"
echo "Edit /etc/fstab and disable swap if swap was eneabled"

echo "Reboot the server."
```


### Control plane
**Note** Replace endpoint IP as host IP and node-name as hostname and keep pod nw CIDR as it is
```sh
# tmux
sudo kubeadm init --control-plane-endpoint=172.27.5.14 --node-name k8s-master --pod-network-cidr=10.244.0.0/16
```

```sh
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
kubectl get nodes
kubectl get pods -A

echo "Please wait a few minutes to get all pods running before joining any worker nodes."
```


### Worker

#### Join as a Worker
```sh
sudo kubeadm reset pre-flight checks

# sudsho + paste join cmd

# sample command
#  kubeadm join 172.27.5.14:6443 --token ocks85.u2sqfn330l36ypkc \
        #--discovery-token-ca-cert-hash #sha256:939be6a03f1a9014bfbb98507086e453fc83cd109319895871d27f9772653a1d \

# Be careful if there is --control-plane in join command means one more master node 
```

## Join as a control plane
```sh
# on master/control plane
kubeadm token create --print-join-command

# Get certificate key
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```
```sh
# on expected new control plane
sudo kubeadm reset pre-flight checks

sudo kubeadm join <control_plane_endpoint>:<port> --token <token> --discovery-token-ca-cert-hash sha256:<discovery_token_ca_cert_hash> --control-plane --certificate-key <certificate_key>
```

## Useful commands

```sh
sudo kubeadm token create --print-join-command # port 6443 need to be open

```



## Troubleshoot
1. Wait for all the control plane pods to be running before joining new workers in
2. Have plenty of disk space, the setup size is 4GB on the control plane and 3GB on the worker node
3. reprint the join command when it expired
4. API Server failed communication: Must have a static IP to the master node.



## References
https://github.com/LondheShubham153/kubestarter/blob/main/kubeadm_installation.md
https://www.learnlinux.tv/how-to-build-an-awesome-kubernetes-cluster-using-proxmox-virtual-environment/