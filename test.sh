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

testcafe chrome:headless client/test/e2e/**/*
inspect $? e2e

docker-compose -f docker-compose-test.yml run api python manage.py cov
inspect $? api

if [ -n "${fails}" ]; then
  printf "\n${RED}✗ Failed!: ${fails}${NORMAL}\n"
  exit 1
else
  printf "\n${GREEN}✓ Passed!${NORMAL}\n"
  exit 0
fi
