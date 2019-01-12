FROM node

WORKDIR /home/node

COPY ./src /home/node/src
COPY ./package.json /home/node/package.json
COPY ./package-lock.json /home/node/package-lock.json

RUN npm install

CMD [ "npm", "start" ]