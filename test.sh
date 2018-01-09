#!/usr/bin/env bash

# Prettify Colors
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
NORMAL=$(tput sgr0)

fails=''

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

# docker-compose -f docker-compose-test.yml run api python manage.py cov
docker-compose run api python manage.py cov
inspect $? api

dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
pushd $dir

cd "client"
npm run e2e
inspect $? e2e
cd -

popd

if [ -n "${fails}" ]; then
  printf "\n${RED}✗ Failures: ${fails}${NORMAL}\n"
  exit 1
else
  printf "\n${GREEN}✓ Passed!${NORMAL}\n"
  exit 0
fi
