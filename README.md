# predict2tensor
a bidirectional LSTM neural network based server (front and backend) written with Keras, Tensorflow, Node.JS, and lit boasting a prediction accuracy of 86% and query times between 0.5 and 3 seconds.

## Folders
`frontend` : The source for the website serving the model.

`ssmodel` : The saved prediction model.

`development` : python pickles, jupyter notebooks, and scripts needed in order to create the model.

## Prerequisites
Redis
MongoDB
Docker

Docker image can be configured with 

```
docker run -p 8501:8501 \   
  --mount type=bind,source= <absolute path>predict2tensor/ssmodel,target=/models/ssmodel \
  -e MODEL_NAME=ssmodel -t tensorflow/serving
```

To run the server, use `npm install` in `frontend/api` and then `npm run production`
