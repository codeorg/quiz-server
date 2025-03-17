
#!/bin/bash
dist="$1"
git_url="$2"
echo "dist: ${dist}"
if [[ $dist =~ ^.*\:[0-9]*\/.+$ ]]; then
    echo "dist解析正确"
else
    echo "dist格式不对"
    exit 1
fi

port=`echo ${dist} | sed 's/.*\:\([0-9]*\)\/.*/\1/g'`
host=`echo ${dist} | sed 's/\(.*\)\:[0-9]*\/.*/\1/g'`
path=`echo ${dist}| sed 's/.*\:[0-9]*\(\/.*\)/\1/g'`

echo "host: ${host}"
echo "port: ${port}"
echo "path: ${path}"

if [ -z "$path" ];then
    echo "path不能为空"
    exit 1
fi

if [ "$path" = "/" ];then
    echo "path不能为根目录"
    exit 1
fi

npm config set registry https://registry.npmmirror.com

echo "clone ${git_url} /app/code"
git clone $git_url /app/code

cd /app/code
echo "npm install"
npm install
if [ $? -eq 0 ]; then
    echo "npm install 成功"
else
    echo "npm install 失败"
    exit 1
fi

echo "ssh -p ${port} ${host} \"rm -rf ${path} && mkdir ${path}\""
ssh -p $port $host "rm -rf ${path} && mkdir ${path}"
if [ $? -eq 0 ]; then
    echo "文件夹清空完成"
else
    echo "文件夹清空失败"
    exit 1
fi

echo "部署完成"