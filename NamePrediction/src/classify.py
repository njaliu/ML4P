import os
import re

def find(name, path):
    for root, dirs, files in os.walk(path):
        if name in files:
            return os.path.join(root, name)

if __name__ == '__main__':
  base = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/repos/'
  f = 'ReactRef.js'
  project = find(f, base).split('/')[9]
  print project