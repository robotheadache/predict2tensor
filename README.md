# predict2tensor
a bidirectional LSTM neural network based server (front and backend) written with Keras, Tensorflow, Node.JS, and lit boasting a prediction accuracy of 86% and query times between 0.5 and 3 seconds.

## Prerequisites
Redis
MongoDB
Docker

Docker image can be configured with 

```
docker run -p 8501:8501 \   
  --mount type=bind,source= predict2tensor/ssmodel,target=/models/ssmodel \
  -e MODEL_NAME=ssmodel -t tensorflow/serving
```
