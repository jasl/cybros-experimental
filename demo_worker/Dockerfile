# syntax=docker/dockerfile:1

FROM denoland/deno:latest

COPY . /opt/worker

USER root
WORKDIR /opt/worker

RUN deno cache --reload main.ts

RUN mkdir -p /data && \
	ln -s /data /opt/worker

EXPOSE 8080
VOLUME ["/data"]

ENTRYPOINT ["/opt/worker/run.sh"]
