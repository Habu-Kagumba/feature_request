#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    if [ "$TRAVIS_BRANCH" == "staging" ]; then
        JQ="jq --raw-output --exit-status"

        aws_configure() {
            aws --version
            aws configure set default.region us-east-1
            aws configure set default.output json
            echo "Finished AWS configure"
        }

        make_tasks() {
            task_template=$(cat aws/ecs_tasks.json)
            task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $AWS_ACCOUNT_ID)
            echo "$task_def"
        }

        make_def() {
            if revision=$(aws ecs register-task-definition --cli-input-json "$task_def" --family $family | $JQ '.taskDefinition.taskDefinitionArn'); then
                echo "Revision: $revision"
            else
                echo "Failed to register task definition"
                return 1
            fi
        }

        deploy() {
            family="feature-request-staging"
            cluster="feature-request-staging"
            service="feature-request-staging"

            make_tasks
            make_def

            if [[ $(aws ecs update-service --cluster $cluster --service $service --task-definition $revision | $JQ '.service.taskDefinition') != $revision ]]; then
                echo "Error updating service."
                return 1
            fi
        }

        aws_configure
        deploy
    fi
fi
