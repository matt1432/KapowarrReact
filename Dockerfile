FROM python:3.13-slim-bookworm
STOPSIGNAL SIGTERM

WORKDIR /app

COPY . .
RUN pip install .
RUN pip install kapowarr


EXPOSE 5656

CMD [ "/usr/local/bin/kapowarr" ]
