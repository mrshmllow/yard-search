{
  moduleWithSystem,
  inputs,
  lib,
  ...
}: {
  flake.nixosModules.default = moduleWithSystem (
    perSystem @ {config}: nixos @ {...}: let
      cfg = config.services.yard-search;
    in {
      options = {
        services.yard-search = {
          enable = lib.mkEnableOption (lib.mdDoc "yard-search - search transcripts of the yard");

          package = lib.mkOption {
            defaultText = lib.literalMD "`packages.default` from the yard-search flake";
          };

          hostname = lib.mkOption {
            defaultText = lib.literalMD "yard-search hostname";
          };

          meilisearchHostname = lib.mkOption {
            defaultText = lib.literalMD "meilisearch hostname";
          };

          masterKeyEnvironmentFile = lib.mkOption {
            defaultText = lib.literalMD "path of file containing MEILI_MASTER_KEY=...";
          };
        };
      };

      config.systemd.services.yard-search = lib.mkIf cfg.enable {
        wantedBy = ["multi-user.target"];
        after = ["network.target"];
        description = "yard-search web server";
        environment = {
          NEXT_PUBLIC_MEILISEARCH_URL = "http://${cfg.meilisearchHostname}";
          NEXT_PUBLIC_MEILISEARCH_KEY = "hellothisisakey";
        };
        serviceConfig = {
          Type = "simple";
          DynamicUser = true;
          ExecStart = lib.getExe cfg.package;
          SyslogLevel = "debug";
        };
      };

      config.services.meilisearch = lib.mkIf cfg.enable {
        enable = true;
        environment = "production";
        masterKeyEnvironmentFile = cfg.masterKeyEnvironmentFile;
      };
    }
  );
}
