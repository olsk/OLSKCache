/*!
 * OLSKCache
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./main');

const OLSKDisk = require('OLSKDisk');
const pathPackage = require('path');

const kTesting = {
	StubRootDirectory: function () {
		return pathPackage.join(OLSKDisk.OLSKDiskWorkspaceTestingFolderName(),OLSKDisk.OLSKDiskWorkspaceTestingFolderSubfolderNameFor('alpha.cache'));
	},
	StubCacheObjectValid: function () {
		return {
			'test-1990-01-01T21:09:00.000Z': 12.34,
		};
	},
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
		let item = {};
		mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', item);
		assert.strictEqual(item['alpha'], 'zulu');
	});

	it('returns cached result if key exists', function() {
		let item = {};
		mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', item);
		assert.strictEqual(mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'bravo';
		}, 'alpha', item), 'zulu');
	});

});

describe('OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory', function testOLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory() {

	beforeEach(function() {
		OLSKDisk.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(null, 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), null, OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param3 not real directory', function() {
		assert.throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns param3', function() {
		assert.strictEqual(mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory())), null);
	});

	it('returns null and writes data for json', function() {
		mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));

		let patternFileFullPath = pathPackage.join(kTesting.StubRootDirectory(), OLSKDisk.OLSKDiskCacheFolderName(), 'alpha' + '.' + mainModule.OLSKCacheFileExtensionJSON());
		assert.strictEqual(OLSKDisk.OLSKDiskIsRealFilePath(patternFileFullPath), true);
		assert.strictEqual(OLSKDisk.OLSKDiskReadFile(patternFileFullPath), JSON.stringify(kTesting.StubCacheObjectValid(), null, '\t'));
	});

});

describe('OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory', function testOLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory() {

	beforeEach(function() {
		OLSKDisk.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(null, kTesting.StubRootDirectory());
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not real directory', function() {
		assert.throws(function() {
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null', function() {
		assert.strictEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory())), null);
	});

	it('returns cacheObject if exists', function() {
		mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()))
		assert.deepEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', kTesting.StubRootDirectory()), kTesting.StubCacheObjectValid());
	});

});
