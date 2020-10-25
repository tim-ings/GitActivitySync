#!/bin/sh

# set up ssh directory
mkdir /root/.ssh/
echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config
chmod 600 -R /root/.ssh/

# get from env > decode > format into 3 lines > save to file
echo $DEPLOY_KEY | base64 -d | sed 's/\(KEY----- \)/\1\n/' | sed 's/\(-----END\)/\n\1/' > /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa

# run activity sync
node /app/dist/index.js

# remove the private key
rm /root/.ssh/id_rsa
