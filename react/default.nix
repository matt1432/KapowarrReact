{
  buildNpmPackage,
  kapowarr,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr.version;

  src = ./.;

  npmDepsHash = "sha256-mUwCSCixwjpKPQBE+dH3+yAGa0aej7hj9C1QPVhyST4=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/out $out/share/kapowarr-web

    runHook postInstall
  '';
}
