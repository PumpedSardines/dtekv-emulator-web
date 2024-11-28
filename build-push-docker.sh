VERSION=$(cat package.json | jq -r '.version')

docker build --platform=linux/amd64 -t dtekv-emulator-web .
docker tag dtekv-emulator-web "pumpedsardines/dtekv-emulator-web:$VERSION"
docker tag dtekv-emulator-web "pumpedsardines/dtekv-emulator-web:latest"
docker push "pumpedsardines/dtekv-emulator-web:$VERSION"
docker push "pumpedsardines/dtekv-emulator-web:latest"
