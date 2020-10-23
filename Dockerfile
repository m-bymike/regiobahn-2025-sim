# Build stage
FROM node:14.5-alpine AS build

WORKDIR /usr/src/oebb-sim

COPY package*.json ./

RUN npm ci

COPY public ./public
COPY src ./src
COPY .browserslistrc .eslintrc.js babel.config.js tsconfig.json ./

RUN npm run build -- --mode=production

# Production stage
FROM nginx:stable-alpine as production

COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=build /usr/src/oebb-sim/dist /var/www/public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
