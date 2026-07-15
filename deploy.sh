#!/bin/bash

SERVER_USER="Administrator"
SERVER_IP="171.13.38.93"
SERVER_PORT="10022"
TARGET_DIR="D:/WWW_MES_PC"

set -e

echo "🚀 [1/3] 开始构建..."
pnpm build:staging

echo "📦 [2/3] 正在打包..."
cd dist/staging
zip -r ../../dist.zip ./* > /dev/null
cd ../..

echo "🚚 [3/3] 正在上传..."

scp -P ${SERVER_PORT} ./dist.zip ${SERVER_USER}@${SERVER_IP}:${TARGET_DIR}/dist.zip

ssh -v -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_IP} "powershell -Command \"
    cd '${TARGET_DIR}';
    if (Test-Path 'dist.zip') {
        Expand-Archive -Path 'dist.zip' -DestinationPath '${TARGET_DIR}' -Force;
        Remove-Item -Path 'dist.zip' -Force;
    }
\""

rm -f ./dist.zip

echo "🎉 发布成功！"
