_pyEnv: {
  lib,
  pkgs,
  ...
}: let
  inherit (lib) getExe;
  pyEnv = _pyEnv pkgs;
in {
  projectRootFile = "flake.lock";

  settings.formatter = {
    "basedpyright" = {
      command = "${(pkgs.runCommand "pyright" {nativeBuildInputs = [pkgs.makeWrapper];} ''
        makeWrapper ${getExe pkgs.basedpyright} $out/bin/pyright \
          --set PYTHONPATH ${pyEnv}/${pyEnv.sitePackages}
      '')}/bin/pyright";
      includes = ["*.py"];
    };
  };

  programs.ruff.format = true;
  programs.ruff.check = true;

  programs.toml-sort.enable = true;
  programs.yamlfmt.enable = true;

  programs.alejandra.enable = true;
  programs.deadnix.enable = true;
}
