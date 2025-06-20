{
  buildNpmPackage,
  kapowarr,
  ...
}:
buildNpmPackage {
  pname = "kapowarr-web";
  version = kapowarr.version;

  src = ./.;

  npmDepsHash = "sha256-48KkCatuyrPzYIdBRZ9o9kj199tjRxsbwTxhO4VUDE0=";

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -a dist/out $out/share/kapowarr-web

    runHook postInstall
  '';
}
