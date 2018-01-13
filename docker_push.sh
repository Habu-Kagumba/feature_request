#!/bin/sh

if [ "$TRAVIS_BRANCH" == "master" ]; then
    docker login -e $DOCKER_EMAIL -u $DOCKER_ID -p $DOCKER_PASSWORD
    export TAG=`if [ "$TRAVIS_BRANCH" == "master" ]; then echo "latest"; else echo $TRAVIS_BRANCH ; fi`

    docker_build $API $API_REPO
    docker_build $API_DB $API_DB_REPO
    docker_build $CLIENT $CLIENT_REPO
    docker_build $NGINX $NGINX_REPO
fi

docker_build() {
    local name=$1
    local repo=$2

    docker build "$repo" -t "$name":$COMMIT
    docker tag "$name":$COMMIT $DOCKER_ID/"$name":$TAG
    docker push $DOCKER_ID/"$name"
}
