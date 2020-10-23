# Build stage
FROM node:14.5-alpine AS build

WORKDIR /usr/src/pay-slips-ui

COPY package*.json .npmrc ./

ARG SCLABLE_NPM_TOKEN
RUN npm ci

ARG VUE_APP_BASE_URL
ARG VUE_APP_API_BASE_URL
ARG VUE_APP_CLIENT_ID

COPY public ./public
COPY src ./src
COPY .browserslistrc .eslintrc.js babel.config.js tsconfig.json vue.config.js ./

RUN npm run build -- --mode=production

# Production stage
FROM nginx:stable-alpine as production

COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=build /usr/src/pay-slips-ui/dist /var/www/public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
