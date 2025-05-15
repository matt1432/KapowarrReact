{pkgs, ...}: {
  projectRootFile = "flake.lock";

  programs.mypy = {
    enable = true;
    directories."src" = {
      modules = [
        "backend"
        "frontend"
        "kapowarr"
      ];
      options = ["--explicit-package-bases"];
      extraPythonPackages = with pkgs; (kapowarr.dependencies
        ++ (with python3Packages; [
          types-beautifulsoup4
          types-requests
        ]));
    };
  };

  programs.ruff.format = true;
  programs.ruff.check = true;

  programs.toml-sort.enable = true;
  programs.yamlfmt.enable = true;

  programs.alejandra.enable = true;
  programs.deadnix.enable = true;
}
