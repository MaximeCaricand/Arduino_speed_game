FROM node:14 as builder
COPY ./ server
WORKDIR /server
RUN npm install && npm run build 

FROM node:14-alpine
COPY --from=builder /server /server
WORKDIR /server
RUN rm -rf ./src
EXPOSE 3100
EXPOSE 3200
CMD npm run start