describe("angular", function() {
    var el;
    afterEach(function() {
        dealoc(el);
    });
    describe("case", function() {
        it("should change case", function() {
            expect(lowercase("ABC90")).toEqual("abc90");
            expect(manualLowercase("ABC90")).toEqual("abc90");
            expect(uppercase("abc90")).toEqual("ABC90");
            expect(manualUppercase("abc90")).toEqual("ABC90");
        });
    });
    describe("copy", function() {
        it("should return same object", function() {
            var secondBT = {}, oldDefs = [];
            expect(copy({}, secondBT)).toBe(secondBT);
            expect(copy([], oldDefs)).toBe(oldDefs);
        });
        it("should preserve prototype chaining", function() {
            var a = {}, b = Object.create(a), obj = Object.create(b);
            expect(b.isPrototypeOf(copy(obj))).toBe(!0);
            expect(a.isPrototypeOf(copy(obj))).toBe(!0);
            a = function() {};
            expect(copy(new a()) instanceof a).toBe(!0);
        });
        it("should copy Date", function() {
            var date = new Date(123);
            expect(copy(date) instanceof Date).toBeTruthy();
            expect(copy(date).getTime()).toEqual(123);
            expect(copy(date) === date).toBeFalsy();
        });
        it("should copy RegExp", function() {
            var re = /.*/;
            expect(copy(re) instanceof RegExp).toBeTruthy();
            expect(copy(re).source).toBe(".*");
            expect(copy(re) === re).toBe(!1);
        });
        it("should copy literal RegExp", function() {
            var re = /.*/;
            expect(copy(re) instanceof RegExp).toBeTruthy();
            expect(copy(re).source).toEqual(".*");
            expect(copy(re) === re).toBeFalsy();
        });
        it("should copy RegExp with flags", function() {
            var params3 = RegExp(".*", "gim");
            expect(copy(params3).global).toBe(!0);
            expect(copy(params3).ignoreCase).toBe(!0);
            expect(copy(params3).multiline).toBe(!0);
        });
        it("should copy RegExp with lastIndex", function() {
            var regex = /a+b+/g;
            expect(regex.exec("ab aabb")[0]).toEqual("ab");
            expect(copy(regex).exec("ab aabb")[0]).toEqual("aabb");
        });
        it("should deeply copy literal RegExp", function() {
            var objWithRegExp = {
                re: /.*/
            };
            expect(copy(objWithRegExp).re instanceof RegExp).toBeTruthy();
            expect(copy(objWithRegExp).re.source).toEqual(".*");
            expect(copy(objWithRegExp.re) === objWithRegExp.re).toBeFalsy();
        });
        it("should copy a Uint8Array with no destination", function() {
            if ("undefined" !== typeof Uint8Array) {
                var out = new Uint8Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint8Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Uint8ClampedArray with no destination", function() {
            if ("undefined" !== typeof Uint8ClampedArray) {
                var out = new Uint8ClampedArray(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint8ClampedArray).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Uint16Array with no destination", function() {
            if ("undefined" !== typeof Uint16Array) {
                var out = new Uint16Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint16Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Uint32Array with no destination", function() {
            if ("undefined" !== typeof Uint32Array) {
                var out = new Uint32Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint32Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Int8Array with no destination", function() {
            if ("undefined" !== typeof Int8Array) {
                var out = new Int8Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Int8Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Int16Array with no destination", function() {
            if ("undefined" !== typeof Int16Array) {
                var out = new Int16Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Int16Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Int32Array with no destination", function() {
            if ("undefined" !== typeof Int32Array) {
                var out = new Int32Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Int32Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Float32Array with no destination", function() {
            if ("undefined" !== typeof Float32Array) {
                var out = new Float32Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Float32Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should copy a Float64Array with no destination", function() {
            if ("undefined" !== typeof Float64Array) {
                var out = new Float64Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Float64Array).toBeTruthy();
                expect(dst).toEqual(out);
                expect(dst).not.toBe(out);
            }
        });
        it("should throw an exception if a Uint8Array is the destination", function() {
            if ("undefined" !== typeof Uint8Array) {
                var buf = new Uint8Array(), data = new Uint8Array(5);
                expect(function() {
                    copy(buf, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Uint8ClampedArray is the destination", function() {
            if ("undefined" !== typeof Uint8ClampedArray) {
                var temp = new Uint8ClampedArray(), data = new Uint8ClampedArray(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Uint16Array is the destination", function() {
            if ("undefined" !== typeof Uint16Array) {
                var a = new Uint16Array(), b = new Uint16Array(5);
                expect(function() {
                    copy(a, b);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Uint32Array is the destination", function() {
            if ("undefined" !== typeof Uint32Array) {
                var buf = new Uint32Array(), data = new Uint32Array(5);
                expect(function() {
                    copy(buf, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Int8Array is the destination", function() {
            if ("undefined" !== typeof Int8Array) {
                var temp = new Int8Array(), data = new Int8Array(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Int16Array is the destination", function() {
            if ("undefined" !== typeof Int16Array) {
                var temp = new Int16Array(), data = new Int16Array(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Int32Array is the destination", function() {
            if ("undefined" !== typeof Int32Array) {
                var stack = new Int32Array(), data = new Int32Array(5);
                expect(function() {
                    copy(stack, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Float32Array is the destination", function() {
            if ("undefined" !== typeof Float32Array) {
                var out = new Float32Array(), data = new Float32Array(5);
                expect(function() {
                    copy(out, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should throw an exception if a Float64Array is the destination", function() {
            if ("undefined" !== typeof Float64Array) {
                var temp = new Float64Array(), data = new Float64Array(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        });
        it("should deeply copy an array into an existing array", function() {
            var src = [ 1, {
                name: "value"
            } ], dst = [ {
                key: "v"
            } ];
            expect(copy(src, dst)).toBe(dst);
            expect(dst).toEqual([ 1, {
                name: "value"
            } ]);
            expect(dst[1]).toEqual({
                name: "value"
            });
            expect(dst[1]).not.toBe(src[1]);
        });
        it("should deeply copy an array into a new array", function() {
            var src = [ 1, {
                name: "value"
            } ], dst = copy(src);
            expect(src).toEqual([ 1, {
                name: "value"
            } ]);
            expect(dst).toEqual(src);
            expect(dst).not.toBe(src);
            expect(dst[1]).not.toBe(src[1]);
        });
        it("should copy empty array", function() {
            var dst = [ {
                key: "v"
            } ];
            expect(copy([], dst)).toEqual([]);
            expect(dst).toEqual([]);
        });
        it("should deeply copy an object into an existing object", function() {
            var src = {
                a: {
                    name: "value"
                }
            }, dst = {
                b: {
                    key: "v"
                }
            };
            expect(copy(src, dst)).toBe(dst);
            expect(dst).toEqual({
                a: {
                    name: "value"
                }
            });
            expect(dst.a).toEqual(src.a);
            expect(dst.a).not.toBe(src.a);
        });
        it("should deeply copy an object into a non-existing object", function() {
            var src = {
                a: {
                    name: "value"
                }
            }, dst = copy(src, void 0);
            expect(src).toEqual({
                a: {
                    name: "value"
                }
            });
            expect(dst).toEqual(src);
            expect(dst).not.toBe(src);
            expect(dst.a).toEqual(src.a);
            expect(dst.a).not.toBe(src.a);
        });
        it("should copy primitives", function() {
            expect(copy(null)).toEqual(null);
            expect(copy("")).toBe("");
            expect(copy("lala")).toBe("lala");
            expect(copy(123)).toEqual(123);
            expect(copy([ {
                key: null
            } ])).toEqual([ {
                key: null
            } ]);
        });
        it("should throw an exception if a Scope is being copied", inject(function($rootScope) {
            expect(function() {
                copy($rootScope.$new());
            }).toThrowMinErr("ng", "cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        }));
        it("should throw an exception if a Window is being copied", function() {
            expect(function() {
                copy(window);
            }).toThrowMinErr("ng", "cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        });
        it("should throw an exception when source and destination are equivalent", function() {
            var a, b;
            a = b = {
                key: "value"
            };
            expect(function() {
                copy(a, b);
            }).toThrowMinErr("ng", "cpi", "Can't copy! Source and destination are identical.");
            a = b = [ 2, 4 ];
            expect(function() {
                copy(a, b);
            }).toThrowMinErr("ng", "cpi", "Can't copy! Source and destination are identical.");
        });
        it("should not copy the private $$hashKey", function() {
            var src, dst;
            src = {};
            hashKey(src);
            dst = copy(src);
            expect(hashKey(dst)).not.toEqual(hashKey(src));
        });
        it("should retain the previous $$hashKey when copying object with hashKey", function() {
            var a, b, c;
            a = {};
            b = {};
            c = hashKey(b);
            hashKey(a);
            b = copy(a, b);
            expect(hashKey(b)).not.toEqual(hashKey(a));
            expect(hashKey(b)).toEqual(c);
        });
        it("should retain the previous $$hashKey when copying non-object", function() {
            var value = {}, unexportPath = hashKey(value);
            copy(null, value);
            expect(hashKey(value)).toEqual(unexportPath);
            copy(42, value);
            expect(hashKey(value)).toEqual(unexportPath);
            copy(new Date(), value);
            expect(hashKey(value)).toEqual(unexportPath);
        });
        it("should handle circular references", function() {
            var a = {
                b: {
                    a: null
                },
                self: null,
                selfs: [ null, null, [ null ] ]
            };
            a.b.a = a;
            a.self = a;
            a.selfs = [ a, a.b, [ a ] ];
            var ret = copy(a, null);
            expect(ret).toEqual(a);
            expect(ret).not.toBe(a);
            expect(ret).toBe(ret.self);
            expect(ret).toBe(ret.selfs[2][0]);
            expect(ret.selfs[2]).not.toBe(a.selfs[2]);
            var item = [], ret = copy(a, item);
            expect(ret).toBe(item);
            expect(ret).not.toBe(a);
            expect(ret).toBe(ret.self);
        });
        it("should handle objects with multiple references", function() {
            var src = {}, src = [ src, -1, src ], dst = copy(src);
            expect(dst[0]).not.toBe(src[0]);
            expect(dst[0]).toBe(dst[2]);
            var file = [], dst = copy(src, file);
            expect(dst).toBe(file);
            expect(dst[0]).not.toBe(src[0]);
            expect(dst[0]).toBe(dst[2]);
        });
        it("should handle date/regex objects with multiple references", function() {
            var a = /foo/, b = new Date(), a = {
                re: a,
                re2: a,
                d: b,
                d2: b
            }, b = copy(a);
            expect(b.re).toBe(b.re2);
            expect(b.d).toBe(b.d2);
            b = copy(a, {});
            expect(b.re).toBe(b.re2);
            expect(b.d).toBe(b.d2);
        });
        it("should clear destination arrays correctly when source is non-array", function() {
            expect(copy(null, [ 1, 2, 3 ])).toEqual([]);
            expect(copy(void 0, [ 1, 2, 3 ])).toEqual([]);
            expect(copy({
                0: 1,
                1: 2
            }, [ 1, 2, 3 ])).toEqual([ 1, 2 ]);
            expect(copy(new Date(), [ 1, 2, 3 ])).toEqual([]);
            expect(copy(/a/, [ 1, 2, 3 ])).toEqual([]);
            expect(copy(!0, [ 1, 2, 3 ])).toEqual([]);
        });
        it("should clear destination objects correctly when source is non-array", function() {
            expect(copy(null, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({});
            expect(copy(void 0, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({});
            expect(copy(new Date(), {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({});
            expect(copy(/a/, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({});
            expect(copy(!0, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({});
        });
        it("should copy objects with no prototype parent", function() {
            var obj = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            }), obj = copy(obj);
            expect(Object.getPrototypeOf(obj)).toBe(null);
            expect(obj.a).toBe(1);
            expect(obj.b).toBe(2);
            expect(obj.c).toBe(3);
            expect(Object.keys(obj)).toEqual([ "a", "b", "c" ]);
        });
    });
    describe("extend", function() {
        it("should not copy the private $$hashKey", function() {
            var key, keys;
            key = {};
            keys = {};
            hashKey(key);
            keys = extend(keys, key);
            expect(hashKey(keys)).not.toEqual(hashKey(key));
        });
        it("should retain the previous $$hashKey", function() {
            var key, keys, unexportPath;
            key = {};
            keys = {};
            unexportPath = hashKey(keys);
            hashKey(key);
            keys = extend(keys, key);
            expect(hashKey(keys)).not.toEqual(hashKey(key));
            expect(hashKey(keys)).toEqual(unexportPath);
        });
        it("should work when extending with itself", function() {
            var a, b, c;
            b = a = {};
            c = hashKey(b);
            b = extend(b, a);
            expect(hashKey(b)).toEqual(c);
        });
        it("should copy dates by reference", function() {
            var data = {
                date: new Date()
            }, model = {};
            extend(model, data);
            expect(model.date).toBe(data.date);
        });
    });
    describe("merge", function() {
        it("should recursively copy objects into dst from left to right", function() {
            var ret = {
                foo: {
                    bar: "foobar"
                }
            };
            merge(ret, {
                foo: {
                    bazz: "foobazz"
                }
            }, {
                foo: {
                    bozz: "foobozz"
                }
            });
            expect(ret).toEqual({
                foo: {
                    bar: "foobar",
                    bazz: "foobazz",
                    bozz: "foobozz"
                }
            });
        });
        it("should replace primitives with objects", function() {
            var ret = {
                foo: "bloop"
            };
            merge(ret, {
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            });
            expect(ret).toEqual({
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            });
        });
        it("should replace null values in destination with objects", function() {
            var ret = {
                foo: null
            };
            merge(ret, {
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            });
            expect(ret).toEqual({
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            });
        });
        it("should copy references to functions by value rather than merging", function() {
            function a() {}
            var ret = {
                foo: 1
            };
            merge(ret, {
                foo: a
            });
            expect(ret).toEqual({
                foo: a
            });
        });
        it("should create a new array if destination property is a non-object and source property is an array", function() {
            var a = {
                foo: NaN
            }, b = {
                foo: [ 1, 2, 3 ]
            };
            merge(a, b);
            expect(a).toEqual({
                foo: [ 1, 2, 3 ]
            });
            expect(a.foo).not.toBe(b.foo);
        });
        it("should copy dates by value", function() {
            var e = {
                date: new Date()
            }, c = {};
            merge(c, e);
            expect(c.date).not.toBe(e.date);
            expect(isDate(c.date)).toBeTruthy();
            expect(c.date.valueOf()).toEqual(e.date.valueOf());
        });
    });
    describe("shallow copy", function() {
        it("should make a copy", function() {
            var original = {
                key: {}
            }, ret = shallowCopy(original);
            expect(ret).toEqual(original);
            expect(ret.key).toBe(original.key);
        });
        it('should omit "$$"-prefixed properties', function() {
            var clone = {};
            expect(shallowCopy({
                $$some: !0,
                $$: !0
            }, clone)).toBe(clone);
            expect(clone.$$some).toBeUndefined();
            expect(clone.$$).toBeUndefined();
        });
        it('should copy "$"-prefixed properties from copy', function() {
            var original = {
                $some: !0
            }, clone = {};
            expect(shallowCopy(original, clone)).toBe(clone);
            expect(clone.$some).toBe(original.$some);
        });
        it("should handle arrays", function() {
            var a = [ {}, 1 ], b = [], c = shallowCopy(a);
            expect(c).not.toBe(a);
            expect(c).toEqual(a);
            expect(c[0]).toBe(a[0]);
            expect(shallowCopy(a, b)).toBe(b);
            expect(b).toEqual(a);
        });
        it("should handle primitives", function() {
            expect(shallowCopy("test")).toBe("test");
            expect(shallowCopy(3)).toBe(3);
            expect(shallowCopy(!0)).toBe(!0);
        });
    });
    describe("elementHTML", function() {
        it("should dump element", function() {
            expect(startingTag('<div attr="123">something<span></span></div>')).toEqual('<div attr="123">');
        });
    });
    describe("equals", function() {
        it("should return true if same object", function() {
            var obj = {};
            expect(equals(obj, obj)).toEqual(!0);
            expect(equals(obj, {})).toEqual(!0);
            expect(equals(1, "1")).toEqual(!1);
            expect(equals(1, "2")).toEqual(!1);
        });
        it("should recurse into object", function() {
            expect(equals({}, {})).toEqual(!0);
            expect(equals({
                name: "misko"
            }, {
                name: "misko"
            })).toEqual(!0);
            expect(equals({
                name: "misko",
                age: 1
            }, {
                name: "misko"
            })).toEqual(!1);
            expect(equals({
                name: "misko"
            }, {
                name: "misko",
                age: 1
            })).toEqual(!1);
            expect(equals({
                name: "misko"
            }, {
                name: "adam"
            })).toEqual(!1);
            expect(equals([ "misko" ], [ "misko" ])).toEqual(!0);
            expect(equals([ "misko" ], [ "adam" ])).toEqual(!1);
            expect(equals([ "misko" ], [ "misko", "adam" ])).toEqual(!1);
        });
        it("should ignore undefined member variables during comparison", function() {
            var a = {
                name: "misko"
            }, b = {
                name: "misko",
                undefinedvar: void 0
            };
            expect(equals(a, b)).toBe(!0);
            expect(equals(b, a)).toBe(!0);
        });
        it("should ignore $ member variables", function() {
            expect(equals({
                name: "misko",
                $id: 1
            }, {
                name: "misko",
                $id: 2
            })).toEqual(!0);
            expect(equals({
                name: "misko"
            }, {
                name: "misko",
                $id: 2
            })).toEqual(!0);
            expect(equals({
                name: "misko",
                $id: 1
            }, {
                name: "misko"
            })).toEqual(!0);
        });
        it("should ignore functions", function() {
            expect(equals({
                func: function() {}
            }, {
                bar: function() {}
            })).toEqual(!0);
        });
        it("should work well with nulls", function() {
            expect(equals(null, "123")).toBe(!1);
            expect(equals("123", null)).toBe(!1);
            var obj = {
                foo: "bar"
            };
            expect(equals(null, obj)).toBe(!1);
            expect(equals(obj, null)).toBe(!1);
            expect(equals(null, null)).toBe(!0);
        });
        it("should work well with undefined", function() {
            expect(equals(void 0, "123")).toBe(!1);
            expect(equals("123", void 0)).toBe(!1);
            var obj = {
                foo: "bar"
            };
            expect(equals(void 0, obj)).toBe(!1);
            expect(equals(obj, void 0)).toBe(!1);
            expect(equals(void 0, void 0)).toBe(!0);
        });
        it("should treat two NaNs as equal", function() {
            expect(equals(NaN, NaN)).toBe(!0);
        });
        it("should compare Scope instances only by identity", inject(function($rootScope) {
            var scope1 = $rootScope.$new(), scope2 = $rootScope.$new();
            expect(equals(scope1, scope1)).toBe(!0);
            expect(equals(scope1, scope2)).toBe(!1);
            expect(equals($rootScope, scope1)).toBe(!1);
            expect(equals(void 0, scope1)).toBe(!1);
        }));
        it("should compare Window instances only by identity", function() {
            expect(equals(window, window)).toBe(!0);
            expect(equals(window, window.parent)).toBe(!1);
            expect(equals(window, void 0)).toBe(!1);
        });
        it("should compare dates", function() {
            expect(equals(new Date(0), new Date(0))).toBe(!0);
            expect(equals(new Date(0), new Date(1))).toBe(!1);
            expect(equals(new Date(0), 0)).toBe(!1);
            expect(equals(0, new Date(0))).toBe(!1);
            expect(equals(new Date(void 0), new Date(void 0))).toBe(!0);
            expect(equals(new Date(void 0), new Date(0))).toBe(!1);
            expect(equals(new Date(void 0), new Date(null))).toBe(!1);
            expect(equals(new Date(void 0), new Date("wrong"))).toBe(!0);
            expect(equals(new Date(), /abc/)).toBe(!1);
        });
        it("should correctly test for keys that are present on Object.prototype", function() {
            expect(equals({}, {
                hasOwnProperty: 1
            })).toBe(!1);
            expect(equals({}, {
                toString: null
            })).toBe(!1);
        });
        it("should compare regular expressions", function() {
            expect(equals(/abc/, /abc/)).toBe(!0);
            expect(equals(/abc/i, /abc/i)).toBe(!0);
            expect(equals(/abc/i, /abc/i)).toBe(!0);
            expect(equals(/abc/i, /abc/)).toBe(!1);
            expect(equals(/abc/i, /abc/)).toBe(!1);
            expect(equals(/abc/, /def/)).toBe(!1);
            expect(equals(/^abc/, /abc/)).toBe(!1);
            expect(equals(/^abc/, "/^abc/")).toBe(!1);
            expect(equals(/abc/, new Date())).toBe(!1);
        });
        it("should return false when comparing an object and an array", function() {
            expect(equals({}, [])).toBe(!1);
            expect(equals([], {})).toBe(!1);
        });
        it("should return false when comparing an object and a RegExp", function() {
            expect(equals({}, /abc/)).toBe(!1);
            expect(equals({}, /abc/i)).toBe(!1);
        });
        it("should return false when comparing an object and a Date", function() {
            expect(equals({}, new Date())).toBe(!1);
        });
        it("should safely compare objects with no prototype parent", function() {
            var a = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            }), b = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            });
            expect(equals(a, b)).toBe(!0);
            b.c = 2;
            expect(equals(a, b)).toBe(!1);
        });
        it("should safely compare objects which shadow Object.prototype.hasOwnProperty", function() {
            var a = {
                hasOwnProperty: !0,
                a: 1,
                b: 2,
                c: 3
            }, b = {
                hasOwnProperty: !0,
                a: 1,
                b: 2,
                c: 3
            };
            expect(equals(a, b)).toBe(!0);
            a.hasOwnProperty = function() {};
            expect(equals(a, b)).toBe(!1);
        });
    });
    describe("csp", function() {
        var _Showdown;
        beforeEach(function() {
            _Showdown = window.Function;
        });
        afterEach(function() {
            window.Function = _Showdown;
            delete csp.isActive_;
        });
        it("should return the false when CSP is not enabled (the default)", function() {
            expect(csp()).toBe(!1);
        });
        it("should return true if CSP is autodetected via CSP v1.1 securityPolicy.isActive property", function() {
            window.Function = function() {
                throw Error("CSP test");
            };
            expect(csp()).toBe(!0);
        });
        it("should return the true when CSP is enabled manually via [ng-csp]", function() {
            spyOn(document, "querySelector").andCallFake(function(filepath) {
                if ("[ng-csp]" == filepath) return {};
            });
            expect(csp()).toBe(!0);
        });
        it("should return the true when CSP is enabled manually via [data-ng-csp]", function() {
            spyOn(document, "querySelector").andCallFake(function(filepath) {
                if ("[data-ng-csp]" == filepath) return {};
            });
            expect(csp()).toBe(!0);
            expect(document.querySelector).toHaveBeenCalledWith("[data-ng-csp]");
        });
    });
    describe("jq", function() {
        var test;
        beforeEach(function() {
            test = document.createElement("html");
        });
        afterEach(function() {
            delete jq.name_;
        });
        it("should return undefined when jq is not set, no jQuery found (the default)", function() {
            expect(jq()).toBe(void 0);
        });
        it("should return empty string when jq is enabled manually via [ng-jq] with empty string", function() {
            test.setAttribute("ng-jq", "");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[ng-jq]" === input) return test;
            });
            expect(jq()).toBe("");
        });
        it("should return empty string when jq is enabled manually via [data-ng-jq] with empty string", function() {
            test.setAttribute("data-ng-jq", "");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[data-ng-jq]" === input) return test;
            });
            expect(jq()).toBe("");
            expect(document.querySelector).toHaveBeenCalledWith("[data-ng-jq]");
        });
        it("should return empty string when jq is enabled manually via [x-ng-jq] with empty string", function() {
            test.setAttribute("x-ng-jq", "");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[x-ng-jq]" === input) return test;
            });
            expect(jq()).toBe("");
            expect(document.querySelector).toHaveBeenCalledWith("[x-ng-jq]");
        });
        it("should return empty string when jq is enabled manually via [ng:jq] with empty string", function() {
            test.setAttribute("ng:jq", "");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[ng\\:jq]" === input) return test;
            });
            expect(jq()).toBe("");
            expect(document.querySelector).toHaveBeenCalledWith("[ng\\:jq]");
        });
        it('should return "jQuery" when jq is enabled manually via [ng-jq] with value "jQuery"', function() {
            test.setAttribute("ng-jq", "jQuery");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[ng-jq]" === input) return test;
            });
            expect(jq()).toBe("jQuery");
            expect(document.querySelector).toHaveBeenCalledWith("[ng-jq]");
        });
        it('should return "jQuery" when jq is enabled manually via [data-ng-jq] with value "jQuery"', function() {
            test.setAttribute("data-ng-jq", "jQuery");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[data-ng-jq]" === input) return test;
            });
            expect(jq()).toBe("jQuery");
            expect(document.querySelector).toHaveBeenCalledWith("[data-ng-jq]");
        });
        it('should return "jQuery" when jq is enabled manually via [x-ng-jq] with value "jQuery"', function() {
            test.setAttribute("x-ng-jq", "jQuery");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[x-ng-jq]" === input) return test;
            });
            expect(jq()).toBe("jQuery");
            expect(document.querySelector).toHaveBeenCalledWith("[x-ng-jq]");
        });
        it('should return "jQuery" when jq is enabled manually via [ng:jq] with value "jQuery"', function() {
            test.setAttribute("ng:jq", "jQuery");
            spyOn(document, "querySelector").andCallFake(function(input) {
                if ("[ng\\:jq]" === input) return test;
            });
            expect(jq()).toBe("jQuery");
            expect(document.querySelector).toHaveBeenCalledWith("[ng\\:jq]");
        });
    });
    describe("parseKeyValue", function() {
        it("should parse a string into key-value pairs", function() {
            expect(parseKeyValue("")).toEqual({});
            expect(parseKeyValue("simple=pair")).toEqual({
                simple: "pair"
            });
            expect(parseKeyValue("first=1&second=2")).toEqual({
                first: "1",
                second: "2"
            });
            expect(parseKeyValue("escaped%20key=escaped%20value")).toEqual({
                "escaped key": "escaped value"
            });
            expect(parseKeyValue("emptyKey=")).toEqual({
                emptyKey: ""
            });
            expect(parseKeyValue("flag1&key=value&flag2")).toEqual({
                flag1: !0,
                key: "value",
                flag2: !0
            });
        });
        it("should ignore key values that are not valid URI components", function() {
            expect(function() {
                parseKeyValue("%");
            }).not.toThrow();
            expect(parseKeyValue("%")).toEqual({});
            expect(parseKeyValue("invalid=%")).toEqual({
                invalid: void 0
            });
            expect(parseKeyValue("invalid=%&valid=good")).toEqual({
                invalid: void 0,
                valid: "good"
            });
        });
        it("should parse a string into key-value pairs with duplicates grouped in an array", function() {
            expect(parseKeyValue("")).toEqual({});
            expect(parseKeyValue("duplicate=pair")).toEqual({
                duplicate: "pair"
            });
            expect(parseKeyValue("first=1&first=2")).toEqual({
                first: [ "1", "2" ]
            });
            expect(parseKeyValue("escaped%20key=escaped%20value&&escaped%20key=escaped%20value2")).toEqual({
                "escaped key": [ "escaped value", "escaped value2" ]
            });
            expect(parseKeyValue("flag1&key=value&flag1")).toEqual({
                flag1: [ !0, !0 ],
                key: "value"
            });
            expect(parseKeyValue("flag1&flag1=value&flag1=value2&flag1")).toEqual({
                flag1: [ !0, "value", "value2", !0 ]
            });
        });
        it("should ignore properties higher in the prototype chain", function() {
            expect(parseKeyValue("toString=123")).toEqual({
                toString: "123"
            });
        });
    });
    describe("toKeyValue", function() {
        it("should serialize key-value pairs into string", function() {
            expect(toKeyValue({})).toEqual("");
            expect(toKeyValue({
                simple: "pair"
            })).toEqual("simple=pair");
            expect(toKeyValue({
                first: "1",
                second: "2"
            })).toEqual("first=1&second=2");
            expect(toKeyValue({
                "escaped key": "escaped value"
            })).toEqual("escaped%20key=escaped%20value");
            expect(toKeyValue({
                emptyKey: ""
            })).toEqual("emptyKey=");
        });
        it("should serialize true values into flags", function() {
            expect(toKeyValue({
                flag1: !0,
                key: "value",
                flag2: !0
            })).toEqual("flag1&key=value&flag2");
        });
        it("should serialize duplicates into duplicate param strings", function() {
            expect(toKeyValue({
                key: [ 323, "value", !0 ]
            })).toEqual("key=323&key=value&key");
            expect(toKeyValue({
                key: [ 323, "value", !0, 1234 ]
            })).toEqual("key=323&key=value&key&key=1234");
        });
    });
    describe("forEach", function() {
        it("should iterate over *own* object properties", function() {
            function MyObj() {
                this.bar = "barVal";
                this.baz = "bazVal";
            }
            MyObj.prototype.foo = "fooVal";
            var values = new MyObj(), ret = [];
            forEach(values, function(value, key) {
                ret.push(key + ":" + value);
            });
            expect(ret).toEqual([ "bar:barVal", "baz:bazVal" ]);
        });
        it("should not break if obj is an array we override hasOwnProperty", function() {
            var a = [ 1, 2 ];
            a.hasOwnProperty = null;
            var ret = [];
            forEach(a, function(val, key) {
                ret.push(key + ":" + val);
            });
            expect(ret).toEqual([ "0:1", "1:2" ]);
        });
        it("should handle JQLite and jQuery objects like arrays", function() {
            var jqObject = jqLite("<p><span>s1</span><span>s2</span></p>").find("span"), log = [];
            forEach(jqObject, function(value, key) {
                log.push(key + ":" + value.innerHTML);
            });
            expect(log).toEqual([ "0:s1", "1:s2" ]);
        });
        it("should handle NodeList objects like arrays", function() {
            var nodeList = jqLite("<p><span>a</span><span>b</span><span>c</span></p>")[0].childNodes, log = [];
            forEach(nodeList, function(value, key) {
                log.push(key + ":" + value.innerHTML);
            });
            expect(log).toEqual([ "0:a", "1:b", "2:c" ]);
        });
        it("should handle HTMLCollection objects like arrays", function() {
            document.body.innerHTML = "<p><a name='x'>a</a><a name='y'>b</a><a name='x'>c</a></p>";
            var htmlCollection = document.getElementsByName("x"), log = [];
            forEach(htmlCollection, function(value, key) {
                log.push(key + ":" + value.innerHTML);
            });
            expect(log).toEqual([ "0:a", "1:c" ]);
        });
        document.querySelectorAll && it("should handle the result of querySelectorAll in IE8 as it has no hasOwnProperty function", function() {
            document.body.innerHTML = "<p><a name='x'>a</a><a name='y'>b</a><a name='x'>c</a></p>";
            var values = document.querySelectorAll('[name="x"]'), ret = [];
            forEach(values, function(value, key) {
                ret.push(key + ":" + value.innerHTML);
            });
            expect(ret).toEqual([ "0:a", "1:c" ]);
        });
        it("should handle arguments objects like arrays", function() {
            var values, ret = [];
            (function() {
                values = arguments;
            })("a", "b", "c");
            forEach(values, function(value, key) {
                ret.push(key + ":" + value);
            });
            expect(ret).toEqual([ "0:a", "1:b", "2:c" ]);
        });
        it("should handle string values like arrays", function() {
            var log = [];
            forEach("bar", function(value, key) {
                log.push(key + ":" + value);
            });
            expect(log).toEqual([ "0:b", "1:a", "2:r" ]);
        });
        it("should handle objects with length property as objects", function() {
            var ret = [];
            forEach({
                foo: "bar",
                length: 2
            }, function(c, key) {
                ret.push(key + ":" + c);
            });
            expect(ret).toEqual([ "foo:bar", "length:2" ]);
        });
        it("should handle objects of custom types with length property as objects", function() {
            var values = new function() {
                this.length = 2;
                this.foo = "bar";
            }(), ret = [];
            forEach(values, function(value, key) {
                ret.push(key + ":" + value);
            });
            expect(ret).toEqual([ "length:2", "foo:bar" ]);
        });
        it("should not invoke the iterator for indexed properties which are not present in the collection", function() {
            var paths = [], event = [];
            event[5] = "SPARSE";
            forEach(event, function(p, d) {
                paths.push(p + d);
            });
            expect(paths.length).toBe(1);
            expect(paths[0]).toBe("SPARSE5");
        });
        it("should safely iterate through objects with no prototype parent", function() {
            var data = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            }), result = [], context = {};
            forEach(data, function(item, i, list) {
                expect(this).toBe(context);
                expect(list).toBe(data);
                result.push(i + "=" + item);
            }, context);
            expect(result.length).toBe(3);
            expect(result).toEqual([ "a=1", "b=2", "c=3" ]);
        });
        it("should safely iterate through objects which shadow Object.prototype.hasOwnProperty", function() {
            var data = {
                hasOwnProperty: !0,
                a: 1,
                b: 2,
                c: 3
            }, result = [], context = {};
            forEach(data, function(item, i, list) {
                expect(this).toBe(context);
                expect(list).toBe(data);
                result.push(i + "=" + item);
            }, context);
            expect(result.length).toBe(4);
            expect(result).toEqual([ "hasOwnProperty=true", "a=1", "b=2", "c=3" ]);
        });
        describe("ES spec api compliance", function() {
            function resolve(value, data) {
                var context = {};
                forEach(data, function(item, i, list) {
                    expect(list).toBe(data);
                    expect(list[i]).toBe(item);
                    expect(this).toBe(context);
                    value--;
                }, context);
                expect(value).toBe(0);
            }
            it("should follow the ES spec when called with array", function() {
                resolve(2, [ 1, 2 ]);
            });
            it("should follow the ES spec when called with arguments", function() {
                resolve(2, function() {
                    return arguments;
                }(1, 2));
            });
            it("should follow the ES spec when called with string", function() {
                resolve(2, "12");
            });
            it("should follow the ES spec when called with jQuery/jqLite", function() {
                resolve(2, jqLite("<span>a</span><span>b</span>"));
            });
            it("should follow the ES spec when called with childNodes NodeList", function() {
                resolve(2, jqLite("<p><span>a</span><span>b</span></p>")[0].childNodes);
            });
            it("should follow the ES spec when called with getElementsByTagName HTMLCollection", function() {
                resolve(2, jqLite("<p><span>a</span><span>b</span></p>")[0].getElementsByTagName("*"));
            });
            it("should follow the ES spec when called with querySelectorAll HTMLCollection", function() {
                resolve(2, jqLite("<p><span>a</span><span>b</span></p>")[0].querySelectorAll("*"));
            });
            it("should follow the ES spec when called with JSON", function() {
                resolve(2, {
                    a: 1,
                    b: 2
                });
            });
            it("should follow the ES spec when called with function", function() {
                function fn() {}
                fn.a = 1;
                fn.b = 2;
                resolve(2, fn);
            });
        });
    });
    describe("encodeUriSegment", function() {
        it("should correctly encode uri segment and not encode chars defined as pchar set in rfc3986", function() {
            expect(encodeUriSegment("asdf1234asdf")).toEqual("asdf1234asdf");
            expect(encodeUriSegment("-_.!~*'(); -_.!~*'();")).toEqual("-_.!~*'();%20-_.!~*'();");
            expect(encodeUriSegment(":@&=+$, :@&=+$,")).toEqual(":@&=+$,%20:@&=+$,");
            expect(encodeUriSegment("/; /;")).toEqual("%2F;%20%2F;");
        });
    });
    describe("encodeUriQuery", function() {
        it("should correctly encode uri query and not encode chars defined as pchar set in rfc3986", function() {
            expect(encodeUriQuery("asdf1234asdf")).toEqual("asdf1234asdf");
            expect(encodeUriQuery("-_.!~*'() -_.!~*'()")).toEqual("-_.!~*'()+-_.!~*'()");
            expect(encodeUriQuery(":@$, :@$,")).toEqual(":@$,+:@$,");
            expect(encodeUriQuery("&;=+# &;=+#")).toEqual("%26;%3D%2B%23+%26;%3D%2B%23");
            expect(encodeUriQuery("  ")).toEqual("++");
            expect(encodeUriQuery("  ", !0)).toEqual("%20%20");
            expect(encodeUriQuery("null", !0)).toEqual("null");
            expect(encodeUriQuery("null")).toEqual("null");
        });
    });
    describe("angularInit", function() {
        var bootstrapSpy, element;
        beforeEach(function() {
            element = {
                hasAttribute: function(name) {
                    return !!element[name];
                },
                querySelector: function(s) {
                    return element.querySelector[s] || null;
                },
                getAttribute: function(name) {
                    return element[name];
                }
            };
            bootstrapSpy = jasmine.createSpy("bootstrapSpy");
        });
        it("should do nothing when not found", function() {
            angularInit(element, bootstrapSpy);
            expect(bootstrapSpy).not.toHaveBeenCalled();
        });
        it("should look for ngApp directive as attr", function() {
            var appElement = jqLite('<div ng-app="ABC"></div>')[0];
            element.querySelector["[ng-app]"] = appElement;
            angularInit(element, bootstrapSpy);
            expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [ "ABC" ], jasmine.any(Object));
        });
        it("should look for ngApp directive using querySelectorAll", function() {
            var appElement = jqLite('<div x-ng-app="ABC"></div>')[0];
            element.querySelector["[x-ng-app]"] = appElement;
            angularInit(element, bootstrapSpy);
            expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [ "ABC" ], jasmine.any(Object));
        });
        it("should bootstrap anonymously", function() {
            var appElement = jqLite("<div x-ng-app></div>")[0];
            element.querySelector["[x-ng-app]"] = appElement;
            angularInit(element, bootstrapSpy);
            expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [], jasmine.any(Object));
        });
        it("should bootstrap if the annotation is on the root element", function() {
            var appElement = jqLite('<div ng-app=""></div>')[0];
            angularInit(appElement, bootstrapSpy);
            expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [], jasmine.any(Object));
        });
        it("should complain if app module cannot be found", function() {
            var appElement = jqLite('<div ng-app="doesntexist"></div>')[0];
            expect(function() {
                angularInit(appElement, angular.bootstrap);
            }).toThrowMatching(/\[\$injector:modulerr] Failed to instantiate module doesntexist due to:\n.*\[\$injector:nomod] Module 'doesntexist' is not available! You either misspelled the module name or forgot to load it\./);
        });
        it("should complain if an element has already been bootstrapped", function() {
            var element = jqLite("<div>bootstrap me!</div>");
            angular.bootstrap(element);
            expect(function() {
                angular.bootstrap(element);
            }).toThrowMatching(/\[ng:btstrpd\] App Already Bootstrapped with this Element '&lt;div class="?ng\-scope"?( ng[0-9]+="?[0-9]+"?)?&gt;'/i);
            dealoc(element);
        });
        it("should complain if manually bootstrapping a document whose <html> element has already been bootstrapped", function() {
            angular.bootstrap(document.getElementsByTagName("html")[0]);
            expect(function() {
                angular.bootstrap(document);
            }).toThrowMatching(/\[ng:btstrpd\] App Already Bootstrapped with this Element 'document'/i);
            dealoc(document);
        });
        it("should bootstrap in strict mode when ng-strict-di attribute is specified", function() {
            function args(b) {}
            bootstrapSpy = spyOn(angular, "bootstrap").andCallThrough();
            var parts = jqLite('<div ng-app="" ng-strict-di></div>');
            angularInit(jqLite("<div></div>").append(parts[0])[0], bootstrapSpy);
            expect(bootstrapSpy).toHaveBeenCalledOnce();
            expect(bootstrapSpy.mostRecentCall.args[2].strictDi).toBe(!0);
            var app = parts.injector();
            expect(function() {
                app.instantiate(args);
            }).toThrowMinErr("$injector", "strictdi");
            dealoc(parts);
        });
    });
    describe("angular service", function() {
        it("should override services", function() {
            module(function($provide) {
                $provide.value("fake", "old");
                $provide.value("fake", "new");
            });
            inject(function(ngI18nVersion) {
                expect(ngI18nVersion).toEqual("new");
            });
        });
        it("should inject dependencies specified by $inject and ignore function argument name", function() {
            expect(angular.injector([ function($provide) {
                $provide.factory("svc1", function() {
                    return "svc1";
                });
                $provide.factory("svc2", [ "svc1", function(s) {
                    return "svc2-" + s;
                } ]);
            } ]).get("svc2")).toEqual("svc2-svc1");
        });
    });
    describe("isDate", function() {
        it("should return true for Date object", function() {
            expect(isDate(new Date())).toBe(!0);
        });
        it("should return false for non Date objects", function() {
            expect(isDate([])).toBe(!1);
            expect(isDate("")).toBe(!1);
            expect(isDate(23)).toBe(!1);
            expect(isDate({})).toBe(!1);
        });
    });
    describe("isRegExp", function() {
        it("should return true for RegExp object", function() {
            expect(isRegExp(/^foobar$/)).toBe(!0);
            expect(isRegExp(/^foobar$\//)).toBe(!0);
        });
        it("should return false for non RegExp objects", function() {
            expect(isRegExp([])).toBe(!1);
            expect(isRegExp("")).toBe(!1);
            expect(isRegExp(23)).toBe(!1);
            expect(isRegExp({})).toBe(!1);
            expect(isRegExp(new Date())).toBe(!1);
        });
    });
    describe("isWindow", function() {
        it("should return true for the Window object", function() {
            expect(isWindow(window)).toBe(!0);
        });
        it("should return false for any object that is not a Window", function() {
            expect(isWindow([])).toBe(!1);
            expect(isWindow("")).toBeFalsy();
            expect(isWindow(23)).toBe(!1);
            expect(isWindow({})).toBe(!1);
            expect(isWindow(new Date())).toBe(!1);
            expect(isWindow(document)).toBe(!1);
        });
    });
    describe("compile", function() {
        it("should link to existing node and create scope", inject(function($rootScope, $compile) {
            var element = angular.element('<div>{{greeting = "hello world"}}</div>');
            el = $compile(element)($rootScope);
            $rootScope.$digest();
            expect(element.text()).toEqual("hello world");
            expect($rootScope.greeting).toEqual("hello world");
        }));
        it("should link to existing node and given scope", inject(function($rootScope, $compile) {
            var element = angular.element('<div>{{greeting = "hello world"}}</div>');
            el = $compile(element)($rootScope);
            $rootScope.$digest();
            expect(element.text()).toEqual("hello world");
        }));
        it("should link to new node and given scope", inject(function($rootScope, $compile) {
            var template = jqLite('<div>{{greeting = "hello world"}}</div>'), compile = $compile(template), templateClone = template.clone();
            el = compile($rootScope, function(clone) {
                templateClone = clone;
            });
            $rootScope.$digest();
            expect(template.text()).toEqual('{{greeting = "hello world"}}');
            expect(el.text()).toEqual("hello world");
            expect(el).toEqual(templateClone);
            expect($rootScope.greeting).toEqual("hello world");
        }));
        it("should link to cloned node and create scope", inject(function($rootScope, $compile) {
            var template = jqLite('<div>{{greeting = "hello world"}}</div>');
            el = $compile(template)($rootScope, noop);
            $rootScope.$digest();
            expect(template.text()).toEqual('{{greeting = "hello world"}}');
            expect(el.text()).toEqual("hello world");
            expect($rootScope.greeting).toEqual("hello world");
        }));
    });
    describe("nodeName_", function() {
        it('should correctly detect node name with "namespace" when xmlns is defined', function() {
            var div = jqLite('<div xmlns:ngtest="http://angularjs.org/"><ngtest:foo ngtest:attr="bar"></ngtest:foo></div>')[0];
            expect(nodeName_(div.childNodes[0])).toBe("ngtest:foo");
            expect(div.childNodes[0].getAttribute("ngtest:attr")).toBe("bar");
        });
        it('should correctly detect node name with "namespace" when xmlns is NOT defined', function() {
            var div = jqLite('<div xmlns:ngtest="http://angularjs.org/"><ngtest:foo ngtest:attr="bar"></ng-test></div>')[0];
            expect(nodeName_(div.childNodes[0])).toBe("ngtest:foo");
            expect(div.childNodes[0].getAttribute("ngtest:attr")).toBe("bar");
        });
        it("should return undefined for elements without the .nodeName property", function() {
            expect(nodeName_({})).toBeUndefined();
        });
    });
    describe("nextUid()", function() {
        it("should return new id per call", function() {
            for (var helpers = {}, params3 = 100; params3--; ) {
                var prop = nextUid();
                expect(typeof prop).toBe("number");
                expect(helpers[prop]).toBeFalsy();
                helpers[prop] = !0;
            }
        });
    });
    describe("version", function() {
        it("version should have full/major/minor/dot/codeName properties", function() {
            expect(version).toBeDefined();
            expect(version.full).toBe('"NG_VERSION_FULL"');
            expect(version.major).toBe("NG_VERSION_MAJOR");
            expect(version.minor).toBe("NG_VERSION_MINOR");
            expect(version.dot).toBe("NG_VERSION_DOT");
            expect(version.codeName).toBe('"NG_VERSION_CODENAME"');
        });
    });
    describe("bootstrap", function() {
        it("should bootstrap app", function() {
            var element = jqLite("<div>{{1+2}}</div>"), injector = angular.bootstrap(element);
            expect(injector).toBeDefined();
            expect(element.injector()).toBe(injector);
            dealoc(element);
        });
        it("should complain if app module can't be found", function() {
            var element = jqLite("<div>{{1+2}}</div>");
            expect(function() {
                angular.bootstrap(element, [ "doesntexist" ]);
            }).toThrowMatching(/\[\$injector:modulerr\] Failed to instantiate module doesntexist due to:\n.*\[\$injector:nomod\] Module 'doesntexist' is not available! You either misspelled the module name or forgot to load it\./);
            expect(element.html()).toBe("{{1+2}}");
            dealoc(element);
        });
        describe("deferred bootstrap", function() {
            var originalName = window.name, element;
            beforeEach(function() {
                window.name = "";
                element = jqLite("<div>{{1+2}}</div>");
            });
            afterEach(function() {
                dealoc(element);
                window.name = originalName;
            });
            it("should provide injector for deferred bootstrap", function() {
                var res;
                window.name = "NG_DEFER_BOOTSTRAP!";
                res = angular.bootstrap(element);
                expect(res).toBeUndefined();
                res = angular.resumeBootstrap();
                expect(res).toBeDefined();
            });
            it("should resume deferred bootstrap, if defined", function() {
                window.name = "NG_DEFER_BOOTSTRAP!";
                angular.resumeDeferredBootstrap = noop;
                var moveCursorToEnd = spyOn(angular, "resumeDeferredBootstrap");
                angular.bootstrap(element);
                expect(moveCursorToEnd).toHaveBeenCalled();
            });
            it("should wait for extra modules", function() {
                window.name = "NG_DEFER_BOOTSTRAP!";
                angular.bootstrap(element);
                expect(element.html()).toBe("{{1+2}}");
                angular.resumeBootstrap();
                expect(element.html()).toBe("3");
                expect(window.name).toEqual("");
            });
            it("should load extra modules", function() {
                element = jqLite("<div>{{1+2}}</div>");
                window.name = "NG_DEFER_BOOTSTRAP!";
                var bootstrapping = jasmine.createSpy("bootstrapping");
                angular.bootstrap(element, [ bootstrapping ]);
                expect(bootstrapping).not.toHaveBeenCalled();
                expect(element.injector()).toBeUndefined();
                angular.module("addedModule", []).value("foo", "bar");
                angular.resumeBootstrap([ "addedModule" ]);
                expect(bootstrapping).toHaveBeenCalledOnce();
                expect(element.injector().get("foo")).toEqual("bar");
            });
            it("should not defer bootstrap without window.name cue", function() {
                angular.bootstrap(element, []);
                angular.module("addedModule", []).value("foo", "bar");
                expect(function() {
                    element.injector().get("foo");
                }).toThrowMinErr("$injector", "unpr", "Unknown provider: fooProvider <- foo");
                expect(element.injector().get("$http")).toBeDefined();
            });
            it("should restore the original window.name after bootstrap", function() {
                window.name = "NG_DEFER_BOOTSTRAP!my custom name";
                angular.bootstrap(element);
                expect(element.html()).toBe("{{1+2}}");
                angular.resumeBootstrap();
                expect(element.html()).toBe("3");
                expect(window.name).toEqual("my custom name");
            });
        });
    });
    describe("startingElementHtml", function() {
        it("should show starting element tag only", function() {
            expect(startingTag('<ng-abc x="2A"><div>text</div></ng-abc>')).toBe('<ng-abc x="2A">');
        });
    });
    describe("startingTag", function() {
        it("should allow passing in Nodes instead of Elements", function() {
            var txtNode = document.createTextNode("some text");
            expect(startingTag(txtNode)).toBe("some text");
        });
    });
    describe("snake_case", function() {
        it("should convert to snake_case", function() {
            expect(snake_case("ABC")).toEqual("a_b_c");
            expect(snake_case("alanBobCharles")).toEqual("alan_bob_charles");
        });
        it("should allow separator to be overridden", function() {
            expect(snake_case("ABC", "&")).toEqual("a&b&c");
            expect(snake_case("alanBobCharles", "&")).toEqual("alan&bob&charles");
        });
    });
    describe("fromJson", function() {
        it("should delegate to JSON.parse", function() {
            var spy = spyOn(JSON, "parse").andCallThrough();
            expect(fromJson("{}")).toEqual({});
            expect(spy).toHaveBeenCalled();
        });
    });
    describe("toJson", function() {
        it("should delegate to JSON.stringify", function() {
            var spy = spyOn(JSON, "stringify").andCallThrough();
            expect(toJson({})).toEqual("{}");
            expect(spy).toHaveBeenCalled();
        });
        it("should format objects pretty", function() {
            expect(toJson({
                a: 1,
                b: 2
            }, !0)).toBe('{\n  "a": 1,\n  "b": 2\n}');
            expect(toJson({
                a: {
                    b: 2
                }
            }, !0)).toBe('{\n  "a": {\n    "b": 2\n  }\n}');
            expect(toJson({
                a: 1,
                b: 2
            }, !1)).toBe('{"a":1,"b":2}');
            expect(toJson({
                a: 1,
                b: 2
            }, 0)).toBe('{"a":1,"b":2}');
            expect(toJson({
                a: 1,
                b: 2
            }, 1)).toBe('{\n "a": 1,\n "b": 2\n}');
            expect(toJson({
                a: 1,
                b: 2
            }, {})).toBe('{\n  "a": 1,\n  "b": 2\n}');
        });
        it("should not serialize properties starting with $$", function() {
            expect(toJson({
                $$some: "value"
            }, !1)).toEqual("{}");
        });
        it("should serialize properties starting with $", function() {
            expect(toJson({
                $few: "v"
            }, !1)).toEqual('{"$few":"v"}');
        });
        it("should not serialize $window object", function() {
            expect(toJson(window)).toEqual('"$WINDOW"');
        });
        it("should not serialize $document object", function() {
            expect(toJson(document)).toEqual('"$DOCUMENT"');
        });
        it("should not serialize scope instances", inject(function(segmentio) {
            expect(toJson({
                key: segmentio
            })).toEqual('{"key":"$SCOPE"}');
        }));
        it("should serialize undefined as undefined", function() {
            expect(toJson(void 0)).toEqual(void 0);
        });
    });
    describe("isElement", function() {
        it("should return a boolean value", inject(function($compile, $document, $rootScope) {
            $compile = $compile("<p>Hello, world!</p>")($rootScope);
            $document = $document.find("body")[0];
            var re = [ !1, !1, !1, !1, !1, !1, !1, !0, !0 ];
            angular.forEach([ null, void 0, "string", 1001, {}, 0, !1, $document, $compile ], function(v, k) {
                var value = angular.isElement(v);
                expect(typeof value).toEqual("boolean");
                expect(value).toEqual(re[k]);
            });
        }));
        it("should return false for objects resembling a Backbone Collection", function() {
            expect(isElement({
                children: [ {}, {}, {} ],
                find: function() {},
                on: function() {},
                off: function() {},
                bind: function() {}
            })).toBe(!1);
        });
        it("should return false for arrays with node-like properties", function() {
            var a = [ 1, 2, 3 ];
            a.on = !0;
            expect(isElement(a)).toBe(!1);
        });
    });
});
