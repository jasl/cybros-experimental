# syntax=docker/dockerfile:1
# check=skip=FromPlatformFlagConstDisallowed

FROM --platform=linux/amd64 docker.io/paritytech/ci-unified:latest AS builder

COPY . /runner

WORKDIR /runner

RUN cargo fetch
RUN cargo build --locked --release

FROM --platform=linux/amd64 docker.io/parity/base-bin:latest

COPY --from=builder /runner/target/release/cybros-solochain-node /usr/local/bin

USER root
RUN useradd -m -u 1001 -U -s /bin/sh -d /runner runner && \
	mkdir -p /data /runner/.local/share && \
	chown -R runner:runner /data && \
	ln -s /data /runner/.local/share/runner && \
# unclutter and minimize the attack surface
	rm -rf /usr/bin /usr/sbin && \
# check if executable works in this container
	/usr/local/bin/cybros-solochain-node --version

USER runner

EXPOSE 30333 9944 9615
VOLUME ["/data"]

ENTRYPOINT ["/usr/local/bin/cybros-solochain-node"]
