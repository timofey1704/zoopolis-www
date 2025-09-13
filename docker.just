
docker-build:
  docker buildx build -t zoopolis/{{image}}:dev -f Dockerfile --platform="linux/amd64" .

# GITLAB_TOKEN and GITLAB_USER should be in env
docker-auth:
  echo $GITLAB_TOKEN | docker login registry.gitlab.com -u ${GITLAB_USER} --password-stdin

docker-push: docker-auth
  docker tag zoopolis/{{image}}:dev registry.gitlab.com/wedeving/zoopolis-www/{{image}}:prod
  docker push registry.gitlab.com/wedeving/zoopolis-www/{{image}}:prod
