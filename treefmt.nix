{pkgs, ...}: let
  buildTypeStubs = {
    name,
    version,
    src,
    dependencies ? [],
    pythonImportsCheck ? ["${name}-stubs"],
    ...
  }: (pkgs.python3Packages.callPackage ({
    lib,
    buildPythonPackage,
    setuptools,
    ...
  }:
    buildPythonPackage {
      pname = "types-${name}";
      pyproject = true;
      inherit dependencies pythonImportsCheck src version;

      build-system = [setuptools];

      # Module doesn't have tests
      doCheck = false;

      meta = with lib; {
        description = "Typing stubs for ${name}";
        homepage = "https://github.com/python/typeshed";
        license = licenses.asl20;
      };
    }) {});
in {
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
        ])
        ++ [
          (buildTypeStubs {
            name = "waitress";
            version = "3.0.1.20241117";
            src = pkgs.fetchurl {
              url = "https://files.pythonhosted.org/packages/34/d4/af78f0ae18ca02830e0a45d410b6f4eda0dfa5b82861c9d7900d1baceb31/types-waitress-3.0.1.20241117.tar.gz";
              hash = "sha256-HfCPjeNsww3a3heeHLKMWXduiaGih0iTtZ/i6gCoI6A=";
            };
          })
          (buildTypeStubs {
            name = "Flask-SocketIO";
            version = "5.5.0.20250516";
            src = pkgs.fetchurl {
              url = "https://files.pythonhosted.org/packages/9f/1d/26a65886baf3ec8f52b1eae1780fdfe4d761ca3b77f5abc76978660ebe32/types_flask_socketio-5.5.0.20250516.tar.gz";
              hash = "sha256-8cW7zBitDXleWq1I7kSqkLvXIqxEvAMHV+0IrEcbnls=";
            };
            dependencies = with pkgs.python3Packages; [flask];
            pythonImportsCheck = [];
          })
        ]);
    };
  };

  programs.ruff.format = true;
  programs.ruff.check = true;

  programs.toml-sort.enable = true;
  programs.yamlfmt.enable = true;

  programs.alejandra.enable = true;
  programs.deadnix.enable = true;
}
