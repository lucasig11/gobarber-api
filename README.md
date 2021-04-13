# Go Barber Server API

- The api will start at localhost:3333

### Setup
```bash
git clone repoURL
cd repo
yarn install
```

### Run tests
```bash
yarn test
```

### Run development server (the settings are at ormconfig.json)
```bash
docker run --name docker_pg -e POSTGRES-PASSWORD=docker -p 5432:5432 -d postgres ## run postgres container at port 5432
docker start docker_pg

docker run --name mongodb -p 27017:27017 -d -t mongo ## run mongodb container at port 27017
docker start mongodb

yarn dev:server ## start node server
```


