{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    nixpkgsUnstable.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flakeUtils.url = "github:numtide/flake-utils";
  };
  outputs = {
    self,
    nixpkgs,
    nixpkgsUnstable,
    flakeUtils,
  }:
    flakeUtils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};
        pkgsUnstable = nixpkgsUnstable.legacyPackages.${system};
      in {
        packages = flakeUtils.lib.flattenTree {
          cargo = pkgs.cargo;
          rust-analyzer = pkgs.rust-analyzer;
          rustfmt = pkgs.rustfmt;
          clippy = pkgs.clippy;
          rustc = pkgs.rustc;
          lld = pkgs.lld;
          wasm-pack = pkgs.wasm-pack;
          binaryen = pkgs.binaryen;
          cargo-generate = pkgs.cargo-generate;
        };
        devShell = pkgs.mkShell {
          buildInputs = with self.packages.${system}; [
            wasm-pack
            cargo
            rust-analyzer
            rustfmt
            clippy
            rustc
            lld
            binaryen
            cargo-generate
          ];
        };
      }
    );
}
