---
title: "tmux status bar toggle"
description: "tmux status bar toggle - Dive into the details of tmux status bar toggle with this quick guide."
image: { src: "https://placehold.co/800x400/0f172a/3b82f6?text=tmux+status+bar+toggle" }
authors: [{'name': 'Rahul Dhole', 'to': '/', 'avatar': {'src': '/profile.jpeg'}}]
date: 2024-04-25
badge: { label: "DX" }
---

To improve the focus of your nested `tmux` you may hide the status bar.

Edit `~/.tmux.conf` and add the following code and restart the tmux
```
# Toggle status bar visibility
bind b run-shell "tmux setw -g status \$(tmux show -g -w status | grep -q off && echo on || echo off)"
```

Now you may use `Prefix+b` by default it should be `ctrl+bb` I did it `b` for bar, you may change it for your convenience.