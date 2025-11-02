{
  buildNpmPackage,
  kapowarr-react,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr-react.version;

  src = ./.;

  npmDepsHash = "sha256-gZSXwk2VdmzlSsjkWMXnsGkSG2zYKjRIoZ7RzvZ00EE=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
