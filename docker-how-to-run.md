# Docker

A download/fetched windows image must be image version <= host os version

Verify your os version in `cmd.exe`

    ver

Docker must run under `Windows Containers`.
Right-click docker tray icon => SWITCH TO WINDOWS CONTAINERS

You can get various docker windows images from => [Docker Hub](https://hub.docker.com/r/microsoft/windows-servercore-iis)

## How to create the image

Run this command in the root folder of your proejct where your `Dockerfile` sits:

    // The --isolation=hyperv flag in Docker is used when running Windows containers that require stronger isolation from the host system.

    docker build --isolation=hyperv -t react-iis-app .  
    docker build -t name-for-the-generated-image .

## Create a container for the generated image

    docker run -d --name react-iis-container -p 8083:80 react-iis-app 

    // generates and runs the container with the name supplied
    docker run -d --name name-for-your container -p 8083:80 name-of-the-previously-generated-image 

## Access the app from host

[http://localhost:8083/](http://localhost:8083/)

## Debug a container - three ways

### 1. create a debug image

    docker ps -a # find the container id you are looking for
    docker commit <container-id> debug-image
    docker run -it debug-image powershell

### 2. Execute shell commands inside container

    docker exec -it containerId powershell
    docker exec -it containerId cmd

### 3. Shell gui access in Docker

Open Docker app and click on your running container and go to section `Exec`
