FROM node:20-bullseye

WORKDIR /workspace

RUN apt-get update && apt-get install -y git bash default-mysql-client && rm -rf /var/lib/apt/lists/*

CMD [ "sleep", "infinity" ]
