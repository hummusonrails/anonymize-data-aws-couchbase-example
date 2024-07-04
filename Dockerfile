FROM public.ecr.aws/lambda/nodejs:18

RUN yum -y install gcc-c++ tar gzip findutils

WORKDIR /var/task

COPY package*.json ./

RUN npm install

COPY index.js ./

CMD [ "index.handler" ]
