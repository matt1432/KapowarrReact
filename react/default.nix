{
  buildNpmPackage,
  kapowarr,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr.version;

  src = ./.;

  npmDepsHash = "sha256-Oi8/IALCBAEdt7Db21XHAbikX947Zq1DhpMZFccN/mU=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/out $out/share/kapowarr-web

    runHook postInstall
  '';
}
