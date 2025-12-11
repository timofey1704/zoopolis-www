
docker-build-internal DOCKERFILE TAG:
  docker buildx build -t zoopolis/{{image}}:{{TAG}} -f {{DOCKERFILE}} --platform="linux/amd64" .

# GITLAB_TOKEN and GITLAB_USER should be in env
docker-auth:
  echo $GITLAB_TOKEN | docker login registry.gitlab.com -u ${GITLAB_USER} --password-stdin

docker-push-internal TAG: docker-auth
  docker tag zoopolis/{{image}}:{{TAG}} registry.gitlab.com/wedeving/zoopolis-www/{{image}}:{{TAG}}
  docker push registry.gitlab.com/wedeving/zoopolis-www/{{image}}:{{TAG}}
