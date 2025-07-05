{
  buildNpmPackage,
  kapowarr,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr.version;

  src = ./.;

  npmDepsHash = "sha256-M8DKijqDu0MDe1I1W2S/TorQuO41OkueXim1injuzb4=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
