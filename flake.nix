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
    extra-trusted-public-keys = ["devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=" "search-jerma-fans.cachix.org-1:v2O0Nzk2V1pkPb45g4HH8HhlswNHYrptl6XfGd9nMwI="];
    extra-substituters = ["https://devenv.cachix.org" "https://search-jerma-fans.cachix.org"];
  };

  nixConfig.sandbox = "relaxed";

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
        lib,
        ...
      }: {
        packages.default = pkgs.buildNpmPackage rec {
          pname = "yard-search";
          version = "1.0.0";
          src = ./.;
          npmDepsHash = "sha256-vGsdSN7paacIXTslk9wVodwWrvRgWDqENEalPu+folM=";

          nodejs = pkgs.nodejs_21;

          npmBuildFlags = ["--turbo"];

          __noChroot = true;

          NODE_TLS_REJECT_UNAUTHORIZED = "0";

          NEXT_PUBLIC_MEILISEARCH_URL = "";
          NEXT_PUBLIC_MEILISEARCH_KEY = "";

          installPhase = ''
            mkdir -p $out/bin
            mv $PWD/ $out/out/
            makeWrapper ${pkgs.nodejs}/bin/npm $out/bin/yard-search --chdir "$out/out/" --append-flags "run start"
            chmod +x $out/bin/${pname}
          '';

          meta = with lib; {
            description = "search transcripts of the yard";
            homepage = "https://github.com/mrshmllow/yard-search";
            license = licenses.mit;
            maintainers = with maintainers; [marshmallow];
          };
        };

        devenv.shells.default = {
          name = "yard-search";

          env = {
            NEXT_PUBLIC_MEILISEARCH_URL = "http://127.0.0.1:7700";
            # Development key
            NEXT_PUBLIC_MEILISEARCH_KEY = "HWoz-31otPLUyXZmEfFDWpC3osm3XTW0Ebv3GTj5yrg";
          };

          packages = let
            ingest = pkgs.writeShellScriptBin "ingest" ./scripts/ingest.sh;
            read_data = pkgs.writeShellScriptBin "read_data" ./scripts/read_data.sh;
          in
            with pkgs; [
              openai-whisper
              openai-whisper-cpp
              yt-dlp
              ffmpeg

              nodePackages.typescript-language-server
              jq
              ingest
              read_data
            ];

          services.meilisearch = {
            enable = true;
            environment = "development";
          };
        };
      };
    };
}
