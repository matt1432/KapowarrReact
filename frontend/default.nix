{
  lib,
  buildNpmPackage,
  kapowarr-react,
  # options
  enableReactProfiler ? false,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  inherit (kapowarr-react) version;

  src = ./.;

  npmDepsHash = "sha256-jS0aDJJtZG/chKq+hzHYnt6jnwey9FQWoELegiu0s7c=";

  env.PROFILER = lib.boolToString enableReactProfiler;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
