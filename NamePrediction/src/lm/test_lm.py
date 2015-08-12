import kenlm

dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/'
#test_dir = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/'
test_dir = '/home/aliu/Research/More/TestBench/Deobfuscation/Bench4prob/results/guidance/'
model = kenlm.LanguageModel(dir_base + 'github_150.noPun.id.5gram.klm')

f = open(test_dir + 'tmp1.token', 'r')
#f1 = open('/home/aliu/klm_score', 'w')
out = model.score(f.read())
print(out)
#f1.write(str(out))
#f1.close()
f.close()