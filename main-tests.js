/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var cacheLibrary = require('./main');
var filesystemLibrary = require('OLSKFilesystem');

var fsPackage = require('fs');
var pathPackage = require('path');
var mkdirpPackage = require('mkdirp');

var testRootDirectory = pathPackage.join(
	filesystemLibrary.OLSKFilesystemWorkspaceTestingDirectoryName(),
	filesystemLibrary.OLSKFilesystemWorkspaceTestingDirectorySubfolderNameFor('alpha.cache'));

var OLSKTestingCacheObjectValid = function() {
	return {
		'test-1990-01-01T21:09:00.000Z': 12.34,
	};
};

describe('OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject', function testOLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject() {

	it('throws error if param1 not function', function() {
		assert.throws(function() {
			cacheLibrary.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(null, 'alpha', {});
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			cacheLibrary.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {}, null, {});
		}, /OLSKErrorInputInvalid/);
	});

	it('returns callback result if param3 not object', function() {
		assert.strictEqual(cacheLibrary.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', 1), 'zulu');
	});

	it('sets cacheObject[key] to callback result', function() {
		var cacheObject = {};
		cacheLibrary.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(cacheObject['alpha'], 'zulu');
	});

	it('returns cached result if key exists', function() {
		var cacheObject = {};
		cacheLibrary.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(cacheLibrary.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'bravo';
		}, 'alpha', cacheObject), 'zulu');
	});

});

describe('OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory', function testOLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory() {

	beforeEach(function() {
		if (fsPackage.existsSync(testRootDirectory)) {
			filesystemLibrary.OLSKFilesystemHelpDeleteDirectoryRecursive(testRootDirectory);
		}
	});

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mkdirpPackage.sync(testRootDirectory);
			cacheLibrary.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(null, 'alpha', testRootDirectory);
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mkdirpPackage.sync(testRootDirectory);
			cacheLibrary.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(OLSKTestingCacheObjectValid(), null, testRootDirectory);
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param3 not real directory', function() {
		assert.throws(function() {
			cacheLibrary.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(OLSKTestingCacheObjectValid(), 'alpha', pathPackage.join(testRootDirectory, 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null and writes data for json', function() {
		var cacheObject = OLSKTestingCacheObjectValid();
		mkdirpPackage.sync(testRootDirectory);
		assert.strictEqual(cacheLibrary.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, 'alpha', testRootDirectory), null);

		var patternFileFullPath = pathPackage.join(testRootDirectory, filesystemLibrary.OLSKFilesystemCacheDirectoryName(), 'alpha' + '.' + filesystemLibrary.OLSKFilesystemSharedFileExtensionJSON());
		assert.strictEqual(fsPackage.existsSync(patternFileFullPath), true);
		assert.strictEqual(fsPackage.readFileSync(patternFileFullPath, filesystemLibrary.OLSKFilesystemDefaultTextEncoding()), JSON.stringify(cacheObject, null, '\t'));
	});

});

describe('OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory', function testOLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory() {

	beforeEach(function() {
		if (fsPackage.existsSync(testRootDirectory)) {
			filesystemLibrary.OLSKFilesystemHelpDeleteDirectoryRecursive(testRootDirectory);
		}
	});

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			mkdirpPackage.sync(pathPackage.join(testRootDirectory, filesystemLibrary.OLSKFilesystemCacheDirectoryName()));
			cacheLibrary.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(null, testRootDirectory);
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not real directory', function() {
		assert.throws(function() {
			cacheLibrary.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', pathPackage.join(testRootDirectory, 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null if cache directory does not exist', function() {
		mkdirpPackage.sync(testRootDirectory);
		assert.strictEqual(cacheLibrary.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), null);
	});

	it('returns null if cacheKey does not exist', function() {
		mkdirpPackage.sync(pathPackage.join(testRootDirectory, filesystemLibrary.OLSKFilesystemCacheDirectoryName()));
		assert.strictEqual(cacheLibrary.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), null);
	});

	it('returns cacheObject', function() {
		mkdirpPackage.sync(testRootDirectory);

		var cacheObject = OLSKTestingCacheObjectValid();
		assert.strictEqual(cacheLibrary.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, 'alpha', testRootDirectory), null);
		assert.deepEqual(cacheLibrary.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), cacheObject);
	});

});
