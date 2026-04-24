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

  npmDepsHash = "sha256-4i7m9j76cFe93DH3gYtlZddX59asWpHMLtBdi3ZJy9E=";

  env.PROFILER = lib.boolToString enableReactProfiler;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
