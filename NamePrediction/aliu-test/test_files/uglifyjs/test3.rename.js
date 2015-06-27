"use strict";

describe("angular", function() {
    var el;
    afterEach(function() {
        dealoc(el);
    }), describe("case", function() {
        it("should change case", function() {
            expect(lowercase("ABC90")).toEqual("abc90"), expect(manualLowercase("ABC90")).toEqual("abc90"), 
            expect(uppercase("abc90")).toEqual("ABC90"), expect(manualUppercase("abc90")).toEqual("ABC90");
        });
    }), describe("copy", function() {
        it("should return same object", function() {
            var obj = {}, foo = [];
            expect(copy({}, obj)).toBe(obj), expect(copy([], foo)).toBe(foo);
        }), it("should preserve prototype chaining", function() {
            var result = {}, properties = Object.create(result), values = Object.create(properties);
            expect(properties.isPrototypeOf(copy(values))).toBe(!0), expect(result.isPrototypeOf(copy(values))).toBe(!0);
            var Foo = function() {};
            expect(copy(new Foo()) instanceof Foo).toBe(!0);
        }), it("should copy Date", function() {
            var date = new Date(123);
            expect(copy(date) instanceof Date).toBeTruthy(), expect(copy(date).getTime()).toEqual(123), 
            expect(copy(date) === date).toBeFalsy();
        }), it("should copy RegExp", function() {
            var re = new RegExp(".*");
            expect(copy(re) instanceof RegExp).toBeTruthy(), expect(copy(re).source).toBe(".*"), 
            expect(copy(re) === re).toBe(!1);
        }), it("should copy literal RegExp", function() {
            var re = /.*/;
            expect(copy(re) instanceof RegExp).toBeTruthy(), expect(copy(re).source).toEqual(".*"), 
            expect(copy(re) === re).toBeFalsy();
        }), it("should copy RegExp with flags", function() {
            var re = new RegExp(".*", "gim");
            expect(copy(re).global).toBe(!0), expect(copy(re).ignoreCase).toBe(!0), expect(copy(re).multiline).toBe(!0);
        }), it("should copy RegExp with lastIndex", function() {
            var regex = /a+b+/g, line = "ab aabb";
            expect(regex.exec(line)[0]).toEqual("ab"), expect(copy(regex).exec(line)[0]).toEqual("aabb");
        }), it("should deeply copy literal RegExp", function() {
            var objWithRegExp = {
                re: /.*/
            };
            expect(copy(objWithRegExp).re instanceof RegExp).toBeTruthy(), expect(copy(objWithRegExp).re.source).toEqual(".*"), 
            expect(copy(objWithRegExp.re) === objWithRegExp.re).toBeFalsy();
        }), it("should copy a Uint8Array with no destination", function() {
            if ("undefined" != typeof Uint8Array) {
                var out = new Uint8Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint8Array).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should copy a Uint8ClampedArray with no destination", function() {
            if ("undefined" != typeof Uint8ClampedArray) {
                var out = new Uint8ClampedArray(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint8ClampedArray).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should copy a Uint16Array with no destination", function() {
            if ("undefined" != typeof Uint16Array) {
                var out = new Uint16Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint16Array).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should copy a Uint32Array with no destination", function() {
            if ("undefined" != typeof Uint32Array) {
                var out = new Uint32Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Uint32Array).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should copy a Int8Array with no destination", function() {
            if ("undefined" != typeof Int8Array) {
                var out = new Int8Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Int8Array).toBeTruthy(), expect(dst).toEqual(out), expect(dst).not.toBe(out);
            }
        }), it("should copy a Int16Array with no destination", function() {
            if ("undefined" != typeof Int16Array) {
                var out = new Int16Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Int16Array).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should copy a Int32Array with no destination", function() {
            if ("undefined" != typeof Int32Array) {
                var out = new Int32Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Int32Array).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should copy a Float32Array with no destination", function() {
            if ("undefined" != typeof Float32Array) {
                var out = new Float32Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Float32Array).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should copy a Float64Array with no destination", function() {
            if ("undefined" != typeof Float64Array) {
                var out = new Float64Array(2);
                out[1] = 1;
                var dst = copy(out);
                expect(copy(out) instanceof Float64Array).toBeTruthy(), expect(dst).toEqual(out), 
                expect(dst).not.toBe(out);
            }
        }), it("should throw an exception if a Uint8Array is the destination", function() {
            if ("undefined" != typeof Uint8Array) {
                var buf = new Uint8Array(), data = new Uint8Array(5);
                expect(function() {
                    copy(buf, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Uint8ClampedArray is the destination", function() {
            if ("undefined" != typeof Uint8ClampedArray) {
                var temp = new Uint8ClampedArray(), data = new Uint8ClampedArray(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Uint16Array is the destination", function() {
            if ("undefined" != typeof Uint16Array) {
                var temp = new Uint16Array(), data = new Uint16Array(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Uint32Array is the destination", function() {
            if ("undefined" != typeof Uint32Array) {
                var buf = new Uint32Array(), data = new Uint32Array(5);
                expect(function() {
                    copy(buf, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Int8Array is the destination", function() {
            if ("undefined" != typeof Int8Array) {
                var temp = new Int8Array(), data = new Int8Array(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Int16Array is the destination", function() {
            if ("undefined" != typeof Int16Array) {
                var temp = new Int16Array(), data = new Int16Array(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Int32Array is the destination", function() {
            if ("undefined" != typeof Int32Array) {
                var out = new Int32Array(), view = new Int32Array(5);
                expect(function() {
                    copy(out, view);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Float32Array is the destination", function() {
            if ("undefined" != typeof Float32Array) {
                var out = new Float32Array(), data = new Float32Array(5);
                expect(function() {
                    copy(out, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should throw an exception if a Float64Array is the destination", function() {
            if ("undefined" != typeof Float64Array) {
                var temp = new Float64Array(), data = new Float64Array(5);
                expect(function() {
                    copy(temp, data);
                }).toThrowMinErr("ng", "cpta", "Can't copy! TypedArray destination cannot be mutated.");
            }
        }), it("should deeply copy an array into an existing array", function() {
            var src = [ 1, {
                name: "value"
            } ], dst = [ {
                key: "v"
            } ];
            expect(copy(src, dst)).toBe(dst), expect(dst).toEqual([ 1, {
                name: "value"
            } ]), expect(dst[1]).toEqual({
                name: "value"
            }), expect(dst[1]).not.toBe(src[1]);
        }), it("should deeply copy an array into a new array", function() {
            var src = [ 1, {
                name: "value"
            } ], dst = copy(src);
            expect(src).toEqual([ 1, {
                name: "value"
            } ]), expect(dst).toEqual(src), expect(dst).not.toBe(src), expect(dst[1]).not.toBe(src[1]);
        }), it("should copy empty array", function() {
            var el = [], arr = [ {
                key: "v"
            } ];
            expect(copy(el, arr)).toEqual([]), expect(arr).toEqual([]);
        }), it("should deeply copy an object into an existing object", function() {
            var src = {
                a: {
                    name: "value"
                }
            }, dst = {
                b: {
                    key: "v"
                }
            };
            expect(copy(src, dst)).toBe(dst), expect(dst).toEqual({
                a: {
                    name: "value"
                }
            }), expect(dst.a).toEqual(src.a), expect(dst.a).not.toBe(src.a);
        }), it("should deeply copy an object into a non-existing object", function() {
            var src = {
                a: {
                    name: "value"
                }
            }, dst = copy(src, void 0);
            expect(src).toEqual({
                a: {
                    name: "value"
                }
            }), expect(dst).toEqual(src), expect(dst).not.toBe(src), expect(dst.a).toEqual(src.a), 
            expect(dst.a).not.toBe(src.a);
        }), it("should copy primitives", function() {
            expect(copy(null)).toEqual(null), expect(copy("")).toBe(""), expect(copy("lala")).toBe("lala"), 
            expect(copy(123)).toEqual(123), expect(copy([ {
                key: null
            } ])).toEqual([ {
                key: null
            } ]);
        }), it("should throw an exception if a Scope is being copied", inject(function($rootScope) {
            expect(function() {
                copy($rootScope.$new());
            }).toThrowMinErr("ng", "cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        })), it("should throw an exception if a Window is being copied", function() {
            expect(function() {
                copy(window);
            }).toThrowMinErr("ng", "cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        }), it("should throw an exception when source and destination are equivalent", function() {
            var src, dst;
            src = dst = {
                key: "value"
            }, expect(function() {
                copy(src, dst);
            }).toThrowMinErr("ng", "cpi", "Can't copy! Source and destination are identical."), 
            src = dst = [ 2, 4 ], expect(function() {
                copy(src, dst);
            }).toThrowMinErr("ng", "cpi", "Can't copy! Source and destination are identical.");
        }), it("should not copy the private $$hashKey", function() {
            var src, dst;
            src = {}, hashKey(src), dst = copy(src), expect(hashKey(dst)).not.toEqual(hashKey(src));
        }), it("should retain the previous $$hashKey when copying object with hashKey", function() {
            var src, dst, h;
            src = {}, dst = {}, h = hashKey(dst), hashKey(src), dst = copy(src, dst), expect(hashKey(dst)).not.toEqual(hashKey(src)), 
            expect(hashKey(dst)).toEqual(h);
        }), it("should retain the previous $$hashKey when copying non-object", function() {
            var value = {}, unexportPath = hashKey(value);
            copy(null, value), expect(hashKey(value)).toEqual(unexportPath), copy(42, value), 
            expect(hashKey(value)).toEqual(unexportPath), copy(new Date(), value), expect(hashKey(value)).toEqual(unexportPath);
        }), it("should handle circular references", function() {
            var a = {
                b: {
                    a: null
                },
                self: null,
                selfs: [ null, null, [ null ] ]
            };
            a.b.a = a, a.self = a, a.selfs = [ a, a.b, [ a ] ];
            var ret = copy(a, null);
            expect(ret).toEqual(a), expect(ret).not.toBe(a), expect(ret).toBe(ret.self), expect(ret).toBe(ret.selfs[2][0]), 
            expect(ret.selfs[2]).not.toBe(a.selfs[2]);
            var secondBT = [];
            ret = copy(a, secondBT), expect(ret).toBe(secondBT), expect(ret).not.toBe(a), expect(ret).toBe(ret.self);
        }), it("should handle objects with multiple references", function() {
            var data = {}, src = [ data, -1, data ], dst = copy(src);
            expect(dst[0]).not.toBe(src[0]), expect(dst[0]).toBe(dst[2]);
            var expected = [];
            dst = copy(src, expected), expect(dst).toBe(expected), expect(dst[0]).not.toBe(src[0]), 
            expect(dst[0]).toBe(dst[2]);
        }), it("should handle date/regex objects with multiple references", function() {
            var id = /foo/, parent = new Date(), len = {
                re: id,
                re2: id,
                d: parent,
                d2: parent
            }, data = copy(len);
            expect(data.re).toBe(data.re2), expect(data.d).toBe(data.d2), data = copy(len, {}), 
            expect(data.re).toBe(data.re2), expect(data.d).toBe(data.d2);
        }), it("should clear destination arrays correctly when source is non-array", function() {
            expect(copy(null, [ 1, 2, 3 ])).toEqual([]), expect(copy(void 0, [ 1, 2, 3 ])).toEqual([]), 
            expect(copy({
                0: 1,
                1: 2
            }, [ 1, 2, 3 ])).toEqual([ 1, 2 ]), expect(copy(new Date(), [ 1, 2, 3 ])).toEqual([]), 
            expect(copy(/a/, [ 1, 2, 3 ])).toEqual([]), expect(copy(!0, [ 1, 2, 3 ])).toEqual([]);
        }), it("should clear destination objects correctly when source is non-array", function() {
            expect(copy(null, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({}), expect(copy(void 0, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({}), expect(copy(new Date(), {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({}), expect(copy(/a/, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({}), expect(copy(!0, {
                0: 1,
                1: 2,
                2: 3
            })).toEqual({});
        }), it("should copy objects with no prototype parent", function() {
            var ret = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            }), obj = copy(ret);
            expect(Object.getPrototypeOf(obj)).toBe(null), expect(obj.a).toBe(1), expect(obj.b).toBe(2), 
            expect(obj.c).toBe(3), expect(Object.keys(obj)).toEqual([ "a", "b", "c" ]);
        });
    }), describe("extend", function() {
        it("should not copy the private $$hashKey", function() {
            var obj, func;
            obj = {}, func = {}, hashKey(obj), func = extend(func, obj), expect(hashKey(func)).not.toEqual(hashKey(obj));
        }), it("should retain the previous $$hashKey", function() {
            var data, body, html;
            data = {}, body = {}, html = hashKey(body), hashKey(data), body = extend(body, data), 
            expect(hashKey(body)).not.toEqual(hashKey(data)), expect(hashKey(body)).toEqual(html);
        }), it("should work when extending with itself", function() {
            var defaults, options, instance;
            options = defaults = {}, instance = hashKey(options), options = extend(options, defaults), 
            expect(hashKey(options)).toEqual(instance);
        }), it("should copy dates by reference", function() {
            var data = {
                date: new Date()
            }, model = {};
            extend(model, data), expect(model.date).toBe(data.date);
        });
    }), describe("merge", function() {
        it("should recursively copy objects into dst from left to right", function() {
            var ret = {
                foo: {
                    bar: "foobar"
                }
            }, args = {
                foo: {
                    bazz: "foobazz"
                }
            }, options = {
                foo: {
                    bozz: "foobozz"
                }
            };
            merge(ret, args, options), expect(ret).toEqual({
                foo: {
                    bar: "foobar",
                    bazz: "foobazz",
                    bozz: "foobozz"
                }
            });
        }), it("should replace primitives with objects", function() {
            var ret = {
                foo: "bloop"
            }, args = {
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            };
            merge(ret, args), expect(ret).toEqual({
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            });
        }), it("should replace null values in destination with objects", function() {
            var ret = {
                foo: null
            }, args = {
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            };
            merge(ret, args), expect(ret).toEqual({
                foo: {
                    bar: {
                        baz: "bloop"
                    }
                }
            });
        }), it("should copy references to functions by value rather than merging", function() {
            function e() {}
            var ret = {
                foo: 1
            }, args = {
                foo: e
            };
            merge(ret, args), expect(ret).toEqual({
                foo: e
            });
        }), it("should create a new array if destination property is a non-object and source property is an array", function() {
            var ret = {
                foo: NaN
            }, args = {
                foo: [ 1, 2, 3 ]
            };
            merge(ret, args), expect(ret).toEqual({
                foo: [ 1, 2, 3 ]
            }), expect(ret.foo).not.toBe(args.foo);
        }), it("should copy dates by value", function() {
            var result = {
                date: new Date()
            }, data = {};
            merge(data, result), expect(data.date).not.toBe(result.date), expect(isDate(data.date)).toBeTruthy(), 
            expect(data.date.valueOf()).toEqual(result.date.valueOf());
        });
    }), describe("shallow copy", function() {
        it("should make a copy", function() {
            var original = {
                key: {}
            }, ret = shallowCopy(original);
            expect(ret).toEqual(original), expect(ret.key).toBe(original.key);
        }), it('should omit "$$"-prefixed properties', function() {
            var original = {
                $$some: !0,
                $$: !0
            }, clone = {};
            expect(shallowCopy(original, clone)).toBe(clone), expect(clone.$$some).toBeUndefined(), 
            expect(clone.$$).toBeUndefined();
        }), it('should copy "$"-prefixed properties from copy', function() {
            var original = {
                $some: !0
            }, clone = {};
            expect(shallowCopy(original, clone)).toBe(clone), expect(clone.$some).toBe(original.$some);
        }), it("should handle arrays", function() {
            var c = [ {}, 1 ], e = [], ret = shallowCopy(c);
            expect(ret).not.toBe(c), expect(ret).toEqual(c), expect(ret[0]).toBe(c[0]), expect(shallowCopy(c, e)).toBe(e), 
            expect(e).toEqual(c);
        }), it("should handle primitives", function() {
            expect(shallowCopy("test")).toBe("test"), expect(shallowCopy(3)).toBe(3), expect(shallowCopy(!0)).toBe(!0);
        });
    }), describe("elementHTML", function() {
        it("should dump element", function() {
            expect(startingTag('<div attr="123">something<span></span></div>')).toEqual('<div attr="123">');
        });
    }), describe("equals", function() {
        it("should return true if same object", function() {
            var obj = {};
            expect(equals(obj, obj)).toEqual(!0), expect(equals(obj, {})).toEqual(!0), expect(equals(1, "1")).toEqual(!1), 
            expect(equals(1, "2")).toEqual(!1);
        }), it("should recurse into object", function() {
            expect(equals({}, {})).toEqual(!0), expect(equals({
                name: "misko"
            }, {
                name: "misko"
            })).toEqual(!0), expect(equals({
                name: "misko",
                age: 1
            }, {
                name: "misko"
            })).toEqual(!1), expect(equals({
                name: "misko"
            }, {
                name: "misko",
                age: 1
            })).toEqual(!1), expect(equals({
                name: "misko"
            }, {
                name: "adam"
            })).toEqual(!1), expect(equals([ "misko" ], [ "misko" ])).toEqual(!0), expect(equals([ "misko" ], [ "adam" ])).toEqual(!1), 
            expect(equals([ "misko" ], [ "misko", "adam" ])).toEqual(!1);
        }), it("should ignore undefined member variables during comparison", function() {
            var obj1 = {
                name: "misko"
            }, obj2 = {
                name: "misko",
                undefinedvar: void 0
            };
            expect(equals(obj1, obj2)).toBe(!0), expect(equals(obj2, obj1)).toBe(!0);
        }), it("should ignore $ member variables", function() {
            expect(equals({
                name: "misko",
                $id: 1
            }, {
                name: "misko",
                $id: 2
            })).toEqual(!0), expect(equals({
                name: "misko"
            }, {
                name: "misko",
                $id: 2
            })).toEqual(!0), expect(equals({
                name: "misko",
                $id: 1
            }, {
                name: "misko"
            })).toEqual(!0);
        }), it("should ignore functions", function() {
            expect(equals({
                func: function() {}
            }, {
                bar: function() {}
            })).toEqual(!0);
        }), it("should work well with nulls", function() {
            expect(equals(null, "123")).toBe(!1), expect(equals("123", null)).toBe(!1);
            var obj = {
                foo: "bar"
            };
            expect(equals(null, obj)).toBe(!1), expect(equals(obj, null)).toBe(!1), expect(equals(null, null)).toBe(!0);
        }), it("should work well with undefined", function() {
            expect(equals(void 0, "123")).toBe(!1), expect(equals("123", void 0)).toBe(!1);
            var obj = {
                foo: "bar"
            };
            expect(equals(void 0, obj)).toBe(!1), expect(equals(obj, void 0)).toBe(!1), expect(equals(void 0, void 0)).toBe(!0);
        }), it("should treat two NaNs as equal", function() {
            expect(equals(NaN, NaN)).toBe(!0);
        }), it("should compare Scope instances only by identity", inject(function($rootScope) {
            var scope1 = $rootScope.$new(), scope2 = $rootScope.$new();
            expect(equals(scope1, scope1)).toBe(!0), expect(equals(scope1, scope2)).toBe(!1), 
            expect(equals($rootScope, scope1)).toBe(!1), expect(equals(void 0, scope1)).toBe(!1);
        })), it("should compare Window instances only by identity", function() {
            expect(equals(window, window)).toBe(!0), expect(equals(window, window.parent)).toBe(!1), 
            expect(equals(window, void 0)).toBe(!1);
        }), it("should compare dates", function() {
            expect(equals(new Date(0), new Date(0))).toBe(!0), expect(equals(new Date(0), new Date(1))).toBe(!1), 
            expect(equals(new Date(0), 0)).toBe(!1), expect(equals(0, new Date(0))).toBe(!1), 
            expect(equals(new Date(void 0), new Date(void 0))).toBe(!0), expect(equals(new Date(void 0), new Date(0))).toBe(!1), 
            expect(equals(new Date(void 0), new Date(null))).toBe(!1), expect(equals(new Date(void 0), new Date("wrong"))).toBe(!0), 
            expect(equals(new Date(), /abc/)).toBe(!1);
        }), it("should correctly test for keys that are present on Object.prototype", function() {
            expect(equals({}, {
                hasOwnProperty: 1
            })).toBe(!1), expect(equals({}, {
                toString: null
            })).toBe(!1);
        }), it("should compare regular expressions", function() {
            expect(equals(/abc/, /abc/)).toBe(!0), expect(equals(/abc/i, new RegExp("abc", "i"))).toBe(!0), 
            expect(equals(new RegExp("abc", "i"), new RegExp("abc", "i"))).toBe(!0), expect(equals(new RegExp("abc", "i"), new RegExp("abc"))).toBe(!1), 
            expect(equals(/abc/i, /abc/)).toBe(!1), expect(equals(/abc/, /def/)).toBe(!1), expect(equals(/^abc/, /abc/)).toBe(!1), 
            expect(equals(/^abc/, "/^abc/")).toBe(!1), expect(equals(/abc/, new Date())).toBe(!1);
        }), it("should return false when comparing an object and an array", function() {
            expect(equals({}, [])).toBe(!1), expect(equals([], {})).toBe(!1);
        }), it("should return false when comparing an object and a RegExp", function() {
            expect(equals({}, /abc/)).toBe(!1), expect(equals({}, new RegExp("abc", "i"))).toBe(!1);
        }), it("should return false when comparing an object and a Date", function() {
            expect(equals({}, new Date())).toBe(!1);
        }), it("should safely compare objects with no prototype parent", function() {
            var a = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            }), b = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            });
            expect(equals(a, b)).toBe(!0), b.c = 2, expect(equals(a, b)).toBe(!1);
        }), it("should safely compare objects which shadow Object.prototype.hasOwnProperty", function() {
            var obj = {
                hasOwnProperty: !0,
                a: 1,
                b: 2,
                c: 3
            }, obj1 = {
                hasOwnProperty: !0,
                a: 1,
                b: 2,
                c: 3
            };
            expect(equals(obj, obj1)).toBe(!0), obj.hasOwnProperty = function() {}, expect(equals(obj, obj1)).toBe(!1);
        });
    }), describe("csp", function() {
        var _Showdown;
        beforeEach(function() {
            _Showdown = window.Function;
        }), afterEach(function() {
            window.Function = _Showdown, delete csp.isActive_;
        }), it("should return the false when CSP is not enabled (the default)", function() {
            expect(csp()).toBe(!1);
        }), it("should return true if CSP is autodetected via CSP v1.1 securityPolicy.isActive property", function() {
            window.Function = function() {
                throw new Error("CSP test");
            }, expect(csp()).toBe(!0);
        }), it("should return the true when CSP is enabled manually via [ng-csp]", function() {
            spyOn(document, "querySelector").andCallFake(function(filepath) {
                return "[ng-csp]" == filepath ? {} : void 0;
            }), expect(csp()).toBe(!0);
        }), it("should return the true when CSP is enabled manually via [data-ng-csp]", function() {
            spyOn(document, "querySelector").andCallFake(function(filepath) {
                return "[data-ng-csp]" == filepath ? {} : void 0;
            }), expect(csp()).toBe(!0), expect(document.querySelector).toHaveBeenCalledWith("[data-ng-csp]");
        });
    }), describe("jq", function() {
        var b;
        beforeEach(function() {
            b = document.createElement("html");
        }), afterEach(function() {
            delete jq.name_;
        }), it("should return undefined when jq is not set, no jQuery found (the default)", function() {
            expect(jq()).toBe(void 0);
        }), it("should return empty string when jq is enabled manually via [ng-jq] with empty string", function() {
            b.setAttribute("ng-jq", ""), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[ng-jq]" === a ? b : void 0;
            }), expect(jq()).toBe("");
        }), it("should return empty string when jq is enabled manually via [data-ng-jq] with empty string", function() {
            b.setAttribute("data-ng-jq", ""), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[data-ng-jq]" === a ? b : void 0;
            }), expect(jq()).toBe(""), expect(document.querySelector).toHaveBeenCalledWith("[data-ng-jq]");
        }), it("should return empty string when jq is enabled manually via [x-ng-jq] with empty string", function() {
            b.setAttribute("x-ng-jq", ""), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[x-ng-jq]" === a ? b : void 0;
            }), expect(jq()).toBe(""), expect(document.querySelector).toHaveBeenCalledWith("[x-ng-jq]");
        }), it("should return empty string when jq is enabled manually via [ng:jq] with empty string", function() {
            b.setAttribute("ng:jq", ""), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[ng\\:jq]" === a ? b : void 0;
            }), expect(jq()).toBe(""), expect(document.querySelector).toHaveBeenCalledWith("[ng\\:jq]");
        }), it('should return "jQuery" when jq is enabled manually via [ng-jq] with value "jQuery"', function() {
            b.setAttribute("ng-jq", "jQuery"), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[ng-jq]" === a ? b : void 0;
            }), expect(jq()).toBe("jQuery"), expect(document.querySelector).toHaveBeenCalledWith("[ng-jq]");
        }), it('should return "jQuery" when jq is enabled manually via [data-ng-jq] with value "jQuery"', function() {
            b.setAttribute("data-ng-jq", "jQuery"), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[data-ng-jq]" === a ? b : void 0;
            }), expect(jq()).toBe("jQuery"), expect(document.querySelector).toHaveBeenCalledWith("[data-ng-jq]");
        }), it('should return "jQuery" when jq is enabled manually via [x-ng-jq] with value "jQuery"', function() {
            b.setAttribute("x-ng-jq", "jQuery"), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[x-ng-jq]" === a ? b : void 0;
            }), expect(jq()).toBe("jQuery"), expect(document.querySelector).toHaveBeenCalledWith("[x-ng-jq]");
        }), it('should return "jQuery" when jq is enabled manually via [ng:jq] with value "jQuery"', function() {
            b.setAttribute("ng:jq", "jQuery"), spyOn(document, "querySelector").andCallFake(function(a) {
                return "[ng\\:jq]" === a ? b : void 0;
            }), expect(jq()).toBe("jQuery"), expect(document.querySelector).toHaveBeenCalledWith("[ng\\:jq]");
        });
    }), describe("parseKeyValue", function() {
        it("should parse a string into key-value pairs", function() {
            expect(parseKeyValue("")).toEqual({}), expect(parseKeyValue("simple=pair")).toEqual({
                simple: "pair"
            }), expect(parseKeyValue("first=1&second=2")).toEqual({
                first: "1",
                second: "2"
            }), expect(parseKeyValue("escaped%20key=escaped%20value")).toEqual({
                "escaped key": "escaped value"
            }), expect(parseKeyValue("emptyKey=")).toEqual({
                emptyKey: ""
            }), expect(parseKeyValue("flag1&key=value&flag2")).toEqual({
                flag1: !0,
                key: "value",
                flag2: !0
            });
        }), it("should ignore key values that are not valid URI components", function() {
            expect(function() {
                parseKeyValue("%");
            }).not.toThrow(), expect(parseKeyValue("%")).toEqual({}), expect(parseKeyValue("invalid=%")).toEqual({
                invalid: void 0
            }), expect(parseKeyValue("invalid=%&valid=good")).toEqual({
                invalid: void 0,
                valid: "good"
            });
        }), it("should parse a string into key-value pairs with duplicates grouped in an array", function() {
            expect(parseKeyValue("")).toEqual({}), expect(parseKeyValue("duplicate=pair")).toEqual({
                duplicate: "pair"
            }), expect(parseKeyValue("first=1&first=2")).toEqual({
                first: [ "1", "2" ]
            }), expect(parseKeyValue("escaped%20key=escaped%20value&&escaped%20key=escaped%20value2")).toEqual({
                "escaped key": [ "escaped value", "escaped value2" ]
            }), expect(parseKeyValue("flag1&key=value&flag1")).toEqual({
                flag1: [ !0, !0 ],
                key: "value"
            }), expect(parseKeyValue("flag1&flag1=value&flag1=value2&flag1")).toEqual({
                flag1: [ !0, "value", "value2", !0 ]
            });
        }), it("should ignore properties higher in the prototype chain", function() {
            expect(parseKeyValue("toString=123")).toEqual({
                toString: "123"
            });
        });
    }), describe("toKeyValue", function() {
        it("should serialize key-value pairs into string", function() {
            expect(toKeyValue({})).toEqual(""), expect(toKeyValue({
                simple: "pair"
            })).toEqual("simple=pair"), expect(toKeyValue({
                first: "1",
                second: "2"
            })).toEqual("first=1&second=2"), expect(toKeyValue({
                "escaped key": "escaped value"
            })).toEqual("escaped%20key=escaped%20value"), expect(toKeyValue({
                emptyKey: ""
            })).toEqual("emptyKey=");
        }), it("should serialize true values into flags", function() {
            expect(toKeyValue({
                flag1: !0,
                key: "value",
                flag2: !0
            })).toEqual("flag1&key=value&flag2");
        }), it("should serialize duplicates into duplicate param strings", function() {
            expect(toKeyValue({
                key: [ 323, "value", !0 ]
            })).toEqual("key=323&key=value&key"), expect(toKeyValue({
                key: [ 323, "value", !0, 1234 ]
            })).toEqual("key=323&key=value&key&key=1234");
        });
    }), describe("forEach", function() {
        it("should iterate over *own* object properties", function() {
            function MyObj() {
                this.bar = "barVal", this.baz = "bazVal";
            }
            MyObj.prototype.foo = "fooVal";
            var values = new MyObj(), ret = [];
            forEach(values, function(value, key) {
                ret.push(key + ":" + value);
            }), expect(ret).toEqual([ "bar:barVal", "baz:bazVal" ]);
        }), it("should not break if obj is an array we override hasOwnProperty", function() {
            var args = [];
            args[0] = 1, args[1] = 2, args.hasOwnProperty = null;
            var output = [];
            forEach(args, function(e, i) {
                output.push(i + ":" + e);
            }), expect(output).toEqual([ "0:1", "1:2" ]);
        }), it("should handle JQLite and jQuery objects like arrays", function() {
            var jqObject = jqLite("<p><span>s1</span><span>s2</span></p>").find("span"), log = [];
            forEach(jqObject, function(value, key) {
                log.push(key + ":" + value.innerHTML);
            }), expect(log).toEqual([ "0:s1", "1:s2" ]);
        }), it("should handle NodeList objects like arrays", function() {
            var nodeList = jqLite("<p><span>a</span><span>b</span><span>c</span></p>")[0].childNodes, log = [];
            forEach(nodeList, function(value, key) {
                log.push(key + ":" + value.innerHTML);
            }), expect(log).toEqual([ "0:a", "1:b", "2:c" ]);
        }), it("should handle HTMLCollection objects like arrays", function() {
            document.body.innerHTML = "<p><a name='x'>a</a><a name='y'>b</a><a name='x'>c</a></p>";
            var htmlCollection = document.getElementsByName("x"), log = [];
            forEach(htmlCollection, function(value, key) {
                log.push(key + ":" + value.innerHTML);
            }), expect(log).toEqual([ "0:a", "1:c" ]);
        }), document.querySelectorAll && it("should handle the result of querySelectorAll in IE8 as it has no hasOwnProperty function", function() {
            document.body.innerHTML = "<p><a name='x'>a</a><a name='y'>b</a><a name='x'>c</a></p>";
            var nodeList = document.querySelectorAll('[name="x"]'), log = [];
            forEach(nodeList, function(value, key) {
                log.push(key + ":" + value.innerHTML);
            }), expect(log).toEqual([ "0:a", "1:c" ]);
        }), it("should handle arguments objects like arrays", function() {
            var args, log = [];
            !function() {
                args = arguments;
            }("a", "b", "c"), forEach(args, function(value, key) {
                log.push(key + ":" + value);
            }), expect(log).toEqual([ "0:a", "1:b", "2:c" ]);
        }), it("should handle string values like arrays", function() {
            var log = [];
            forEach("bar", function(value, key) {
                log.push(key + ":" + value);
            }), expect(log).toEqual([ "0:b", "1:a", "2:r" ]);
        }), it("should handle objects with length property as objects", function() {
            var input = {
                foo: "bar",
                length: 2
            }, output = [];
            forEach(input, function(e, id) {
                output.push(id + ":" + e);
            }), expect(output).toEqual([ "foo:bar", "length:2" ]);
        }), it("should handle objects of custom types with length property as objects", function() {
            function CustomType() {
                this.length = 2, this.foo = "bar";
            }
            var values = new CustomType(), ret = [];
            forEach(values, function(value, key) {
                ret.push(key + ":" + value);
            }), expect(ret).toEqual([ "length:2", "foo:bar" ]);
        }), it("should not invoke the iterator for indexed properties which are not present in the collection", function() {
            var paths = [], fields = [];
            fields[5] = "SPARSE", forEach(fields, function(i, e) {
                paths.push(i + e);
            }), expect(paths.length).toBe(1), expect(paths[0]).toBe("SPARSE5");
        }), it("should safely iterate through objects with no prototype parent", function() {
            var obj = extend(Object.create(null), {
                a: 1,
                b: 2,
                c: 3
            }), log = [], context = {};
            forEach(obj, function(value, key, list) {
                expect(this).toBe(context), expect(list).toBe(obj), log.push(key + "=" + value);
            }, context), expect(log.length).toBe(3), expect(log).toEqual([ "a=1", "b=2", "c=3" ]);
        }), it("should safely iterate through objects which shadow Object.prototype.hasOwnProperty", function() {
            var obj = {
                hasOwnProperty: !0,
                a: 1,
                b: 2,
                c: 3
            }, log = [], context = {};
            forEach(obj, function(value, key, list) {
                expect(this).toBe(context), expect(list).toBe(obj), log.push(key + "=" + value);
            }, context), expect(log.length).toBe(4), expect(log).toEqual([ "hasOwnProperty=true", "a=1", "b=2", "c=3" ]);
        }), describe("ES spec api compliance", function() {
            function handler(idx, obj) {
                var context = {};
                forEach(obj, function(value, i, list) {
                    expect(list).toBe(obj), expect(list[i]).toBe(value), expect(this).toBe(context), 
                    idx--;
                }, context), expect(idx).toBe(0);
            }
            it("should follow the ES spec when called with array", function() {
                handler(2, [ 1, 2 ]);
            }), it("should follow the ES spec when called with arguments", function() {
                handler(2, function() {
                    return arguments;
                }(1, 2));
            }), it("should follow the ES spec when called with string", function() {
                handler(2, "12");
            }), it("should follow the ES spec when called with jQuery/jqLite", function() {
                handler(2, jqLite("<span>a</span><span>b</span>"));
            }), it("should follow the ES spec when called with childNodes NodeList", function() {
                handler(2, jqLite("<p><span>a</span><span>b</span></p>")[0].childNodes);
            }), it("should follow the ES spec when called with getElementsByTagName HTMLCollection", function() {
                handler(2, jqLite("<p><span>a</span><span>b</span></p>")[0].getElementsByTagName("*"));
            }), it("should follow the ES spec when called with querySelectorAll HTMLCollection", function() {
                handler(2, jqLite("<p><span>a</span><span>b</span></p>")[0].querySelectorAll("*"));
            }), it("should follow the ES spec when called with JSON", function() {
                handler(2, {
                    a: 1,
                    b: 2
                });
            }), it("should follow the ES spec when called with function", function() {
                function res() {}
                res.a = 1, res.b = 2, handler(2, res);
            });
        });
    }), describe("encodeUriSegment", function() {
        it("should correctly encode uri segment and not encode chars defined as pchar set in rfc3986", function() {
            expect(encodeUriSegment("asdf1234asdf")).toEqual("asdf1234asdf"), expect(encodeUriSegment("-_.!~*'(); -_.!~*'();")).toEqual("-_.!~*'();%20-_.!~*'();"), 
            expect(encodeUriSegment(":@&=+$, :@&=+$,")).toEqual(":@&=+$,%20:@&=+$,"), expect(encodeUriSegment("/; /;")).toEqual("%2F;%20%2F;");
        });
    }), describe("encodeUriQuery", function() {
        it("should correctly encode uri query and not encode chars defined as pchar set in rfc3986", function() {
            expect(encodeUriQuery("asdf1234asdf")).toEqual("asdf1234asdf"), expect(encodeUriQuery("-_.!~*'() -_.!~*'()")).toEqual("-_.!~*'()+-_.!~*'()"), 
            expect(encodeUriQuery(":@$, :@$,")).toEqual(":@$,+:@$,"), expect(encodeUriQuery("&;=+# &;=+#")).toEqual("%26;%3D%2B%23+%26;%3D%2B%23"), 
            expect(encodeUriQuery("  ")).toEqual("++"), expect(encodeUriQuery("  ", !0)).toEqual("%20%20"), 
            expect(encodeUriQuery("null", !0)).toEqual("null"), expect(encodeUriQuery("null")).toEqual("null");
        });
    }), describe("angularInit", function() {
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
            }, bootstrapSpy = jasmine.createSpy("bootstrapSpy");
        }), it("should do nothing when not found", function() {
            angularInit(element, bootstrapSpy), expect(bootstrapSpy).not.toHaveBeenCalled();
        }), it("should look for ngApp directive as attr", function() {
            var appElement = jqLite('<div ng-app="ABC"></div>')[0];
            element.querySelector["[ng-app]"] = appElement, angularInit(element, bootstrapSpy), 
            expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [ "ABC" ], jasmine.any(Object));
        }), it("should look for ngApp directive using querySelectorAll", function() {
            var appElement = jqLite('<div x-ng-app="ABC"></div>')[0];
            element.querySelector["[x-ng-app]"] = appElement, angularInit(element, bootstrapSpy), 
            expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [ "ABC" ], jasmine.any(Object));
        }), it("should bootstrap anonymously", function() {
            var appElement = jqLite("<div x-ng-app></div>")[0];
            element.querySelector["[x-ng-app]"] = appElement, angularInit(element, bootstrapSpy), 
            expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [], jasmine.any(Object));
        }), it("should bootstrap if the annotation is on the root element", function() {
            var appElement = jqLite('<div ng-app=""></div>')[0];
            angularInit(appElement, bootstrapSpy), expect(bootstrapSpy).toHaveBeenCalledOnceWith(appElement, [], jasmine.any(Object));
        }), it("should complain if app module cannot be found", function() {
            var appElement = jqLite('<div ng-app="doesntexist"></div>')[0];
            expect(function() {
                angularInit(appElement, angular.bootstrap);
            }).toThrowMatching(new RegExp("\\[\\$injector:modulerr] Failed to instantiate module doesntexist due to:\\n.*\\[\\$injector:nomod] Module 'doesntexist' is not available! You either misspelled the module name or forgot to load it\\."));
        }), it("should complain if an element has already been bootstrapped", function() {
            var element = jqLite("<div>bootstrap me!</div>");
            angular.bootstrap(element), expect(function() {
                angular.bootstrap(element);
            }).toThrowMatching(/\[ng:btstrpd\] App Already Bootstrapped with this Element '&lt;div class="?ng\-scope"?( ng[0-9]+="?[0-9]+"?)?&gt;'/i), 
            dealoc(element);
        }), it("should complain if manually bootstrapping a document whose <html> element has already been bootstrapped", function() {
            angular.bootstrap(document.getElementsByTagName("html")[0]), expect(function() {
                angular.bootstrap(document);
            }).toThrowMatching(/\[ng:btstrpd\] App Already Bootstrapped with this Element 'document'/i), 
            dealoc(document);
        }), it("should bootstrap in strict mode when ng-strict-di attribute is specified", function() {
            function list(opts) {}
            bootstrapSpy = spyOn(angular, "bootstrap").andCallThrough();
            var parts = jqLite('<div ng-app="" ng-strict-di></div>');
            angularInit(jqLite("<div></div>").append(parts[0])[0], bootstrapSpy), expect(bootstrapSpy).toHaveBeenCalledOnce(), 
            expect(bootstrapSpy.mostRecentCall.args[2].strictDi).toBe(!0);
            var app = parts.injector();
            expect(function() {
                app.instantiate(list);
            }).toThrowMinErr("$injector", "strictdi"), dealoc(parts);
        });
    }), describe("angular service", function() {
        it("should override services", function() {
            module(function($provide) {
                $provide.value("fake", "old"), $provide.value("fake", "new");
            }), inject(function(ngI18nVersion) {
                expect(ngI18nVersion).toEqual("new");
            });
        }), it("should inject dependencies specified by $inject and ignore function argument name", function() {
            expect(angular.injector([ function($provide) {
                $provide.factory("svc1", function() {
                    return "svc1";
                }), $provide.factory("svc2", [ "svc1", function(s) {
                    return "svc2-" + s;
                } ]);
            } ]).get("svc2")).toEqual("svc2-svc1");
        });
    }), describe("isDate", function() {
        it("should return true for Date object", function() {
            expect(isDate(new Date())).toBe(!0);
        }), it("should return false for non Date objects", function() {
            expect(isDate([])).toBe(!1), expect(isDate("")).toBe(!1), expect(isDate(23)).toBe(!1), 
            expect(isDate({})).toBe(!1);
        });
    }), describe("isRegExp", function() {
        it("should return true for RegExp object", function() {
            expect(isRegExp(/^foobar$/)).toBe(!0), expect(isRegExp(new RegExp("^foobar$/"))).toBe(!0);
        }), it("should return false for non RegExp objects", function() {
            expect(isRegExp([])).toBe(!1), expect(isRegExp("")).toBe(!1), expect(isRegExp(23)).toBe(!1), 
            expect(isRegExp({})).toBe(!1), expect(isRegExp(new Date())).toBe(!1);
        });
    }), describe("isWindow", function() {
        it("should return true for the Window object", function() {
            expect(isWindow(window)).toBe(!0);
        }), it("should return false for any object that is not a Window", function() {
            expect(isWindow([])).toBe(!1), expect(isWindow("")).toBeFalsy(), expect(isWindow(23)).toBe(!1), 
            expect(isWindow({})).toBe(!1), expect(isWindow(new Date())).toBe(!1), expect(isWindow(document)).toBe(!1);
        });
    }), describe("compile", function() {
        it("should link to existing node and create scope", inject(function($rootScope, $compile) {
            var element = angular.element('<div>{{greeting = "hello world"}}</div>');
            el = $compile(element)($rootScope), $rootScope.$digest(), expect(element.text()).toEqual("hello world"), 
            expect($rootScope.greeting).toEqual("hello world");
        })), it("should link to existing node and given scope", inject(function($rootScope, $compile) {
            var element = angular.element('<div>{{greeting = "hello world"}}</div>');
            el = $compile(element)($rootScope), $rootScope.$digest(), expect(element.text()).toEqual("hello world");
        })), it("should link to new node and given scope", inject(function($rootScope, $compile) {
            var element = jqLite('<div>{{greeting = "hello world"}}</div>'), fn = $compile(element), actual = element.clone();
            el = fn($rootScope, function(alpha) {
                actual = alpha;
            }), $rootScope.$digest(), expect(element.text()).toEqual('{{greeting = "hello world"}}'), 
            expect(el.text()).toEqual("hello world"), expect(el).toEqual(actual), expect($rootScope.greeting).toEqual("hello world");
        })), it("should link to cloned node and create scope", inject(function($rootScope, $compile) {
            var template = jqLite('<div>{{greeting = "hello world"}}</div>');
            el = $compile(template)($rootScope, noop), $rootScope.$digest(), expect(template.text()).toEqual('{{greeting = "hello world"}}'), 
            expect(el.text()).toEqual("hello world"), expect($rootScope.greeting).toEqual("hello world");
        }));
    }), describe("nodeName_", function() {
        it('should correctly detect node name with "namespace" when xmlns is defined', function() {
            var div = jqLite('<div xmlns:ngtest="http://angularjs.org/"><ngtest:foo ngtest:attr="bar"></ngtest:foo></div>')[0];
            expect(nodeName_(div.childNodes[0])).toBe("ngtest:foo"), expect(div.childNodes[0].getAttribute("ngtest:attr")).toBe("bar");
        }), it('should correctly detect node name with "namespace" when xmlns is NOT defined', function() {
            var div = jqLite('<div xmlns:ngtest="http://angularjs.org/"><ngtest:foo ngtest:attr="bar"></ng-test></div>')[0];
            expect(nodeName_(div.childNodes[0])).toBe("ngtest:foo"), expect(div.childNodes[0].getAttribute("ngtest:attr")).toBe("bar");
        }), it("should return undefined for elements without the .nodeName property", function() {
            expect(nodeName_({})).toBeUndefined();
        });
    }), describe("nextUid()", function() {
        it("should return new id per call", function() {
            for (var tmp = {}, i = 100; i--; ) {
                var prop = nextUid();
                expect(typeof prop).toBe("number"), expect(tmp[prop]).toBeFalsy(), tmp[prop] = !0;
            }
        });
    }), describe("version", function() {
        it("version should have full/major/minor/dot/codeName properties", function() {
            expect(version).toBeDefined(), expect(version.full).toBe('"NG_VERSION_FULL"'), expect(version.major).toBe("NG_VERSION_MAJOR"), 
            expect(version.minor).toBe("NG_VERSION_MINOR"), expect(version.dot).toBe("NG_VERSION_DOT"), 
            expect(version.codeName).toBe('"NG_VERSION_CODENAME"');
        });
    }), describe("bootstrap", function() {
        it("should bootstrap app", function() {
            var element = jqLite("<div>{{1+2}}</div>"), injector = angular.bootstrap(element);
            expect(injector).toBeDefined(), expect(element.injector()).toBe(injector), dealoc(element);
        }), it("should complain if app module can't be found", function() {
            var element = jqLite("<div>{{1+2}}</div>");
            expect(function() {
                angular.bootstrap(element, [ "doesntexist" ]);
            }).toThrowMatching(new RegExp("\\[\\$injector:modulerr\\] Failed to instantiate module doesntexist due to:\\n.*\\[\\$injector:nomod\\] Module 'doesntexist' is not available! You either misspelled the module name or forgot to load it\\.")), 
            expect(element.html()).toBe("{{1+2}}"), dealoc(element);
        }), describe("deferred bootstrap", function() {
            var element, originalName = window.name;
            beforeEach(function() {
                window.name = "", element = jqLite("<div>{{1+2}}</div>");
            }), afterEach(function() {
                dealoc(element), window.name = originalName;
            }), it("should provide injector for deferred bootstrap", function() {
                var res;
                window.name = "NG_DEFER_BOOTSTRAP!", res = angular.bootstrap(element), expect(res).toBeUndefined(), 
                res = angular.resumeBootstrap(), expect(res).toBeDefined();
            }), it("should resume deferred bootstrap, if defined", function() {
                var module2;
                window.name = "NG_DEFER_BOOTSTRAP!", angular.resumeDeferredBootstrap = noop;
                var moveCursorToEnd = spyOn(angular, "resumeDeferredBootstrap");
                module2 = angular.bootstrap(element), expect(moveCursorToEnd).toHaveBeenCalled();
            }), it("should wait for extra modules", function() {
                window.name = "NG_DEFER_BOOTSTRAP!", angular.bootstrap(element), expect(element.html()).toBe("{{1+2}}"), 
                angular.resumeBootstrap(), expect(element.html()).toBe("3"), expect(window.name).toEqual("");
            }), it("should load extra modules", function() {
                element = jqLite("<div>{{1+2}}</div>"), window.name = "NG_DEFER_BOOTSTRAP!";
                var bootstrapping = jasmine.createSpy("bootstrapping");
                angular.bootstrap(element, [ bootstrapping ]), expect(bootstrapping).not.toHaveBeenCalled(), 
                expect(element.injector()).toBeUndefined(), angular.module("addedModule", []).value("foo", "bar"), 
                angular.resumeBootstrap([ "addedModule" ]), expect(bootstrapping).toHaveBeenCalledOnce(), 
                expect(element.injector().get("foo")).toEqual("bar");
            }), it("should not defer bootstrap without window.name cue", function() {
                angular.bootstrap(element, []), angular.module("addedModule", []).value("foo", "bar"), 
                expect(function() {
                    element.injector().get("foo");
                }).toThrowMinErr("$injector", "unpr", "Unknown provider: fooProvider <- foo"), expect(element.injector().get("$http")).toBeDefined();
            }), it("should restore the original window.name after bootstrap", function() {
                window.name = "NG_DEFER_BOOTSTRAP!my custom name", angular.bootstrap(element), expect(element.html()).toBe("{{1+2}}"), 
                angular.resumeBootstrap(), expect(element.html()).toBe("3"), expect(window.name).toEqual("my custom name");
            });
        });
    }), describe("startingElementHtml", function() {
        it("should show starting element tag only", function() {
            expect(startingTag('<ng-abc x="2A"><div>text</div></ng-abc>')).toBe('<ng-abc x="2A">');
        });
    }), describe("startingTag", function() {
        it("should allow passing in Nodes instead of Elements", function() {
            var txtNode = document.createTextNode("some text");
            expect(startingTag(txtNode)).toBe("some text");
        });
    }), describe("snake_case", function() {
        it("should convert to snake_case", function() {
            expect(snake_case("ABC")).toEqual("a_b_c"), expect(snake_case("alanBobCharles")).toEqual("alan_bob_charles");
        }), it("should allow separator to be overridden", function() {
            expect(snake_case("ABC", "&")).toEqual("a&b&c"), expect(snake_case("alanBobCharles", "&")).toEqual("alan&bob&charles");
        });
    }), describe("fromJson", function() {
        it("should delegate to JSON.parse", function() {
            var spy = spyOn(JSON, "parse").andCallThrough();
            expect(fromJson("{}")).toEqual({}), expect(spy).toHaveBeenCalled();
        });
    }), describe("toJson", function() {
        it("should delegate to JSON.stringify", function() {
            var spy = spyOn(JSON, "stringify").andCallThrough();
            expect(toJson({})).toEqual("{}"), expect(spy).toHaveBeenCalled();
        }), it("should format objects pretty", function() {
            expect(toJson({
                a: 1,
                b: 2
            }, !0)).toBe('{\n  "a": 1,\n  "b": 2\n}'), expect(toJson({
                a: {
                    b: 2
                }
            }, !0)).toBe('{\n  "a": {\n    "b": 2\n  }\n}'), expect(toJson({
                a: 1,
                b: 2
            }, !1)).toBe('{"a":1,"b":2}'), expect(toJson({
                a: 1,
                b: 2
            }, 0)).toBe('{"a":1,"b":2}'), expect(toJson({
                a: 1,
                b: 2
            }, 1)).toBe('{\n "a": 1,\n "b": 2\n}'), expect(toJson({
                a: 1,
                b: 2
            }, {})).toBe('{\n  "a": 1,\n  "b": 2\n}');
        }), it("should not serialize properties starting with $$", function() {
            expect(toJson({
                $$some: "value"
            }, !1)).toEqual("{}");
        }), it("should serialize properties starting with $", function() {
            expect(toJson({
                $few: "v"
            }, !1)).toEqual('{"$few":"v"}');
        }), it("should not serialize $window object", function() {
            expect(toJson(window)).toEqual('"$WINDOW"');
        }), it("should not serialize $document object", function() {
            expect(toJson(document)).toEqual('"$DOCUMENT"');
        }), it("should not serialize scope instances", inject(function(segmentio) {
            expect(toJson({
                key: segmentio
            })).toEqual('{"key":"$SCOPE"}');
        })), it("should serialize undefined as undefined", function() {
            expect(toJson(void 0)).toEqual(void 0);
        });
    }), describe("isElement", function() {
        it("should return a boolean value", inject(function($compile, $document, $rootScope) {
            var element = $compile("<p>Hello, world!</p>")($rootScope), form = $document.find("body")[0], config = [ !1, !1, !1, !1, !1, !1, !1, !0, !0 ], data = [ null, void 0, "string", 1001, {}, 0, !1, form, element ];
            angular.forEach(data, function(value, key) {
                var message = angular.isElement(value);
                expect(typeof message).toEqual("boolean"), expect(message).toEqual(config[key]);
            });
        })), it("should return false for objects resembling a Backbone Collection", function() {
            var params3 = {
                children: [ {}, {}, {} ],
                find: function() {},
                on: function() {},
                off: function() {},
                bind: function() {}
            };
            expect(isElement(params3)).toBe(!1);
        }), it("should return false for arrays with node-like properties", function() {
            var a = [ 1, 2, 3 ];
            a.on = !0, expect(isElement(a)).toBe(!1);
        });
    });
});
