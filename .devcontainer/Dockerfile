FROM node:20-bullseye

WORKDIR /workspace

# Install essential packages
RUN apt-get update && apt-get install -y git bash && rm -rf /var/lib/apt/lists/*

# Keep container alive
CMD [ "sleep", "infinity" ]
