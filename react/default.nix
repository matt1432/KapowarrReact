{
  buildNpmPackage,
  kapowarr,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr.version;

  src = ./.;

  npmDepsHash = "sha256-8AD7CeKx6Ks5fOQu4SlyDNtP7ISeQUDjoiUnq8Fo0nQ=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
