#!/bin/bash

# Make sure there is an associated pull request, then also make sure
# something changed in the ./web directory since we're only pushing
# up frontend changes
git diff origin/master --relative=web --exit-code
WEBCHANGES=$?
if [ -n "$CI_PULL_REQUESTS" ] && [ "$WEBCHANGES" -ne 0 ]; then
  PRNUM=`basename $CI_PULL_REQUESTS`

  # CF_USER, CF_PASSWORD are defined as private Environment Variables
  # in CircleCI web UI: https://circleci.com/gh/18F/cms-hitech-apd/edit#env-vars

  set -e

  export API_URL=$STAGING_API_URL

  # Install `cf` cli
  curl -L -o cf-cli_amd64.deb 'https://cli.run.pivotal.io/stable?release=debian64&source=github'
  dpkg -i cf-cli_amd64.deb
  rm cf-cli_amd64.deb

  # Install `autopilot` plugin
  cf install-plugin autopilot -f -r CF-Community

  # Build the front-end
  cd web
  npm ci
  npm run build
  cd ..

  # Log into CF
  cf login -a $STAGING_CF_API -u $STAGING_CF_USER -p $STAGING_CF_PASSWORD -o $STAGING_CF_ORG -s $STAGING_CF_SPACE

  # Push
  cf push "hitech-apd-frontend-pr$PRNUM" -n "hitech-apd-pr$PRNUM" -b https://github.com/cloudfoundry/staticfile-buildpack.git -m 64M --no-manifest -p web/dist
else
  echo "Not a pull request, or no changes to /web"
fi