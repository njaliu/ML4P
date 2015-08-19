#!/usr/bin/python

# Extract values to Matlab for corrcoef() calculation.

import re

f = open('/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/20150805_mcmc_n10_5gram_var_highest_485_lm','r')
perplexity_file = open('/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/perplexity','a+')
obfuscation_file = open('/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/obfuscation','a+')

lines = list(f)
#arr = 'haha, 2, perplexity: -2.31, haha'

nums = re.compile(r".correct: [+-]?\d+(?:\.\d+)?")
numss= re.compile(r"[+-]?\d+(?:\.\d+)?")


for i in lines:
	if lines.index(i) % 11 != 0:
		x = nums.search(i).group(0)
		y = numss.search(x).group(0)
		obfuscation_file.write(y + ' ')


print "Done!"