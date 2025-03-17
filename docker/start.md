#创建docker镜相，把ssh-key导入docker里
docker build -t cyt-admin --build-arg ssh_prv_key="$(cat ~/.ssh/id_rsa)" --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" --squash .

#运行
docker run --rm cyt-admin root@8.154.29.169:22/opt/cyt-admin/ git@e.coding.net:codeorg/vandai/cyt-admin.git