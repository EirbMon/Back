FROM node:8
WORKDIR /Back
COPY . /Back
RUN npm install
CMD ["node","server.js"]

