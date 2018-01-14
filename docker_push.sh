#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    if [ "$TRAVIS_BRANCH" == "develop" ]; then
        docker login -u $DOCKER_ID -p $DOCKER_PASSWORD
        export TAG=$TRAVIS_BRANCH
        export REPO=$DOCKER_ID
    fi

    if [ "$TRAVIS_BRANCH" == "staging" ] || [ "$TRAVIS_BRANCH" == "master" ]; then
        curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
        unzip awscli-bundle.zip
        ./awscli-bundle/install -b ~/bin/aws
        export PATH=~/bin:$PATH
        eval $(aws ecr get-login --region us-east-1 --no-include-email)
        export TAG=$TRAVIS_BRANCH
        export REPO=$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
    fi

    if [ "$TRAVIS_BRANCH" == "staging" ]; then
        export SECRET_KEY="supersecret"
    fi

    if [ "$TRAVIS_BRANCH" == "master" ]; then
        export SECRET_KEY="CHANGEME"
    fi

    docker_build() {
        local name=$1
        local app_repo=$2

        docker build "$app_repo" -t "$name":$COMMIT
        docker tag "$name":$COMMIT $REPO/"$name":$TAG
        docker push $REPO/"$name":$TAG
    }


    if [ "$TRAVIS_BRANCH" == "develop" ] || [ "$TRAVIS_BRANCH" == "staging" ] || [ "$TRAVIS_BRANCH" == "master" ]; then
        docker_build $API $API_REPO
        docker_build $API_DB $API_DB_REPO
        docker_build $CLIENT $CLIENT_REPO
        docker_build $NGINX $NGINX_REPO
    fi
fi
