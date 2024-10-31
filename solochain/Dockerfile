# syntax=docker/dockerfile:1

FROM docker.io/paritytech/ci-unified:latest AS builder

COPY . /runner

WORKDIR /runner

RUN cargo fetch
RUN cargo build --locked --profile production

FROM docker.io/parity/base-bin:latest

COPY --from=builder /runner/target/production/cybros-solochain-node /usr/local/bin

USER root

RUN mkdir -p /data /root/.local/share && \
	ln -s /data /root/.local/share/cybros-solochain-node && \
# unclutter and minimize the attack surface
	rm -rf /usr/bin /usr/sbin && \
# check if executable works in this container
	/usr/local/bin/cybros-solochain-node --version

EXPOSE 30333 9944 9615
VOLUME ["/data"]

ENTRYPOINT ["/usr/local/bin/cybros-solochain-node"]
