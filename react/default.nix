{
  buildNpmPackage,
  kapowarr,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr.version;

  src = ./.;

  npmDepsHash = "sha256-9w69/lfCbKflg9leVRPzrlxuHW2b6WN8jouI/7Orwio=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/out $out/share/kapowarr-web

    runHook postInstall
  '';
}
