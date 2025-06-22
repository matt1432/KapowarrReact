{
  buildNpmPackage,
  kapowarr,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr.version;

  src = ./.;

  npmDepsHash = "sha256-6wU9aE27zosXD+8g5TmkhO+iD9OwIPzaJ0r9VrVKZKI=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/out $out/share/kapowarr-web

    runHook postInstall
  '';
}
