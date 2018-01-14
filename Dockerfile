FROM python:3.6.2

RUN mkdir -p /usr/src
WORKDIR /usr/src

ADD ./requirements.txt /usr/src/requirements.txt

RUN pip install -r requirements.txt

ADD ./entrypoint.sh /usr/src/entrypoint.sh

ADD . /usr/src

CMD ["./entrypoint.sh"]
