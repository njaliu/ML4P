#!/usr/bin/python

import os
import sys

def PrintUsage():
  print """
Usage:
  extractCode.py --dir <directory> --target_file <file>
"""
  exit(1)

def ExtractCodeFromFileInDirToTarget(d, target_file):
  f_target = open(target_file, 'a+')
  for root, _, files in os.walk(d):
    for f in files:
      fname = os.path.join(root, f)
      if fname.endswith('.js'):
        f_orig = open(fname, 'r')
        f_target.write(f_orig.read())
        f_orig.close()
  f_target.close()

if __name__ == '__main__':
  if (len(sys.argv) <= 1):
    PrintUsage()

  # Process command line arguments
  if (sys.argv[1] == "--dir" and sys.argv[3] == "--target_file" and len(sys.argv) == 5):
    ExtractCodeFromFileInDirToTarget(sys.argv[2], sys.argv[4])
  else:
    PrintUsage()