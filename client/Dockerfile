FROM node:latest

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
# CMD ["npm", "run", "dev"]
