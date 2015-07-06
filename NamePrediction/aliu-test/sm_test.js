var sourceMap = require('source-map');
var fs = require('fs');

var rawSourceMap = {
  version: 3,
  file: 'aliu-test/test1.map',
  names: ["createGraphRepresentation","g","console","log","repr","nodes","edges","N","length","i","node","newnode","id","label","x","Math","cos","PI","y","sin","size","color","edge","newedge","source","target"],
  sources: ['aliu-test/test1.js'],
  sourceRoot: '/home/aliu/Research/closure-compiler/',
  mappings: 'AAAAA,QAASA,0BAAyB,CAACC,CAAD,CAAI,CACpCC,OAAAC,IAAA,CAAYF,CAAZ,CACA,KAAIG,EAAO,CAAEC,MAAM,EAAR,CAAYC,MAAM,EAAlB,CAAX,CACIC,EAAIN,CAAAI,MAAAG,OACR,KAAKC,CAAL,GAAUR,EAAAI,MAAV,CAAmB,CACjB,IAAIK,EAAOT,CAAAI,MAAA,CAAQI,CAAR,CAAX,CACIE,EAAU,CACVC,GAAIF,CAAAE,GADM,CAEVC,MAAOH,CAAAG,MAFG,CAGVC,EAAG,GAAHA,CAASC,IAAAC,IAAA,CAAS,CAAT,CAAaP,CAAb,CAAiBM,IAAAE,GAAjB,CAA2BV,CAA3B,CAHC,CAIVW,EAAG,GAAHA,CAASH,IAAAI,IAAA,CAAS,CAAT,CAAaV,CAAb,CAAiBM,IAAAE,GAAjB,CAA2BV,CAA3B,CAJC,CAKVa,KAAM,CALI,CAMVC,MAAOX,CAAAW,MANG,CAQdjB,EAAAC,MAAA,CAAWI,CAAX,CAAA,CAAgBE,CAVC,CAanB,IAAKF,CAAL,GAAUR,EAAAK,MAAV,CACMgB,CAOJ,CAPWrB,CAAAK,MAAA,CAAQG,CAAR,CAOX,CAAAL,CAAAE,MAAA,CAAWG,CAAX,CAAA,CANcc,CACVX,GAAIU,CAAAV,GADMW,CAEVC,OAAQF,CAAAE,OAFED,CAGVE,OAAQH,CAAAG,OAHEF,CAIVV,MAAOS,CAAAT,MAJGU,CAShB,OAAOnB,EA5B6B;'
};

var dir_base = '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/';
var rawSourceMap_1 = JSON.parse(fs.readFileSync(dir_base + 'source_maps/cc/00-check-mock-dep.map','utf-8'));
//console.log(rawSourceMap_1.file);
//rawSourceMap_1.file = dir_base + rawSourceMap_1.file;
//console.log(rawSourceMap_1.sources);
//rawSourceMap_1.sources = "['/home/aliu/Research/closure-compiler/aliu-test/test1.js']" ;
//console.log(rawSourceMap_1.sources);
//console.log(rawSourceMap_1);
rawSourceMap_1["sourceRoot"] = dir_base;


var smc = new sourceMap.SourceMapConsumer(rawSourceMap_1);

console.log(smc.sources);

console.log(smc.originalPositionFor({
  line: 1,
  column: 70
}));

console.log(smc.generatedPositionFor({
  source: '/home/aliu/Research/TestDB/ML4P/NamePrediction/aliu-test/test_files/original_source/00-check-mock-dep.js',
  line: 1,
  column: 1
}));