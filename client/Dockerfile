FROM node:latest

RUN apt-get update -y
RUN apt install -y dirmngr wget git curl apt-utils

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get update
RUN apt-get install -y google-chrome-stable

# Install Xvfb
RUN apt-get install -y xvfb

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

ARG API_IP
ARG NODE_ENV
ENV API_IP $API_IP
ENV NODE_ENV $NODE_ENV

ADD package.json /usr/src/app/package.json
RUN npm install --silent

ADD . /usr/src/app

RUN npm run build

CMD ["npm", "run", "prod"]
