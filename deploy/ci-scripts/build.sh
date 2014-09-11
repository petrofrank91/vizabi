#!/bin/bash

# Script to build vizabi during continuous integration (sourced)

# The following env vars needs to be set properly (TODO: make do without these):
# - DRONE_BUILD_DIR
# - CURRENT_VIZABI_COMMIT
# - CURRENT_WEBAPPFRAMEWORK_COMMIT
# - CURRENT_GO_COMMIT

# The current working directory should be the vizabi project root folder

# deps for npm install
# already included in neam/ci-base:yeoman-1 # apt-get install -y -q bzip2 build-essential
# deps for grunt build
# already included in neam/ci-base:yeoman-1 # apt-get install -y -q openjdk-6-jre ruby-full rubygems1.8
# already included in neam/ci-base:yeoman-1 # gem install compass --no-rdoc --no-ri

# double-check some program versions
compass -v
sass -v
node -v
npm -v

cd $DRONE_BUILD_DIR/vizabi/dist

    # Checkout current git branch
    echo CURRENT_VIZABI_DIST_BRANCH=$CURRENT_VIZABI_DIST_BRANCH
    git checkout $CURRENT_VIZABI_DIST_BRANCH

cd $DRONE_BUILD_DIR/vizabi

    # only build if not already built
    if [ ! -f dist/.buildcommits ] || [ ! "$CURRENT_VIZABI_COMMIT.$CURRENT_WEBAPPFRAMEWORK_COMMIT.$CURRENT_GO_COMMIT" == "`cat dist/.buildcommits`" ]; then

        # copy dependencies from versioned-deps
        cp -r $DRONE_BUILD_DIR/versioned-deps/vizabi/* .

        # install project deps
        npm install
        npm rebuild
        bower install --allow-root --config.interactive=false

        # Build vizabi-amd & individual css's
        grunt build

        # Store what combination of commits were used to build this
        echo "$CURRENT_VIZABI_COMMIT.$CURRENT_WEBAPPFRAMEWORK_COMMIT.$CURRENT_GO_COMMIT" > dist/.buildcommits

   fi

cd $DRONE_BUILD_DIR/vizabi/dist

    # Commit and push resulting build
    git add --all

    repo=origin

    set +o errexit
    git status
    diff=$(git diff --cached --exit-code --quiet)$?
    set -o errexit
    case $diff in
        0) echo No changes to files in dist. Skipping commit.;;
        1)
            git commit -m \
                "Changes since last build. Built through drone for parent repo commit $DRONE_COMMIT"

            git push origin $CURRENT_VIZABI_DIST_BRANCH
            ;;
        *)
            echo git diff exited with code $diff. Aborting.
            exit $diff
            ;;
    esac

cd $DRONE_BUILD_DIR
