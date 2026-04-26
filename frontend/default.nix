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

  npmDepsHash = "sha256-FxtIA2YDF9yLN+LuCle5kbgYWJ+EFfNKxsWGDCrqJTk=";

  env.PROFILER = lib.boolToString enableReactProfiler;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
