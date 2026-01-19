# add branch to config.yml
sed -i "s|__BRANCH__|${HEAD}|g" static/admin/config.yml
hugo --noChmod --gc --minify -b $URL