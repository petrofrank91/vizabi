#!/bin/bash

# Script to deploy vizabi during continuous integration (sourced)

# The following env vars needs to be set properly:
# - DRONE_BUILD_DIR
# - VIZABI_APPNAME
# - VIZABI_S3_TARGET
# - VIZABI_DEPLOYMENT_BASE_URL

# The current working directory should be the vizabi project root folder

APPNAME=$VIZABI_APPNAME
echo APPNAME=$APPNAME

# send to s3
bash $DRONE_BUILD_DIR/ci-scripts/s3cmd-configure.sh
s3cmd -v --config=/tmp/.gapminder-vizabi-go-s3.s3cfg --acl-public --recursive put dist/ "$VIZABI_S3_TARGET/"

# test s3-deployment of vizabi
built=$(curl -L "http://$VIZABI_DEPLOYMENT_BASE_URL/vizabi.js" --silent --output /dev/null --write-out %{http_code})
if [ "$built" -ne "200" ]
    then
        echo "Failed to deploy $APPNAME successfully at http://$VIZABI_DEPLOYMENT_BASE_URL !";
        exit 1;
fi

echo "Build $APPNAME should now be available at http://$VIZABI_DEPLOYMENT_BASE_URL"

