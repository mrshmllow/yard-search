🚧

## Local Development

You must have the nix package manager installed, with flakes enabled.

```bash
git clone https://github.com/mrshmllow/yard-search && cd yard-search
nix develop
```

You may now spin up services locally...

```bash
devenv up
npm run dev
```

### Seeding Data

[whisper-cpp](https://github.com/ggerganov/whisper.cpp) is used in scripts in [scripts/](scripts/). Read them and understand them before running them.
