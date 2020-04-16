FROM python:3.7-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

COPY autoscheduler /app
RUN pip install -r requirements.txt

COPY docker-entrypoint.sh /usr/local/bin
# Needed for GitHub Actions
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
