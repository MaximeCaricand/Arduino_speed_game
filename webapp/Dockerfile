FROM node as builder
COPY ./ client
WORKDIR /client
RUN npm install

FROM node:12-alpine
COPY --from=builder /client/.next /client
WORKDIR /client
EXPOSE 3000
CMD npm run dev