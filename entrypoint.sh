#!/bin/sh

echo "Waiting for postgres..."

while  ! pg_isready; do
  sleep 0.1
done

echo "PostgreSQL started"

python manage.py recreate_db
python manage.py db upgrade
gunicorn -b 0.0.0.0:5000 manage:app
