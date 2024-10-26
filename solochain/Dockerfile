FROM docker.io/paritytech/ci-unified:latest as builder

WORKDIR /runner
COPY . /runner

RUN cargo fetch
RUN cargo build --locked --release

FROM docker.io/parity/base-bin:latest

COPY --from=builder /runner/target/release/cybros-solochain-node /usr/local/bin

USER root
RUN useradd -m -u 1001 -U -s /bin/sh -d /polkadot polkadot && \
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
