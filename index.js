'use strict';

/**
 * Copyright (c) 2016, Andrea Bonomi <andrea.bonomi@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without
 * fee is hereby granted, provided that the above copyright notice and this permission notice appear
 * in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
 * AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
 * NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */

;(function() {
    var root = this;
    var hasRequire = (typeof require) !== 'undefined';
    var deepEqual = root.deepEqual || hasRequire && require('deep-equal');

    /**
     * Convert a list to an object using the given key name
     */
    function listToObject(list, key) {
        var length, result, i, obj, keyValue;
        if (!list) {
            list = [];
        }
        length = list.length;
        result = { valids: {}, discarded: [] };
        for (i = 0; i < length; i += 1) {
            obj = list[i];
            keyValue = obj[key];
            // discard the object without a key
            if (keyValue) {
                result.valids[keyValue] = obj;
            } else {
                result.discarded.push(obj);
            }
        }
        return result;
    }

    /**
     * Return a copy of an object excluding the given keys and all the functions
     */
    function exclude(obj, keys) {
        var result, key;
        result = {};
        keys = keys || [];
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (keys.indexOf(key) === -1) {
                    if (typeof obj[key] !== 'function') {
                        result[key] = obj[key];
                    }
                }
            }
        }
        return result;
    }

    /**
     * Copy the 'options.keep' keys from orig to dest
     */
    function keep(orig, dest, options) {
        var keep, i, t;
        keep = options.keep || [];
        if (keep.length === 0) {
            return dest;
        }
        for (i = 0; i < keep.length; i += 1) {
            t = orig[keep[i]];
            if (t !== undefined) {
                dest[keep[i]] = t;
            }
        }
        return dest;
    }

    /**
     * Compare two arrays of objects and return the added/removed/modified objects
     *
     * options:
     * - key: name of the key (mandatory)
     * - exclude: optional list of excluded key (not compared)
     * - keep: optional list of keys copied (before comparing) from orig to dest
     */
    function diff(orig, dest, options) {
        var result, key, obj, objEx, origObj, origObjEx, i, t;
        orig = listToObject(orig, options.key);
        dest = listToObject(dest, options.key);
        result = { added: [], removed: [], modified: [], unchanged: [] };
        for (key in dest.valids) {
            if (dest.valids.hasOwnProperty(key)) {
                obj = dest.valids[key];
                origObj = orig.valids[key];
                if (origObj === undefined) {
                    result.added.push(obj);
                } else {
                    // keep and exclude
                    keep(origObj, obj, options);
                    objEx = exclude(obj, options.exclude);
                    origObjEx = exclude(origObj, options.exclude);
                    // compare
                    if (deepEqual(objEx, origObjEx)) {
                        result.unchanged.push(obj);
                    } else {
                        result.modified.push(obj);
                    }
                    delete orig.valids[key];
                }
            }
        }
        for (key in orig.valids) {
            if (orig.valids.hasOwnProperty(key)) {
                result.removed.push(orig.valids[key]);
            }
        }
        // discarded object (without a key)
        if (orig.discarded.length) {
            result.discardedOrig = orig.discarded;
        }
        if (dest.discarded.length) {
            result.discardedDest = dest.discarded;
        }
        // for (i = 0; i < orig.discarded.length; i =+ 1) {
        //     t = orig.discarded[i];
        // }

        return result;
    }

    /* istanbul ignore next */
    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = diff;
        }
        exports.diff = diff;
    } else {
        root.diff = diff;
    }

}).call(this);

