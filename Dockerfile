
# Single-stage development image that contains Node.js (LTS), Python and Poetry
# - installs system packages needed to build Python packages (libpq-dev, build-essential)
# - installs Node.js LTS from NodeSource
# - installs Poetry non-interactively to /opt/poetry and disables venv creation so
#   dependencies are available system-wide inside the container image

FROM ubuntu:24.04


ENV DEBIAN_FRONTEND=noninteractive \
    POETRY_HOME="/opt/poetry" \
    PATH="/opt/poetry/bin:$PATH"

# Install system dependencies, Node.js LTS and Poetry in a single set of layers.
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        curl \
        git \
        gnupg \
        lsb-release \
        libpq-dev \
        pkg-config \
        python3 \
        python3-pip \
        python3-venv \
        software-properties-common \
        vim \
        wget \
    ; \
    # Install Node.js LTS
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -; \
    apt-get install -y --no-install-recommends nodejs; \
    # Install sudo and clean up
    apt-get install -y --no-install-recommends sudo; \
    rm -rf /var/lib/apt/lists/*; \
    # Install Poetry non-interactively to $POETRY_HOME (installer will pick a compatible latest release)
    curl -sSL https://install.python-poetry.org | python3 - || (sleep 1 && curl -sSL https://install.python-poetry.org | python3 -); \
    poetry --version

# Create a non-root user for development (matches VS Code devcontainer recommendation)
# Create the user early so any later build-stage that switches to the user will succeed
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN set -eux; \
    # Create group if it doesn't exist, otherwise skip; same for user. Use explicit flags to be idempotent.
    if ! getent group ${USER_GID} >/dev/null; then groupadd --gid ${USER_GID} ${USERNAME}; fi; \
    if ! id -u ${USERNAME} >/dev/null 2>&1; then \
        # Check if UID is already taken by another user
        if id ${USER_UID} >/dev/null 2>&1; then \
            # UID is taken, find an available UID
            AVAILABLE_UID=$(python3 -c "import pwd; uids = [u.pw_uid for u in pwd.getpwall()]; uid = ${USER_UID}; \
            while uid in uids: uid += 1; print(uid)"); \
            useradd --uid "$AVAILABLE_UID" --gid ${USER_GID} -m ${USERNAME}; \
        else \
            useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME}; \
        fi; \
    fi; \
    # Add vscode to sudoers with no password for convenience inside the devcontainer
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME}; \
    chmod 0440 /etc/sudoers.d/${USERNAME}

# Set working directory to the backend app by default. This keeps the image
# focused on the Python service while still having Node available for frontend
# tasks if needed.
WORKDIR /app/backend/WhereMoney.Api

# Copy only pyproject/poetry.lock first to leverage Docker layer caching for deps

# Copy pyproject and lockfile first to leverage layer caching for dependency installs.

# Copy pyproject and lockfile first to leverage layer caching for dependency installs.
COPY backend/WhereMoney.Api/pyproject.toml backend/WhereMoney.Api/poetry.lock* ./

# Create an in-project virtual environment for Poetry to avoid installing packages
# into the system-managed Python (PEP 668). This keeps the container reproducible
# and avoids 'externally-managed-environment' errors. Install packages as the
# non-root user so the created `.venv` is owned by that user.
ENV POETRY_VIRTUALENVS_IN_PROJECT=1
USER ${USERNAME}
RUN set -eux; \
    # Ensure Poetry is on PATH for the user and install dependencies into .venv
    POETRY_VIRTUALENVS_IN_PROJECT=1 poetry install --no-interaction --no-ansi
USER root

# Copy the rest of the repository
# Copy the remainder of the repository and make sure the workspace is owned by vscode
COPY . /app
RUN chown -R ${USERNAME}:${USERNAME} /app

# Expose typical Flask port (app may use 5000)
EXPOSE 5000

# Default command is bash so this image can be used interactively. For production
# you might override CMD to run the app (e.g. `poetry run python app.py`).
# Default to an interactive shell for development. The devcontainer will set
# the `remoteUser` to `vscode` so terminals open as that user.
CMD ["bash"]

