self: {
  config,
  lib,
  pkgs,
  ...
}: let
  inherit
    (lib)
    getExe
    literalExpression
    mkEnableOption
    mkIf
    mkOption
    optionalString
    types
    ;

  cfg = config.services.kapowarr-react;
in {
  options.services.kapowarr-react = {
    enable = mkEnableOption "kapowarr-react";

    package = mkOption {
      type = types.package;
      default = pkgs.kapowarr-react or self.packages.${pkgs.system}.kapowarr-react;
      defaultText = literalExpression "pkgs.kapowarr-react or kapowarr-react.packages.\${pkgs.system}.kapowarr-react";
      description = ''
        The Kapowarr React package to use.\
        By default, this option will use `kapowarr-react` from your `pkgs` if it finds it,
        or the `packages.kapowarr-react` as exposed by this flake.
      '';
    };

    user = mkOption {
      type = types.str;
      default = "kapowarr-react";
      description = "The user account under which Kapowarr React runs.";
    };

    group = mkOption {
      type = types.str;
      default = "kapowarr-react";
      description = "The group under which Kapowarr React runs.";
    };

    port = mkOption {
      type = types.port;
      default = 5656;
      description = "Port where Kapowarr React should listen for incoming requests.";
    };

    urlBase = mkOption {
      type = with types; nullOr str;
      default = null;
      description = "URL base where Kapowarr React should listen for incoming requests.";
    };

    dataDir = mkOption {
      type = types.path;
      default = "/var/lib/kapowarr-react";
      description = "The directory where Kapowarr React stores its data files.";
    };

    logDir = mkOption {
      type = types.path;
      default = cfg.dataDir;
      defaultText = "/var/lib/kapowarr-react";
      description = "The directory where Kapowarr React stores its log file.";
    };

    openFirewall = mkEnableOption "Open ports in the firewall for Kapowarr React.";
  };

  config = mkIf cfg.enable {
    systemd.services.kapowarr-react = {
      description = "Kapowarr React";
      wantedBy = ["multi-user.target"];
      wants = ["network-online.target"];
      after = ["network-online.target"];

      serviceConfig = {
        Type = "simple";
        User = cfg.user;
        Group = cfg.group;
        StateDirectory = mkIf (cfg.dataDir == "/var/lib/kapowar-react") "kapowarr-react";
        ExecStart = toString [
          (getExe cfg.package)
          "-d ${cfg.dataDir}"
          "-l ${cfg.logDir}"
          "-p ${toString cfg.port}"
          (optionalString (cfg.urlBase != null) "-u ${cfg.urlBase}")
        ];
        # FIXME: not sure why this is needed
        SuccessExitStatus = [0 241];

        # Hardening from komga service
        RemoveIPC = true;
        NoNewPrivileges = true;
        CapabilityBoundingSet = "";
        SystemCallFilter = ["@system-service"];
        ProtectSystem = "full";
        PrivateTmp = true;
        ProtectProc = "invisible";
        ProtectClock = true;
        ProcSubset = "pid";
        PrivateUsers = true;
        PrivateDevices = true;
        ProtectHostname = true;
        ProtectKernelTunables = true;
        RestrictAddressFamilies = [
          "AF_INET"
          "AF_INET6"
          "AF_NETLINK"
        ];
        LockPersonality = true;
        RestrictNamespaces = true;
        ProtectKernelLogs = true;
        ProtectControlGroups = true;
        ProtectKernelModules = true;
        SystemCallArchitectures = "native";
        RestrictSUIDSGID = true;
        RestrictRealtime = true;
      };
    };

    networking.firewall = mkIf cfg.openFirewall {allowedTCPPorts = [cfg.port];};
  };

  _file = ./module.nix;
}
