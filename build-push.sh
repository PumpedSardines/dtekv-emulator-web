rm -rf dist

cd wasm
wasm-pack build
cd ..
npm run build

npx wrangler pages deploy --project-name dtekv dist
