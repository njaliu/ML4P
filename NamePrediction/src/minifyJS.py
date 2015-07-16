#!/usr/bin/python

import os
import sys

def PrintUsage():
  print """
Usage:
  minifyJS.py --dir <directory> --map <directory> --target <directory>
"""
  exit(1)

def MinifyJSFilesInDirToTarget(d, sourceMap, target):
  for root, _, files in os.walk(d):
    for f in files:
      fname = os.path.join(root, f)
      if fname.endswith('.js'):
        fbase = os.path.basename(fname)
        fbase_name = os.path.splitext(fbase)[0]
        os.system("uglifyjs -c -m --source-map='%s' -o='%s' '%s'" % (sourceMap + fbase_name + '.map', target + fbase_name + '.min.js', fname))
        #os.system("java -jar /home/aliu/Research/closure-compiler/build/compiler.jar --create_source_map='%s' --js_output_file='%s' '%s'" % (sourceMap + fbase_name + '.map', target + fbase_name + '.min.js', fname))

if __name__ == '__main__':
  if (len(sys.argv) <= 1):
    PrintUsage()

  # Process command line arguments
  if (sys.argv[1] == "--dir" and sys.argv[3] == "--map" and sys.argv[5] == "--target" and len(sys.argv) == 7):
    MinifyJSFilesInDirToTarget(sys.argv[2], sys.argv[4], sys.argv[6])
  else:
    PrintUsage()