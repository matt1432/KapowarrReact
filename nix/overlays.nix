self: final: _prev: let
  bencoding = final.callPackage ({
    python3Packages,
    fetchPypi,
    ...
  }: let
    pname = "bencoding";
    version = "0.2.6";
  in
    python3Packages.buildPythonPackage {
      inherit pname version;

      pyproject = true;
      build-system = with python3Packages; [setuptools];

      src = fetchPypi {
        inherit pname version;
        hash = "sha256-Q8zjHUhj4p1rxhFVHU6fJlK+KZXp1eFbRtg4PxgNREA=";
      };
    }) {};
in {
  kapowarr-web = final.callPackage "${self}/frontend" {};

  kapowarr-react = final.callPackage ({
    # nix build inputs
    lib,
    python3Packages,
    # deps
    kapowarr-web,
    rar,
    # libgencomics deps
    simyan,
    libgencomics,
    # options
    enableReactProfiler ? false,
    ...
  }: let
    inherit (lib) attrValues makeBinPath;
    inherit (builtins) readFile;

    pyproject = fromTOML (readFile "${self}/pyproject.toml");

    pname = "kapowarr-react";
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
          bencoding
          simyan # from overrides
          libgencomics # from overrides
          ;

        inherit
          (python3Packages)
          requests
          beautifulsoup4
          flask
          waitress
          cryptography
          aiohttp
          flask-socketio
          websocket-client
          qbittorrent-api
          pillow
          pytest
          ;
      };

      env.KAPOWARR_WEB = "${kapowarr-web.override {inherit enableReactProfiler;}}/share/kapowarr-web";

      preFixup = ''
        makeWrapperArgs+=(
            --prefix PATH : ${makeBinPath [rar]}
        )
      '';

      meta = {
        inherit (rar.meta) platforms;
        mainProgram = pname;
        license = lib.licenses.gpl3Only;
        homepage = "https://github.com/matt1432/KapowarrReact";
        description = ''
          Kapowarr React is a software to build and manage a comic book library,
          fitting in the *arr suite of software.
        '';
      };
    }) {};
}
