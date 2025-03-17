FROM node:22
COPY . /app
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com
ARG ssh_prv_key
ARG ssh_pub_key
#ARG git_url
RUN mkdir /root/.ssh
RUN echo "$ssh_prv_key" > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" > /root/.ssh/id_rsa.pub && \
    chmod -R 600 /root/.ssh/
#RUN echo $git_url   
#RUN echo "" >  /root/.ssh/known_hosts
#RUN echo "sshd:ALL" >  /etc/hosts.allow
RUN ssh-keyscan -H e.coding.net >> ~/.ssh/known_hosts
RUN echo "Host * \n  StrictHostKeyChecking no \n  UserKnownHostsFile /dev/null \n  LogLevel ERROR" > /root/.ssh/config 
# RUN npm config set registry https://registry.npmmirror.com
# RUN git clone $git_url /app/code
# RUN cd /app/code && npm install
ENTRYPOINT ["bash","build.sh"]
#CMD ["sh","test.sh"]
#CMD container启动时运行
