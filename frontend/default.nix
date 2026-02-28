{
  buildNpmPackage,
  kapowarr-react,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr-react.version;

  src = ./.;

  npmDepsHash = "sha256-Fjy53AQ7rlAdbOpoCZrhUh3NPBVsqJQMQilt8GHKBR0=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
