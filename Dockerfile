FROM nginx:latest
MAINTAINER jyq "jiyongqiang@pioneerservice.cn"

#RUN mkdir /usr/share/nginx/html
ADD dist /usr/share/nginx/html/pws


EXPOSE 80