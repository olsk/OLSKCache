/*!
 * OLSKCache
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./main');
const OLSKFilesystem = require('OLSKFilesystem');

var mkdirpPackage = require('mkdirp');
const fsPackage = require('fs');
const pathPackage = require('path');

const testRootDirectory = pathPackage.join(
	OLSKFilesystem.OLSKFilesystemWorkspaceTestingDirectoryName(),
	OLSKFilesystem.OLSKFilesystemWorkspaceTestingDirectorySubfolderNameFor('alpha.cache'));

const OLSKTestingCacheObjectValid = function() {
	return {
		'test-1990-01-01T21:09:00.000Z': 12.34,
	};
};

describe('OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject', function testOLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject() {

	it('throws error if param1 not function', function() {
		assert.throws(function() {
			mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(null, 'alpha', {});
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {}, null, {});
		}, /OLSKErrorInputInvalid/);
	});

	it('returns callback result if param3 not object', function() {
		assert.strictEqual(mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', 1), 'zulu');
	});

	it('sets cacheObject[key] to callback result', function() {
		var cacheObject = {};
		mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(cacheObject['alpha'], 'zulu');
	});

	it('returns cached result if key exists', function() {
		var cacheObject = {};
		mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'bravo';
		}, 'alpha', cacheObject), 'zulu');
	});

});

describe('OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory', function testOLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory() {

	beforeEach(function() {
		if (fsPackage.existsSync(testRootDirectory)) {
			OLSKFilesystem.OLSKFilesystemHelpDeleteDirectoryRecursive(testRootDirectory);
		}
	});

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mkdirpPackage.sync(testRootDirectory);
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(null, 'alpha', testRootDirectory);
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mkdirpPackage.sync(testRootDirectory);
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(OLSKTestingCacheObjectValid(), null, testRootDirectory);
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param3 not real directory', function() {
		assert.throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(OLSKTestingCacheObjectValid(), 'alpha', pathPackage.join(testRootDirectory, 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null and writes data for json', function() {
		var cacheObject = OLSKTestingCacheObjectValid();
		mkdirpPackage.sync(testRootDirectory);
		assert.strictEqual(mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, 'alpha', testRootDirectory), null);

		var patternFileFullPath = pathPackage.join(testRootDirectory, OLSKFilesystem.OLSKFilesystemCacheDirectoryName(), 'alpha' + '.' + mainModule.OLSKCacheFileExtensionJSON());
		assert.strictEqual(fsPackage.existsSync(patternFileFullPath), true);
		assert.strictEqual(fsPackage.readFileSync(patternFileFullPath, OLSKFilesystem.OLSKFilesystemDefaultTextEncoding()), JSON.stringify(cacheObject, null, '\t'));
	});

});

describe('OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory', function testOLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory() {

	beforeEach(function() {
		if (fsPackage.existsSync(testRootDirectory)) {
			OLSKFilesystem.OLSKFilesystemHelpDeleteDirectoryRecursive(testRootDirectory);
		}
	});

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			mkdirpPackage.sync(pathPackage.join(testRootDirectory, OLSKFilesystem.OLSKFilesystemCacheDirectoryName()));
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(null, testRootDirectory);
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not real directory', function() {
		assert.throws(function() {
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', pathPackage.join(testRootDirectory, 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null if cache directory does not exist', function() {
		mkdirpPackage.sync(testRootDirectory);
		assert.strictEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), null);
	});

	it('returns null if cacheKey does not exist', function() {
		mkdirpPackage.sync(pathPackage.join(testRootDirectory, OLSKFilesystem.OLSKFilesystemCacheDirectoryName()));
		assert.strictEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), null);
	});

	it('returns cacheObject', function() {
		mkdirpPackage.sync(testRootDirectory);

		var cacheObject = OLSKTestingCacheObjectValid();
		assert.strictEqual(mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, 'alpha', testRootDirectory), null);
		assert.deepEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), cacheObject);
	});

});
