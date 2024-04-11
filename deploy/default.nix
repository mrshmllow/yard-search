{
  withSystem,
  inputs,
  lib,
  ...
}: {
  flake.nixosConfigurations.search-jerma-fans = withSystem "aarch64-linux" (ctx @ {
    config,
    inputs',
    ...
  }:
    inputs.nixpkgs.lib.nixosSystem {
      # Expose `packages`, `inputs` and `inputs'` as module arguments.
      # Use specialArgs permits use in `imports`.
      # Note: if you publish modules for reuse, do not rely on specialArgs, but
      # on the flake scope instead. See also https://flake.parts/define-module-in-separate-file.html
      specialArgs = {
        packages = config.packages;
        inherit inputs inputs';
      };
      modules = [
        ({
          config,
          lib,
          packages,
          pkgs,
          ...
        }: {
          imports = [./hetzner.nix ./yard-search-module.nix];

          services.yard-search = {
            enable = true;
            package = packages.yard-search;
            hostname = "search.jerma.fans";
            meilisearchHostname = "meilisearch.jerma.fans";
          };

          nix.settings = {
            experimental-features = ["nix-command" "flakes"];
            auto-optimise-store = true;
            sandbox = "relaxed";
          };

          nix.gc = {
            automatic = true;
            dates = "weekly";
            options = "--delete-older-than 30d";
          };
        })
      ];
    });
}
