---
title: How to Increase Free Tier Memory on AWS EC2
authors:
  - name: Rahul Dhole
    to: /
    avatar:
      src: /profile.png
badge:
  label: Cloud
date: 2024-09-11
description: How to Increase Free Tier Memory on AWS EC2 - Dive into the details of how to increase free tier memory on aws ec2 with this quick guide.
image:
  src: https://placehold.co/800x400/0f172a/3b82f6?text=How+to+Increase+Free+Tier+Memory+on+AWS+EC2
pinned: false
---

AWS offers a free tier for EC2 instances that gives you 750 hours of computing time per month, typically with **t2.micro** or **t3.micro** instances. These instances come with 1 GiB of RAM, which can feel limited when running multiple services or applications. Fortunately, you can maximize memory usage through **swap space**, which utilizes disk space (such as SSD storage) as virtual memory.

While swap is not a substitute for real RAM, it can help prevent memory exhaustion issues by providing temporary relief when your instance runs out of physical memory.

## What Is Swap Space?

Swap space is a portion of disk storage that acts as overflow memory. When your system's RAM gets full, inactive data is moved to swap, allowing your instance to keep running smoothly. It’s slower than real memory because it's stored on disk, but it's better than running out of memory entirely.

## Step-by-Step Guide to Increasing Memory with Swap Space

Here's how you can create a swap file and increase your system's available memory:

### 1. Check Current Memory and Swap

First, check your current memory and swap space by running:

```bash
free -h
```

This will show you the total, used, and free memory along with swap space. In most cases, for free tier instances, there’s no swap configured by default.

### 2. Create a Swap File

We’ll use the `fallocate` command to create a 4 GiB swap file. This file will reside on your instance's SSD and act as virtual memory.

```bash
sudo fallocate -l 4G /mnt/ssd-swapfile
```

If `fallocate` isn't available, you can use `dd` as an alternative:

```bash
sudo dd if=/dev/zero of=/mnt/ssd-swapfile bs=1M count=4096
```

### 3. Secure the Swap File

Ensure only root has access to the swap file:

```bash
sudo chmod 600 /mnt/ssd-swapfile
```

### 4. Set Up the Swap Area

Prepare the swap file for use by setting up the swap area:

```bash
sudo mkswap /mnt/ssd-swapfile
```

### 5. Enable the Swap File

Now enable the swap file so the system can start using it:

```bash
sudo swapon /mnt/ssd-swapfile
```

You can verify that the swap is active by running `free -h` again:

```bash
free -h
```

### 6. Make the Swap File Permanent

If you want this swap file to be available after reboot, add it to `/etc/fstab`:

```bash
echo '/mnt/ssd-swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 7. Optimize Swap Usage

By default, Linux decides when to use swap space based on a setting called `swappiness`, which controls how aggressively the system swaps out inactive processes from RAM. A lower value makes the system prefer RAM usage, while a higher value makes it use swap space more.

To change the swappiness value to a more conservative 10 (default is 60), run:

```bash
sudo sysctl vm.swappiness=10
```

To make this change persistent, add the following line to `/etc/sysctl.conf`:

```bash
vm.swappiness=10
```

Then apply the configuration:

```bash
sudo sysctl -p
```

## Does This Really Increase Memory?

Technically, you're not increasing the actual **RAM** on your instance. You're adding **swap space**, which acts as virtual memory. While this doesn't offer the same performance as real memory (because disk access is slower than RAM), it helps prevent out-of-memory errors by providing extra breathing room. It's useful for processes that may occasionally require more memory than your instance's physical RAM, though you should still monitor performance, as overusing swap can lead to slower performance.

## Conclusion

By creating and configuring swap space on your AWS EC2 instance, you can extend the available memory and reduce the risk of running out of RAM on memory-constrained environments like the free tier. However, keep in mind that this is a temporary solution and is slower than adding actual memory through a larger instance type.
