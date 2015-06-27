#!/usr/bin/python

import os
import sys

def PrintUsage():
  print """
Usage:
  extractJS.py --dir <directory> --target <directory>
"""
  exit(1)

def CopyJSFilesInDirToTarget(d, target):
  for root, _, files in os.walk(d):
    for f in files:
      fname = os.path.join(root, f)
      if fname.endswith('.js'):
        os.system("cp '%s' '%s'" % (fname, target))

if __name__ == '__main__':
  if (len(sys.argv) <= 1):
    PrintUsage()

  # Process command line arguments
  if (sys.argv[1] == "--dir" and len(sys.argv) == 5):
    CopyJSFilesInDirToTarget(sys.argv[2], sys.argv[4])
  else:
    PrintUsage()