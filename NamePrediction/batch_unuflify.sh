#! /bin/bash

cd /home/aliu/Research/ML4P/NamePrediction/jsm

for f in *.js
do 
   unuglifyjs $f > /home/aliu/Research/ML4P/NamePrediction/jsp/${f/min/rename}
done
