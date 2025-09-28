{
  buildNpmPackage,
  kapowarr-react,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr-react.version;

  src = ./.;

  npmDepsHash = "sha256-XvUTWVxAFLFQ/fpPYtrg0oZWtX1qlTawvYE78fArJEo=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
