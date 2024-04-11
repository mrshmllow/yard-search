{
  modulesPath,
  lib,
  config,
  pkgs,
  ...
}: {
  nixpkgs.hostPlatform = "aarch64-linux";

  boot.tmp.cleanOnBoot = true;
  zramSwap.enable = true;
  networking.hostName = "search";
  networking.domain = "jerma.fans";
  services.openssh.enable = true;
  users.users.root.openssh.authorizedKeys.keys = [''ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE40+tAK8OFbutIMuGnbupORFJTtrW0weV6ke7rkvhCx''];
  system.stateVersion = "23.11";

  imports = [(modulesPath + "/profiles/qemu-guest.nix")];
  boot.loader.grub = {
    efiSupport = true;
    efiInstallAsRemovable = true;
    device = "nodev";
  };
  fileSystems."/boot" = {
    device = "/dev/disk/by-uuid/D951-0FE6";
    fsType = "vfat";
  };
  boot.initrd.availableKernelModules = ["ata_piix" "uhci_hcd" "xen_blkfront"];
  boot.initrd.kernelModules = ["nvme"];
  fileSystems."/" = {
    device = "/dev/sda1";
    fsType = "ext4";
  };

  services.tailscale = {
    enable = true;
    extraUpFlags = ["--ssh"];
  };

  networking = {
    nameservers = [
      "8.8.8.8"
    ];
    defaultGateway = "172.31.1.1";
    defaultGateway6 = {
      address = "fe80::1";
      interface = "eth0";
    };
    dhcpcd.enable = false;
    usePredictableInterfaceNames = lib.mkForce false;
    interfaces = {
      eth0 = {
        ipv4.addresses = [
          {
            address = "128.140.33.45";
            prefixLength = 32;
          }
        ];
        ipv6.addresses = [
          {
            address = "2a01:4f8:1c1b:c1f0::1";
            prefixLength = 64;
          }
          {
            address = "fe80::9400:3ff:fe32:bd3";
            prefixLength = 64;
          }
        ];
        ipv4.routes = [
          {
            address = "172.31.1.1";
            prefixLength = 32;
          }
        ];
        ipv6.routes = [
          {
            address = "fe80::1";
            prefixLength = 128;
          }
        ];
      };
    };
  };
  services.udev.extraRules = ''
    ATTR{address}=="96:00:03:32:0b:d3", NAME="eth0"
  '';
}
