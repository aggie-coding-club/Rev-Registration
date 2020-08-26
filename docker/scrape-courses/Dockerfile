FROM python:3.7-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

COPY autoscheduler /app
RUN pip install -r requirements.txt

COPY entrypoint.sh /usr/local/bin
ENTRYPOINT ["entrypoint.sh"]
