FROM node as builder
COPY ./ server
WORKDIR /server
RUN npm install && npm run build

FROM node:12-alpine
COPY --from=builder /server /server
WORKDIR /server
RUN rm -rf ./src
EXPOSE 3100
EXPOSE 3200
CMD npm run start