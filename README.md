# Whizkey Demo Application

Whizkey is a Node.js application to demo Cloud Foundry deployment with MySQL and Redis service binding. The application can be
used to capture a list of whiskeys. Users can login using their Github credentials and then create a "My Favorites" list of
whiskeys. MySQL is used to store the data. Redis is used for cacheing the Express sessions across scaled deployment of
application instances.

## Local Development

### Prerequisites

You will need MySQL or MariaDB and Redis installed locally. I'm on a Mac so I just use brew to install these for me.

```
brew install mariadb
brew install redis
```

### Creating MariaDB Database

Once MariaDB is installed, we will need a database to be created for use locally with our running application.

```
mysqladmin create whizkey -uroot
```

Now that there is a database named 'whizkey' we will also need to create a user in MariaDB that has proper privileges to use
this DB. From the mysql command line client, run the following commands.

```
$ mysql
...
MariaDB [(none)]> grant all privileges on whizkey.* to 'drinker'@'localhost' identified by 'flask';
MariaDB [(none)]> flush privileges;
```

### Running application

Once you have haproxy running with our custom configuration and have edited /etc/hosts for the domain, you can run the Whizkey 
demo application similar to other Node.js applications using a `start` script target for NPM.

```
npm start
```

## Deploying to Cloud Foundry

### Creating Services

Just as we installed MariaDB and Redis locally, we will need service instances setup in our Cloud Foundry environment for our
Whizkey application to bind to. In order to do this, we assume that the Cloud Foundry environment you are deploying to
already has the open source service brokers for MySQL and Redis installed. Also, the manifest.yml specifies default names for
these service instances so we'll use those names in the commands below.

```
$ cf marketplace
...
service   plans                     description   
p-mysql   100mb-dev, 1gb-dev        A MySQL service for application development and testing   
p-redis   shared-vm, dedicated-vm   Redis service to provide a key-value store   

$ cf create-service p-mysql 100mb-dev whizkey-db-01

$ cf create-service p-redis shared-vm whizkey-cache-01
```

### Deploying the Application

The manifest.yml with default configurations for Cloud Foundry to use when deploying the Whizkey application sets the name to
`whizkey`. This name must be unique within a Cloud Foundry environment/domain. You can modify the manifest.yml to use another
name that will be prefixed to your Cloud Foundry domain. Once the manifest.yml is to your liking, you can just push the
Whizkey application to Cloud Foundry that you are currently targeting.

```
cf push
```

Since our manifest.yml has the service instance names listed, the `cf push` will automatically bind our Whizkey application to
the service instances created in the previous section. You should now be able to open up a browser to 
http://whizkey.[mydomain.for.cloudfoundryenv.com].
