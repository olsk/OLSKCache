const { throws, rejects, deepEqual } = require('assert');


const mainModule = require('./main');

const OLSKDisk = require('OLSKDisk');
const pathPackage = require('path');

const kTesting = {
	StubRootDirectory: function () {
		return pathPackage.join(OLSKDisk.OLSKDiskWorkspaceTestingFolderName(), OLSKDisk.OLSKDiskWorkspaceTestingFolderSubfolderNameFor('alpha.cache'));
	},
	StubCacheObjectValid: function () {
		return {
			'test-1990-01-01T21:09:00.000Z': 12.34,
		};
	},
};

describe('OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject', function testOLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject() {

	it('throws if param1 not function', function() {
		throws(function() {
			mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(null, 'alpha', {});
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {}, null, {});
		}, /OLSKErrorInputInvalid/);
	});

	it('returns callback result if param3 not object', function() {
		deepEqual(mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', 1), 'zulu');
	});

	it('sets cacheObject[key] to callback result', function() {
		let item = {};
		mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', item);
		deepEqual(item['alpha'], 'zulu');
	});

	it('returns cached result if key exists', function() {
		let item = {};
		mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', item);
		deepEqual(mainModule.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'bravo';
		}, 'alpha', item), 'zulu');
	});

});

describe('OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory', function testOLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory() {

	beforeEach(function() {
		OLSKDisk.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws if param1 not object', function() {
		throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(null, 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), null, OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param3 not real directory', function() {
		throws(function() {
			mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns cache file path', function() {
		deepEqual(mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory())), pathPackage.join(kTesting.StubRootDirectory(), OLSKDisk.OLSKDiskCacheFolderName(), 'alpha' + '.' + mainModule.OLSKCacheFileExtensionJSON()));
	});

	it('returns null and writes data for json', function() {
		deepEqual(OLSKDisk.OLSKDiskReadFile(mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()))), JSON.stringify(kTesting.StubCacheObjectValid(), null, '\t'));
	});

});

describe('OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory', function testOLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory() {

	beforeEach(function() {
		OLSKDisk.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(null, kTesting.StubRootDirectory());
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param2 not real directory', function() {
		throws(function() {
			mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null', function() {
		deepEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory())), null);
	});

	it('returns cacheObject if exists', function() {
		mainModule.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()))
		deepEqual(mainModule.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', kTesting.StubRootDirectory()), kTesting.StubCacheObjectValid());
	});

});

describe('OLSKCacheResultFromObject', function testOLSKCacheResultFromObject() {

	it('rejects if param1 not object', function() {
		return rejects(mainModule.OLSKCacheResultFromObject(null, 'alfa', function () {}));
	});
	
	it('rejects if param2 not string', function() {
		return rejects(mainModule.OLSKCacheResultFromObject({}, null, function () {}));
	});
	
	it('rejects if param3 not function', function() {
		return rejects(mainModule.OLSKCacheResultFromObject({}, 'alfa', null));
	});
	
	it('returns value if exists', async function() {
		deepEqual(await mainModule.OLSKCacheResultFromObject({
			alfa: 'bravo',
		}, 'alfa', function () {}), 'bravo');
	});
	
	it('runs callback, sets value, and returns result', async function() {
		deepEqual(await mainModule.OLSKCacheResultFromObject({
		}, 'alfa', async function () {
			return Promise.resolve('bravo')
		}), 'bravo');
	});

});
