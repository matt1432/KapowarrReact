FROM python:3.13-slim-bookworm
STOPSIGNAL SIGTERM

RUN apt-get update && apt-get install -y curl gnupg git \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .
RUN pip install .


EXPOSE 5656

CMD [ "/usr/local/bin/kapowarr-react" ]
