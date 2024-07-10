1. install cli

```bash
npm i -g @vscode/vsce
```

1. log in to azure devops
   https://drknoxy.visualstudio.com/

1. generate one time token

1. log in

```bash
vsce login drknoxy
```

1. publish
   Make sure the package.json is up to date

```bash
vsce publish
```

Takes a few minutes to update
