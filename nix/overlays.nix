self: final: _prev: let
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
  kapowarr-web = final.callPackage "${self}/frontend" {};

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

    pyproject = fromTOML (readFile "${self}/pyproject.toml");

    pname = "kapowarr";
    version = "${pyproject.project.version}+${self.shortRev or "dirty"}";
  in
    python3Packages.buildPythonApplication {
      format = "pyproject";
      inherit pname version;

      src = toString self;

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
          simyan # from overrides
          libgencomics # from overrides
          qbittorrent-api
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
}
