# Image Recognition Web app

## Requirements

Assuming you are on Unix (I worked on a mac so please install the appropriate tools)

1. npm
2. nodejs
3. imagemagick
4. docker


## Installation (Macbook)

1. If you dont have homebrew installed then do the following

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

2. If you dont have node installed, do the following:

`brew install node`

3. Download docker for your operating system from https://docs.docker.com/engine/installation/

4. Goto `ImageRecognitionWebApp` in terminal

### Using Docker

1. Build the codebase

`docker build -t arunshan/imagerecognitionwebapp .`

2. Run the codebase

`docker run -p 8080:8080 -d arunshan/imagerecognitionwebapp`

### Using your localhost

1. Install mongodb for your operating system and run the mongodb server
2. `npm install` to install all the dependencies
3. `npm start` to start the web app

Goto the browser and you can view the app on `http://localhost:8080`


## Documentation

Frontend: JADE/CSS/Javascript
Middleware: nodejs
ORM framework: mongoose
Database Used: MongoDB (service used is compose.com)

Store the pHash's for every image uploaded in the database. Then compare the pHash of the test image with the images
in the database and return the top 3 similar images using hamming distance.

1. Train Image Data:

  a. Open `http://localhost:8080/train`

    You can upload any number of images to train the dataset. The images are stored in S3 and served using imgix CDN.
    Why imgix? Imgix provides the ability to resize the image realtime by passing the width `w=` parameter to the CDN URL.
    The training data uses the pHash module to store the image fingerprints for every image.

2. Goto the homepage `http://localhost:8080`

  You can test image similarity by uploading a picture and the server will return 3 similar images (if it exists) with the similarity score.
