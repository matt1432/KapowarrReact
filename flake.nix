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
    overlays.default = final: _prev: let
      pyPkgs = final.python3Packages.override (o: {
        overrides = pyFinal: pyPrev:
          (o.overrides pyFinal pyPrev)
          // {
            bencoding = pyFinal.callPackage ({
              # nix build inputs
              buildPythonPackage,
              fetchPypi,
              # python deps
              setuptools,
              ...
            }: let
              pname = "bencoding";
              version = "0.2.6";
            in
              buildPythonPackage {
                inherit pname version;

                pyproject = true;
                build-system = [setuptools];

                src = fetchPypi {
                  inherit pname version;
                  hash = "sha256-Q8zjHUhj4p1rxhFVHU6fJlK+KZXp1eFbRtg4PxgNREA=";
                };
              }) {};
          };
      });
    in {
      kapowarr-web = final.callPackage ./react {};

      kapowarr = final.callPackage ({
        # nix build inputs
        lib,
        python3Packages,
        # deps
        kapowarr-web,
        rar,
        ...
      }: let
        inherit (lib) attrValues makeBinPath;
        inherit (builtins) fromTOML readFile;

        pyproject = fromTOML (readFile ./pyproject.toml);

        pname = "kapowarr";
        version = "${pyproject.project.version}+${self.shortRev or "dirty"}";
      in
        python3Packages.buildPythonApplication {
          format = "pyproject";
          inherit pname version;

          src = ./.;

          build-system = attrValues {
            inherit (python3Packages) setuptools;
          };

          dependencies = attrValues {
            inherit
              (python3Packages)
              requests
              beautifulsoup4
              flask
              waitress
              cryptography
              bencoding # from overrides
              aiohttp
              flask-socketio
              websocket-client
              libgencomics # from overrides
              qbittorrent-api
              grequests
              ;
          };

          env.KAPOWARR_WEB = "${kapowarr-web}/share/kapowarr-web";

          preFixup = ''
            makeWrapperArgs+=(
                --prefix PATH : ${makeBinPath [rar]}
            )
          '';

          meta = {
            inherit (rar.meta) platforms;
            mainProgram = pname;
            license = lib.licenses.gpl3Only;
            homepage = "https://casvt.github.io/Kapowarr";
            description = ''
              Kapowarr is a software to build and manage a comic book library,
              fitting in the *arr suite of software.
            '';
          };
        }) {python3Packages = pyPkgs;};
    };

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
