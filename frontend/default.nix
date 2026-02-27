{
  buildNpmPackage,
  kapowarr-react,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr-react.version;

  src = ./.;

  npmDepsHash = "sha256-BA+d7paEQep1EUrsJGvb2sqkJSV+cVMMQYEoJ73E2RQ=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/static $out/share/kapowarr-web

    runHook postInstall
  '';
}
