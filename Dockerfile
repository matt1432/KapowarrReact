FROM python:3.13-slim-bookworm
STOPSIGNAL SIGTERM

RUN apt-get update && apt-get install -y curl gnupg git \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp

COPY . .
RUN pip install .

RUN useradd -d /app --create-home kapowarr
RUN mkdir -p /app/db /app/logs /app/temp_downloads
RUN chown kapowarr /app/db /app/logs /app/temp_downloads

WORKDIR /app

USER kapowarr


EXPOSE 5656

CMD [ "/usr/local/bin/kapowarr-react", "--DatabaseFolder", "/app/db", "--LogFolder", "/app/logs", "-t", "/app/temp_downloads" ]
