# tmux status bar toggle

To improve the focus of your nested `tmux` you may hide the status bar.

Edit `~/.tmux.conf` and add the following code and restart the tmux
```
# Toggle status bar visibility
bind b run-shell "tmux setw -g status \$(tmux show -g -w status | grep -q off && echo on || echo off)"
```

Now you may use `Prefix+b` by default it should be `ctrl+bb` I did it `b` for bar, you may change it for your convenience.