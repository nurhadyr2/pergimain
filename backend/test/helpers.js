// Stub modul internal lewat Module._load supaya service bisa diuji tanpa database.
const Module = require('module');

const stubs = new Map();
const origLoad = Module._load;
Module._load = function (request, parent, ...rest) {
  if (stubs.has(request)) return stubs.get(request);
  return origLoad.call(this, request, parent, ...rest);
};

exports.stub = (request, value) => stubs.set(request, value);
exports.fresh = (p) => {
  delete require.cache[require.resolve(p)];
  return require(p);
};
