FROM ubuntu:24.04
LABEL authors="dave"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    curl \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python

ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python3 - && poetry --version

WORKDIR /app

COPY pyproject.toml poetry.lock* /app/
RUN poetry config virtualenvs.create false \
    && poetry config virtualenvs.in-project false \
    && poetry lock \
    && poetry install --no-interaction --no-ansi --no-root

COPY . /app

ENV FLASK_APP=app.py

CMD ["sh", "-c", "poetry run python -m flask db upgrade && poetry run python app.py"]
