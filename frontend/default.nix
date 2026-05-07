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

  npmDepsHash = "sha256-VyU7zkfN4KleVOjRIoAUY9yf+RV1oMk+OpEiLq9Lsco=";

  env.PROFILER = lib.boolToString enableReactProfiler;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
