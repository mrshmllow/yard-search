{
  description = "search transcripts of the yard";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
    nix2container.url = "github:nlewo/nix2container";
    nix2container.inputs.nixpkgs.follows = "nixpkgs";
    mk-shell-bin.url = "github:rrbutani/nix-mk-shell-bin";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.devenv.flakeModule
      ];
      systems = ["x86_64-linux" "i686-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin"];

      perSystem = {
        config,
        self',
        inputs',
        pkgs,
        system,
        ...
      }: {
        devenv.shells.default = {
          name = "yard-search";

          env = {
            NEXT_PUBLIC_MEILISEARCH_URL = "http://127.0.0.1:7700";
            # Development key
            NEXT_PUBLIC_MEILISEARCH_KEY = "HWoz-31otPLUyXZmEfFDWpC3osm3XTW0Ebv3GTj5yrg";
          };

          packages = with pkgs; [
            openai-whisper
            openai-whisper-cpp
            yt-dlp
            ffmpeg

            nodePackages.typescript-language-server
            jq
          ];

          services.meilisearch = {
            enable = true;
            environment = "development";
          };
        };
      };
    };
}
