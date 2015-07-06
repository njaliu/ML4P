#!/usr/bin/python

import os
import sys

'''
def PrintUsage():
  print """
Usage:
  predictJS.py --dir <directory> --target <directory>
"""
  exit(1)
'''

def getBaseFileNameWithoutExt(fbase):
  result = ''
  sections = fbase.split(os.extsep)
  n = len(fbase.split(os.extsep))
  for i in range(0,n-2):
    result += (sections[i] + '.')

  return result


def PredictJSFilesInDirToTarget(d, target):
  for root, _, files in os.walk(d):
    for f in files:
      fname = os.path.join(root, f)
      if fname.endswith('.js'):
        fbase = os.path.basename(fname)
        fbase_name = getBaseFileNameWithoutExt(fbase)
        os.system("unuglifyjs '%s' > '%s'" % (fname, target + fbase_name + 'rename.js'))

'''
if __name__ == '__main__':
  if (len(sys.argv) <= 1):
    PrintUsage()

  # Process command line arguments
  if (sys.argv[1] == "--dir" and sys.argv[3] == '--target' and len(sys.argv) == 5):
    PredictJSFilesInDirToTarget(sys.argv[2], sys.argv[4])
  else:
    PrintUsage()
'''

d = '/home/aliu/Research/ML4P/NamePrediction/jsm/'
t = '/home/aliu/Research/ML4P/NamePrediction/jsp/'
PredictJSFilesInDirToTarget(d, t)