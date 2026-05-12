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

  npmDepsHash = "sha256-afKDQcUamgwoTZg4oDJK6ZrgsCTMUxlP6KzscKYObE0=";

  env.PROFILER = lib.boolToString enableReactProfiler;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
