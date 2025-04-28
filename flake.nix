{
  inputs = {
    nixpkgs = {
      type = "github";
      owner = "NixOS";
      repo = "nixpkgs";
      ref = "nixos-unstable";
    };

    systems = {
      type = "github";
      owner = "nix-systems";
      repo = "default-linux";
    };
  };

  outputs = {
    self,
    systems,
    nixpkgs,
    ...
  }: let
    perSystem = attrs:
      nixpkgs.lib.genAttrs (import systems) (system:
        attrs (import nixpkgs {
          inherit system;
          overlays = [self.overlays.default];
          config.allowUnfreePredicate = pkg: builtins.elem pkg.pname ["rar"];
        }));
  in {
    overlays.default = final: prev: let
      pyPkgs = final.python3Packages.override {
        overrides = pyFinal: pyPrev: {
          bencoding = pyFinal.callPackage ({
            # nix build inputs
            buildPythonPackage,
            fetchPypi,
            ...
          }: let
            pname = "bencoding";
            version = "0.2.6";
          in
            buildPythonPackage {
              inherit pname version;

              src = fetchPypi {
                inherit pname version;
                hash = "sha256-Q8zjHUhj4p1rxhFVHU6fJlK+KZXp1eFbRtg4PxgNREA=";
              };
            }) {};

          typing-extensions = pyFinal.callPackage ({
            # nix build inputs
            buildPythonPackage,
            fetchPypi,
            # deps
            flit-core,
            ...
          }: let
            pname = "typing_extensions";
            version = "4.12.2";
          in
            buildPythonPackage {
              inherit pname version;
              format = "pyproject";

              build-system = [flit-core];
              dependencies = [flit-core];

              src = fetchPypi {
                inherit pname version;
                hash = "sha256-Gn6tVcflWd1N7ohW46iLQSJav+HOjfV7fBORX+Eh/7g=";
              };
            }) {};
        };
      };
    in {
      kapowarr = pyPkgs.callPackage ({
        # nix build inputs
        lib,
        stdenv,
        python,
        makeWrapper,
        # deps
        rar,
        # python deps
        aiohttp,
        beautifulsoup4,
        bencoding, # from overrides
        cryptography,
        flask,
        flask-socketio,
        requests,
        typing-extensions, # from overrides
        waitress,
        websocket-client,
        ...
      }: let
        inherit (lib) getExe;
        inherit (builtins) fromTOML readFile;

        pyproject = fromTOML (readFile ./pyproject.toml);

        dependencies = [
          typing-extensions
          requests
          beautifulsoup4
          flask
          waitress
          cryptography
          bencoding
          aiohttp
          flask-socketio
          websocket-client
        ];

        pythonInterpreter = python.withPackages (ps: dependencies);

        pname = "kapowarr";
        version = "${pyproject.project.version}+${self.shortRev or "dirty"}";
      in
        stdenv.mkDerivation {
          inherit pname version;

          src = ./.;

          nativeBuildInputs = [makeWrapper];

          postPatch = ''
            # Remove shebang
            sed -i 1d ./Kapowarr.py

            # Disable PWA for now
            substituteInPlace ./backend/internals/settings.py \
                --replace-fail "with open(filename, 'w') as f:" "" \
                --replace-fail "dump(manifest, f, indent=4)" ""

            # TODO: makes sure this works
            substituteInPlace ./backend/implementations/converters.py \
                --replace-fail \
                    "exe = folder_path('backend', 'lib', Constants.RAR_EXECUTABLES[platform])" \
                    "exe = '${getExe rar}'"
          '';

          buildPhase = ''
            mkdir -p $out/${python.sitePackages}
            cp -r ./. $out/${python.sitePackages}
          '';

          installPhase = ''
            makeWrapper ${getExe pythonInterpreter} $out/bin/kapowarr \
                --add-flags "$out/${python.sitePackages}/Kapowarr.py"
          '';

          passthru = {
            inherit pythonInterpreter;
          };

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
        }) {};
    };

    packages = perSystem (pkgs: {
      kapowarr = pkgs.kapowarr;
      default = self.packages.${pkgs.system}.kapowarr;
    });

    formatter = perSystem (pkgs: pkgs.alejandra);

    devShells = perSystem (pkgs: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          alejandra
          pkgs.kapowarr.pythonInterpreter
        ];
      };
    });
  };
}
