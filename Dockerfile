FROM rust:1.82 AS wasm_builder

COPY ./wasm ./

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

RUN wasm-pack build

# Run the binary
CMD ["./target/release/holodeck"]

FROM node:20 AS node_builder

COPY ./src ./src
COPY ./index.html ./
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./public ./public
COPY ./tsconfig.json ./
COPY ./tsconfig.app.json ./
COPY ./tsconfig.node.json ./
COPY ./vite.config.ts ./

RUN mkdir /wasm
COPY --from=wasm_builder /pkg /wasm/pkg

RUN npm ci
RUN npm run build

FROM nginx:alpine

COPY --from=wasm_builder /pkg /dist

COPY --from=node_builder /dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/
