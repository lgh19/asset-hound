#!/bin/bash

NAME="assets (Huey)" # Name of the application
DJANGODIR=/var/www/backend  # Django project directory
DJANGOENVDIR=/var/www/backend/env  # Django project virtualenv

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $DJANGODIR
source /var/www/backend/env/bin/activate
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Start Huey
exec ${DJANGOENVDIR}/bin/python manage.py run_huey
