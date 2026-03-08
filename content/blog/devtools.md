---
title: "Docker Devtools Stage | Powerlevel, OhMyZSH, tmux, fuzzy finder, autocomplete etc"
description: "Docker Devtools Stage | Powerlevel, OhMyZSH, tmux, fuzzy finder, autocomplete etc - Dive into the details of docker devtools stage | powerlevel, ohmyzsh, tmux, fuzzy finder, autocomplete etc with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=Docker+Devtools+Stage+|+Powerlevel,+OhMyZSH,+tmux,+fuzzy+finder,+autocomplete+etc" }
authors:
  - name: "Rahul Dhole"
    to: "/"
    avatar: { src: "/profile.jpeg" }
date: 2024-04-25
badge: { label: "DX" }
pinned: true
---

## Introduction

Developers rely on a plethora of tools and configurations to streamline their workflow, but setting up these essentials consistently across different Docker images can be a daunting task. From fuzzy finders to terminal themes, ensuring a seamless and productive environment often involves repetitive manual configurations. In this post, we'll explore a solution that revolutionizes this process and have your favorite developer setup always ready merge in with any docker container.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x15mpzl6xmsn0t6tts6y.PNG)

## Problem

Picture this: you're diving into a new project, spinning up a Docker image, only to find yourself missing critical developer tools like tmux, htop, or even a personalized terminal theme. Not only does this hinder productivity, but it also detracts from the overall developer experience, leaving you feeling disconnected from your familiar setup.

## Introducing the Docker Devtools Volume
My solution? Create a Docker devtools volume once and reuse the same configuration across any Docker image. By encapsulating essential developer tools, terminal configurations, and themes within a single volume, developers can instantly feel at home in any environment, allowing them to focus on what matters most: writing code.

Following is a Dockerfile which has devtools stage which can be used in your workflow:
[Download Dockerfile.devtools](https://gist.githubusercontent.com/rahuldhole/901850571fef2f9ba07e3501f9ede81e/raw/27bae795e7ae2e085e8d8c6112d95305ce9a7bd9/Dockerfile.devtools)

{% embed https://gist.github.com/rahuldhole/901850571fef2f9ba07e3501f9ede81e %}

## Implementation Guide
Let's dive into the implementation steps:

1. Setup Prerequisites: Ensure you have the required nerd fonts installed and set as your terminal font.

#### Following is script to install nerd fonts on debian based distro. 
```sh
sh -c '\
    wget -P ~/Downloads \
    https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf && \
    wget -P ~/Downloads \
    https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf && \
    wget -P ~/Downloads \
    https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf && \
    wget -P ~/Downloads \
    https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf && \
    mkdir -p ~/.local/share/fonts/ && \
    mv ~/Downloads/*.ttf ~/.local/share/fonts/ && \
    fc-cache -f -v
'
```

#### For windows
You can simply download the font and double-click install. Go to settings and set it as the default terminal font.

[Download MesloLGS NF Regular.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf)

[Download MesloLGS NF Bold.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf)

[Download MesloLGS NF Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf)

[Download MesloLGS NF Bold Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf)


2. Create the Devtools Volume: At the time of running the container mount devtools user home directory as a docker volume to save the devtools config.

Example:
```sh
## Build once
docker build -f Dockerfile.devtools --target devtools -t debian:devtools .

docker run --rm -it -v debian-devtools:/home/<USERNAME> debian:devtools

## Reuse the volume and add devootls Dockerfile stage in your dockerfile before development or test stage
docker run --rm -it -v debian-devtools:/home/<USERNAME> node:development
docker run --rm -it -v debian-devtools:/home/<USERNAME> ubuntu:test
```



You may customize your configuration, tailor your ~/.zshrc, ~/.tmux.conf, and ~/.p10k.conf files to suit your preferences. Don't forget to run p10k configure to fine-tune your Powerline UI.

Enjoy seamless development with your Docker devtools volume in place, every Docker image becomes an extension of your personalized development environment. Say goodbye to repetitive setups and hello to enhanced productivity!

## Conclusion
In conclusion, the Docker Devtools Volume offers an amazing solution for developers seeking consistency and productivity in their Docker-based workflows. By centralizing essential tools and configurations, developers can focus on what they do best: building amazing software. Try out our solution today and experience the difference firsthand.

Let me know in the comments below if you want the same for Alpine-based images.

Ready to elevate your development experience? Dive deeper into Docker devtools volumes and explore more insightful content on our blog.

Happy coding!