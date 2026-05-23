{
  inputs = {
    nixpkgs = {
      type = "git";
      url = "https://github.com/NixOS/nixpkgs";
      ref = "nixos-unstable";
      shallow = true;
    };

    treefmt-nix = {
      type = "github";
      owner = "numtide";
      repo = "treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    systems = {
      type = "github";
      owner = "nix-systems";
      repo = "default-linux";
    };

    libgencomics = {
      type = "github";
      owner = "matt1432";
      repo = "LibgenComics";

      inputs = {
        nixpkgs.follows = "nixpkgs";
        treefmt-nix.follows = "treefmt-nix";
        systems.follows = "systems";
      };
    };
  };

  outputs = {
    self,
    systems,
    nixpkgs,
    treefmt-nix,
    libgencomics,
    ...
  }: let
    inherit (builtins) elem attrValues;
    inherit (nixpkgs) lib;

    perSystem = attrs:
      lib.genAttrs (import systems) (system:
        attrs (import nixpkgs {
          inherit system;
          overlays = [self.overlays.default];
          config.allowUnfreePredicate = pkg: elem pkg.pname ["rar"];
        }));

    pyEnv = pkgs:
      pkgs.python3.withPackages (_: pkgs.kapowarr-react.dependencies);
  in {
    nixosModules = {
      kapowarr-react = import ./nix/module.nix self;
      default = self.nixosModules.kapowarr-react;
    };

    overlays.default = lib.composeManyExtensions [
      libgencomics.overlays.default
      (import ./nix/overlays.nix self)
    ];

    packages = perSystem (pkgs: {
      inherit (pkgs) kapowarr-web kapowarr-react;
      default = pkgs.kapowarr-react;
    });

    formatter = perSystem (pkgs: let
      treefmtEval = treefmt-nix.lib.evalModule pkgs (import ./treefmt.nix pyEnv);
    in
      treefmtEval.config.build.wrapper);

    devShells = perSystem (pkgs: {
      default = pkgs.mkShell {
        packages = [
          (pyEnv pkgs)
          (pkgs.writeScriptBin "runTests" ''exec python -m pytest tests/'')
        ];
      };

      frontend = pkgs.mkShell {
        packages = [
          pkgs.nodejs_latest
          pkgs.typescript

          (pkgs.writeShellApplication {
            name = "bumpNpmDeps";
            runtimeInputs = attrValues {
              inherit
                (pkgs)
                prefetch-npm-deps
                nodejs_latest
                ;
            };
            text = ''
              # this command might fail but still updates the main lockfile
              npm update --package-lock-only --legacy-peer-deps || true

              hash="$(prefetch-npm-deps ./package-lock.json)"
              echo "$hash"

              if [[ -f ./default.nix ]]; then
                  sed -i "s#npmDepsHash = .*#npmDepsHash = \"$hash\";#" ./default.nix
              fi
            '';
          })
        ];
      };
    });
  };
}
