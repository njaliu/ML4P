import kenlm

dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/'
test_dir = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/'
# 3-gram LM
#lm_file = 'github_150.klm'
# 5-gram LM
#lm_file = 'github_150.5gram.klm'
# 6-gram LM
#lm_file = 'github_150.6gram.klm'
# 5-gram LM, no Punctuator
#lm_file = 'github_150.noPun.5gram.klm'
# 5-gram LM, no Punctuator, rename vars
lm_file = 'github_150.noPun.id.5gram.klm'
perplexity_file = 'github_150.perplexity'

model = kenlm.LanguageModel(dir_base + lm_file)

def CalculatePerplexity(tokens):
	perplexity = model.score(tokens)
	return perplexity



f = open(test_dir + 'mutant.tokens', 'r')
f1 = open(test_dir + perplexity_file, 'w')

tks = f.read()
perp = CalculatePerplexity(tks)
print(perp)
f1.write(str(perp))

f1.close()
f.close()