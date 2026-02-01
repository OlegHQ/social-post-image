# Linux deploy (systemd user service)

## Prereqs

- Node.js >= 18 installed system-wide (so `/usr/bin/node` exists)
- `systemd --user` enabled for your login

## Deploy

1) On the VM, clone/update this repo.
2) Run:

```bash
make deploy
```

3) Edit env:

```bash
${EDITOR:-vi} ~/.config/swiss-content-generator/env
systemctl --user restart swiss-content-generator.service
```

## Logs

```bash
make logs
```
