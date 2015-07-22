#!/usr/bin/python

import os
import sys

def extractLowPrecisionSet(file):
    low_precision_set = set()
    f = open(file, 'r')
    for line in f:
    	record = line.rstrip('\n').split()[1]
    	elems = record.split('/')
    	elem = elems[len(elems) - 1]
    	# print(record)
    	low_precision_set.add(elem)
    f.close()
    return low_precision_set

def computeDifference(x, y):
	print("#### Set A: %d, Set B: %d" % (len(x), len(y)))
	diff = x.difference(y)
	# print("#### Difference: %d" % len(diff))
	for e in diff:
		print e
	return len(diff)


baseline = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_baseline'
O1 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O1'
O2 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O2'
O3 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O3'
O4 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O4'
O5 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O5'
O6 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O6'
O7 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O7'
O8 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O8'
O9 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O9'
O10 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O10'
O11 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O11'
O12 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O12'
O13 = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/low_precision_O13'

#test_file_0 = '/home/aliu/lowprec_test'
#test_file_1 = '/home/aliu/lowprec_test_1'

set_baseline = extractLowPrecisionSet(baseline)
set_O1 = extractLowPrecisionSet(O1)
set_O2 = extractLowPrecisionSet(O2)
set_O3 = extractLowPrecisionSet(O3)
set_O4 = extractLowPrecisionSet(O4)
set_O5 = extractLowPrecisionSet(O5)
set_O6 = extractLowPrecisionSet(O6)
set_O7 = extractLowPrecisionSet(O7)
set_O8 = extractLowPrecisionSet(O8)
set_O9 = extractLowPrecisionSet(O9)
set_O10 = extractLowPrecisionSet(O10)
set_O11 = extractLowPrecisionSet(O11)
set_O12 = extractLowPrecisionSet(O12)
set_O13 = extractLowPrecisionSet(O13)

ouput = computeDifference(set_O13, set_baseline)

print ouput