{
  lib,
  config,
  pkgs,
  ...
}: let
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
    };
  };

  config = lib.mkIf cfg.enable {
    services.meilisearch.enable = true;
    services.meilisearch.environment = "production";
    services.meilisearch.masterKeyEnvironmentFile = "/etc/meilikey";

    environment.etc = {
      meilikey.text = "MEILI_MASTER_KEY=${builtins.getEnv "MEILI_MASTER_KEY"}";
    };

    systemd.services.yard-search = {
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

    services.caddy = {
      enable = true;
      virtualHosts."http://${cfg.hostname}".extraConfig = ''
        reverse_proxy http://127.0.0.1:3000
      '';
      virtualHosts."http://${cfg.meilisearchHostname}".extraConfig = ''
        reverse_proxy http://${config.services.meilisearch.listenAddress}:${toString config.services.meilisearch.listenPort}
      '';
    };

    networking.firewall.allowedTCPPorts = [80 443];
  };
}
