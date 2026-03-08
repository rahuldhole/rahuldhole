# Git commands | underrated

## Save token
open git config by `$git config -e` and replace <TOKEN> with your GitHub token
```
[remote "origin"]
        url = https://<TOKEN>@github.com/org/repo.git
        fetch = +refs/heads/*:refs/remotes/origin/*

```
## Rapid fixups using `autosquash`

```
# To update last commit
git commit --amend --no-edit 
```

```
# to update old commit
git commit --fixup=<HashOfCommitWhichNeedsToBeSquashed>
git rebase -i --autosquash <base commit>
```

## Force push changes

```
git push --no-tags --set-upstream origin $(git rev-parse --abbrev-ref HEAD) --force
```

## Copy files from container to host and vice versa
```
docker cp <container_id>:/path/to/container/file/or/directory /path/on/host
docker cp my_container:/app/file.txt /host/path
```
