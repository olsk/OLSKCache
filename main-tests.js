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

describe('OLSKCacheWriteFile', function testOLSKCacheWriteFile() {

	beforeEach(function() {
		OLSKDisk.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws if param1 not object', function() {
		throws(function() {
			mainModule.OLSKCacheWriteFile(null, 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), null, OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param3 not real directory', function() {
		throws(function() {
			mainModule.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns cache file path', function() {
		deepEqual(mainModule.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory())), pathPackage.join(kTesting.StubRootDirectory(), OLSKDisk.OLSKDiskCacheFolderName(), 'alpha' + '.' + mainModule.OLSKCacheFileExtensionJSON()));
	});

	it('returns null and writes data for json', function() {
		deepEqual(OLSKDisk.OLSKDiskReadFile(mainModule.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()))), JSON.stringify(kTesting.StubCacheObjectValid(), null, '\t'));
	});

});

describe('OLSKCacheReadFile', function testOLSKCacheReadFile() {

	beforeEach(function() {
		OLSKDisk.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule.OLSKCacheReadFile(null, kTesting.StubRootDirectory());
		}, /OLSKErrorInputInvalid/);
	});

	it('throws if param2 not real directory', function() {
		throws(function() {
			mainModule.OLSKCacheReadFile('alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputInvalid/);
	});

	it('returns null', function() {
		deepEqual(mainModule.OLSKCacheReadFile('alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory())), null);
	});

	it('returns cacheObject if exists', function() {
		mainModule.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alpha', OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()))
		deepEqual(mainModule.OLSKCacheReadFile('alpha', kTesting.StubRootDirectory()), kTesting.StubCacheObjectValid());
	});

});

describe('OLSKCacheResultFetchOnce', function testOLSKCacheResultFetchOnce() {

	it('rejects if param1 not object', function() {
		return rejects(mainModule.OLSKCacheResultFetchOnce(null, 'alfa', function () {}));
	});
	
	it('rejects if param2 not string', function() {
		return rejects(mainModule.OLSKCacheResultFetchOnce({}, null, function () {}));
	});
	
	it('rejects if param3 not function', function() {
		return rejects(mainModule.OLSKCacheResultFetchOnce({}, 'alfa', null));
	});
	
	it('returns value if exists', async function() {
		deepEqual(await mainModule.OLSKCacheResultFetchOnce({
			alfa: 'bravo',
		}, 'alfa', function () {}), 'bravo');
	});
	
	it('runs callback, sets value, and returns result', async function() {
		deepEqual(await mainModule.OLSKCacheResultFetchOnce({}, 'alfa', function () {
			return Promise.resolve('bravo')
		}), 'bravo');
	});

});

describe('OLSKCacheResultFetchInterval', function testOLSKCacheResultFetchInterval() {

	it('throws if param1 not object', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval(null, 'alfa', function () {}, 1);
		}, /OLSKErrorInputInvalid/);
	});
	
	it('throws if param2 not string', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval({}, null, function () {}, 1);
		}, /OLSKErrorInputInvalid/);
	});
	
	it('throws if param3 not function', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval({}, 'alfa', null, 1);
		}, /OLSKErrorInputInvalid/);
	});
	
	it('throws if param4 not number', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval({}, 'alfa', function () {}, null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns timerID', function() {
		deepEqual(mainModule.OLSKCacheResultFetchInterval({}, 'alfa', function () {}, 1).constructor.name, 'Timeout');
	});
	
	it('updates result before interval', function(done) {
		let item = {};

		mainModule.OLSKCacheResultFetchInterval(item, 'alfa', function () {
			return [item.alfa];
		}, 10)

		setTimeout(function() {
			deepEqual(item.alfa, [undefined]);

			done();
		}, 5);
	});
	
	it('updates result after interval once', function(done) {
		let item = {};

		mainModule.OLSKCacheResultFetchInterval(item, 'alfa', function () {
			return [item.alfa];
		}, 10)

		setTimeout(function() {
			deepEqual(item.alfa, [[undefined]]);

			done();
		}, 15);
	});
	
	it('updates result after interval once', function(done) {
		let item = {};

		mainModule.OLSKCacheResultFetchInterval(item, 'alfa', function () {
			return [item.alfa];
		}, 10)

		setTimeout(function() {
			deepEqual(item.alfa, [[[undefined]]]);

			done();
		}, 25);
	});

});

describe('OLSKCacheExpiringMapEntry', function testOLSKCacheExpiringMapEntry() {

	it('throws error if param1 not object', function() {
		throws(function() {
			mainModule.OLSKCacheExpiringMapEntry(null, null, null, 1);
		}, /RCSErrorInputInvalid/);
	});
	
	it('throws error if param4 not number', function() {
		throws(function() {
			mainModule.OLSKCacheExpiringMapEntry({}, null, null, null);
		}, /RCSErrorInputInvalid/);
	});
	
	it('returns param2', function() {
		deepEqual(mainModule.OLSKCacheExpiringMapEntry({}, 'alfa', null, 0), 'alfa');
	});
	
	it('sets param2', function() {
		let item = {};

		mainModule.OLSKCacheExpiringMapEntry(item, 'alfa', 'bravo', 10)

		deepEqual(item, {
			alfa: 'bravo',
		});
	});
	
	it('keeps param2 until duration', function(done) {
		let item = {};

		mainModule.OLSKCacheExpiringMapEntry(item, 'alfa', 'bravo', 10)

		setTimeout(function () {
			deepEqual(item, {
				alfa: 'bravo',
			});

			done();
		}, 5)
	});
	
	it('deletes param2 after duration', function(done) {
		let item = {};

		mainModule.OLSKCacheExpiringMapEntry(item, 'alfa', 'bravo', 10)

		setTimeout(function () {
			deepEqual(item, {});

			done();
		}, 15)
	});

});
