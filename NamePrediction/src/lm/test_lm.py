import kenlm

dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/'
test_dir = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/'
model = kenlm.LanguageModel(dir_base + 'jquery.klm')

f = open(test_dir + 'test_minified.input', 'r')
f1 = open('/home/aliu/klm_score', 'w')
out = model.score(f.read())
print(out)
f1.write(str(out))
f1.close()
f.close()