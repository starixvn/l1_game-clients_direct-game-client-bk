FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib as builder

COPY ./src/build/web-mobile/ /app
RUN rm -rf /app/assets

COPY ./src/build/web-mobile/assets/main /assets/main
COPY ./src/build/web-mobile/assets/resources /assets/resources
COPY ./src/build/web-mobile/assets/internal /assets/internal
COPY ./src/build/web-mobile/assets/versions.json /assets/versions.json

FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib as publish

COPY ./src/.nginx/game.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app /usr/share/nginx/html/
COPY --from=builder /assets /usr/share/nginx/html/assets
COPY ./src/splash-resources  /usr/share/nginx/html/splash-resources
COPY ./src/remote /usr/share/nginx/html/remote