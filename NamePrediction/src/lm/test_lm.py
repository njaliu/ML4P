import kenlm

dir_base = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/lm/'
test_dir = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/'
model = kenlm.LanguageModel(dir_base + 'jquery.klm')

f = open(test_dir + 'test_minified.input', 'r')
print(model.score(f.read()))
f.close()