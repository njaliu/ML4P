var sourceMap = require('source-map');

var rawSourceMap = {
  version: 3,
  file: '/home/aliu/Research/closure-compiler/aliu-test/test.min.js',
  names: ["createGraphRepresentation","g","console","log","repr","nodes","edges","N","length","i","node","newnode","id","label","x","Math","cos","PI","y","sin","size","color","edge","newedge","source","target"],
  sources: ['/home/aliu/Research/closure-compiler/aliu-test/test.js'],
  mappings: 'AAAAA,QAASA,0BAAyB,CAACC,CAAD,CAAI,CACpCC,OAAAC,IAAA,CAAYF,CAAZ,CACA,KAAIG,EAAO,CAAEC,MAAM,EAAR,CAAYC,MAAM,EAAlB,CAAX,CACIC,EAAIN,CAAAI,MAAAG,OACR,KAAKC,CAAL,GAAUR,EAAAI,MAAV,CAAmB,CACjB,IAAIK,EAAOT,CAAAI,MAAA,CAAQI,CAAR,CAAX,CACIE,EAAU,CACVC,GAAIF,CAAAE,GADM,CAEVC,MAAOH,CAAAG,MAFG,CAGVC,EAAG,GAAHA,CAASC,IAAAC,IAAA,CAAS,CAAT,CAAaP,CAAb,CAAiBM,IAAAE,GAAjB,CAA2BV,CAA3B,CAHC,CAIVW,EAAG,GAAHA,CAASH,IAAAI,IAAA,CAAS,CAAT,CAAaV,CAAb,CAAiBM,IAAAE,GAAjB,CAA2BV,CAA3B,CAJC,CAKVa,KAAM,CALI,CAMVC,MAAOX,CAAAW,MANG,CAQdjB,EAAAC,MAAA,CAAWI,CAAX,CAAA,CAAgBE,CAVC,CAanB,IAAKF,CAAL,GAAUR,EAAAK,MAAV,CACMgB,CAOJ,CAPWrB,CAAAK,MAAA,CAAQG,CAAR,CAOX,CAAAL,CAAAE,MAAA,CAAWG,CAAX,CAAA,CANcc,CACVX,GAAIU,CAAAV,GADMW,CAEVC,OAAQF,CAAAE,OAFED,CAGVE,OAAQH,CAAAG,OAHEF,CAIVV,MAAOS,CAAAT,MAJGU,CAShB,OAAOnB,EA5B6B;'
};

var smc = new sourceMap.SourceMapConsumer(rawSourceMap);

console.log(smc.sources);

console.log(smc.originalPositionFor({
  line: 1,
  column: 268
}));

console.log(smc.generatedPositionFor({
  source: '/home/aliu/Research/closure-compiler/aliu-test/test.js',
  line: 19,
  column: 11
}));