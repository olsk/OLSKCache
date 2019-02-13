/*!
 * OLSKCache
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./main');

const OLSKFilesystem = require('OLSKFilesystem');
const pathPackage = require('path');
const fsPackage = require('fs');

const kTesting = {
	StubRootDirectory: function () {
		return pathPackage.join(OLSKFilesystem.OLSKFilesystemWorkspaceTestingDirectoryName(),OLSKFilesystem.OLSKFilesystemWorkspaceTestingDirectorySubfolderNameFor('alpha.cache'));
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
		if (OLSKFilesystem.OLSKFilesystemInputDataIsRealDirectoryPath(kTesting.StubRootDirectory())) {
			OLSKFilesystem.OLSKFilesystemHelpDeleteDirectoryRecursive(kTesting.StubRootDirectory());
		}
	});

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(null, 'alpha', OLSKFilesystem.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), null, OLSKFilesystem.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param3 not real directory', function() {
		assert.throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns param3', function() {
		assert.strictEqual(mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKFilesystem.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist(kTesting.StubRootDirectory())), null);
	});

	it('returns null and writes data for json', function() {
		mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKFilesystem.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist(kTesting.StubRootDirectory()));

		let patternFileFullPath = pathPackage.join(kTesting.StubRootDirectory(), OLSKFilesystem.OLSKFilesystemCacheDirectoryName(), 'alpha' + '.' + mainModule.OLSKCacheFileExtensionJSON());
		assert.strictEqual(OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(patternFileFullPath), true);
		assert.strictEqual(fsPackage.readFileSync(patternFileFullPath, OLSKFilesystem.OLSKFilesystemDefaultTextEncoding()), JSON.stringify(kTesting.StubCacheObjectValid(), null, '\t'));
	});

});

describe('OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory', function testOLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory() {

	beforeEach(function() {
		if (OLSKFilesystem.OLSKFilesystemInputDataIsRealDirectoryPath(kTesting.StubRootDirectory())) {
			OLSKFilesystem.OLSKFilesystemHelpDeleteDirectoryRecursive(kTesting.StubRootDirectory());
		}
	});

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			OLSKFilesystem.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist(pathPackage.join(kTesting.StubRootDirectory(), OLSKFilesystem.OLSKFilesystemCacheDirectoryName()));
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(null, kTesting.StubRootDirectory());
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param2 not real directory', function() {
		assert.throws(function() {
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null', function() {
		assert.strictEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', OLSKFilesystem.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist(kTesting.StubRootDirectory())), null);
	});

	it('returns cacheObject if exists', function() {
		mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKFilesystem.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist(kTesting.StubRootDirectory()))
		assert.deepEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', kTesting.StubRootDirectory()), kTesting.StubCacheObjectValid());
	});

});
