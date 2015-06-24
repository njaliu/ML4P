#! /bin/bash

cd /home/aliu/Research/ML4P/NamePrediction/jsm

for f in *.js
do 
   echo ${f/min/rename}
done
