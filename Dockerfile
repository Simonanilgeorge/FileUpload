FROM node:latest as build
WORKDIR /usr/src/app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=build /usr/src/app/dist/NTC /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

