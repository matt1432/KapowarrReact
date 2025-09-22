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
    perSystem = attrs:
      nixpkgs.lib.genAttrs (import systems) (system:
        attrs (import nixpkgs {
          inherit system;
          overlays = [
            libgencomics.overlays.default
            self.overlays.default
          ];
          config.allowUnfreePredicate = pkg: builtins.elem pkg.pname ["rar"];
        }));

    pyEnv = pkgs:
      pkgs.python3.withPackages (_: pkgs.kapowarr.dependencies);
  in {
    nixosModules = import ./nix/module.nix;

    overlays.default = import ./nix/overlays.nix self;

    packages = perSystem (pkgs: {
      inherit (pkgs) kapowarr-web kapowarr;
      default = pkgs.kapowarr;
    });

    formatter = perSystem (pkgs: let
      treefmtEval = treefmt-nix.lib.evalModule pkgs (import ./treefmt.nix pyEnv);
    in
      treefmtEval.config.build.wrapper);

    devShells = perSystem (pkgs: {
      default = pkgs.mkShell {
        packages = [(pyEnv pkgs)];
      };
    });
  };
}
