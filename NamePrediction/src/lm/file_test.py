#!/usr/bin/python

f = open('/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/jquery_test.min.js','a+')
f1 = open('/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/blank.txt','a+')

# print(f)

content = f.read()
f1.write(content)

# print(content)

f.close()
f1.close()