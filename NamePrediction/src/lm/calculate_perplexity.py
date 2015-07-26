import kenlm

dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/'
test_dir = '/home/aliu/'
lm_file = 'github_150.klm'
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