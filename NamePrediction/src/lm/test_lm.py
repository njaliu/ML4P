import kenlm

dir_base = '/home/aliu/Research/klm/aliu-test/'
test_dir = '/home/aliu/Research/ML4P/NamePrediction/aliu-test/mutation/'
model = kenlm.LanguageModel(dir_base + 'jquery_lm.klm')

f = open(test_dir + 'jquery_test.min.mutate3.js', 'r')
print(model.score(f.read()))
f.close()