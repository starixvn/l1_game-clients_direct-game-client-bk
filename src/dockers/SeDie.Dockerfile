FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib

COPY ./src/.nginx/game.conf /etc/nginx/conf.d/default.conf
COPY ./src/build/web-mobile/assets/2 /usr/share/nginx/html/2
COPY ./src/build/web-mobile/assets/versions.json /usr/share/nginx/html
