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
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), null, OLSKDisk.OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not real directory', function() {
		throws(function() {
			mainModule.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputNotValid/);
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
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not real directory', function() {
		throws(function() {
			mainModule.OLSKCacheReadFile('alpha', pathPackage.join(kTesting.StubRootDirectory(), 'alpha'));
		}, /OLSKErrorInputNotValid/);
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
	
	it('returns callback result', async function() {
		deepEqual(await mainModule.OLSKCacheResultFetchOnce({}, 'alfa', function () {
			return Promise.resolve('bravo')
		}), 'bravo');
	});
	
	it('stores callback result', async function() {
		let item = {
			alfa: [],
		};
		await mainModule.OLSKCacheResultFetchOnce(item, 'bravo', function () {
			item.alfa.push(null)

			return Promise.resolve('charlie')
		})
		await mainModule.OLSKCacheResultFetchOnce(item, 'bravo', function () {
			item.alfa.push(null)

			return Promise.resolve('charlie')
		})
		deepEqual(item.alfa.length, 1);
	});

});

describe('OLSKCacheResultFetchExpire', function testOLSKCacheResultFetchExpire() {

	it('rejects if param1 not object', function() {
		return rejects(mainModule.OLSKCacheResultFetchExpire(null, 'alfa', function () {}, 1));
	});
	
	it('rejects if param2 not string', function() {
		return rejects(mainModule.OLSKCacheResultFetchExpire({}, null, function () {}, 1));
	});
	
	it('rejects if param3 not function', function() {
		return rejects(mainModule.OLSKCacheResultFetchExpire({}, 'alfa', null, 1));
	});
	
	it('rejects if param4 not number', function() {
		return rejects(mainModule.OLSKCacheResultFetchExpire({}, 'alfa', function () {}, null));
	});
	
	it('returns value if exists', async function() {
		deepEqual(await mainModule.OLSKCacheResultFetchExpire({
			alfa: 'bravo',
		}, 'alfa', function () {}, 1), 'bravo');
	});
	
	it('returns callback result', async function() {
		deepEqual(await mainModule.OLSKCacheResultFetchExpire({}, 'alfa', function () {
			return Promise.resolve('bravo')
		}, 1), 'bravo');
	});
	
	it('stores callback result', async function() {
		let item = {
			alfa: [],
		};
		await mainModule.OLSKCacheResultFetchExpire(item, 'bravo', function () {
			item.alfa.push(null)

			return Promise.resolve('charlie')
		}, 1)
		await mainModule.OLSKCacheResultFetchExpire(item, 'bravo', function () {
			item.alfa.push(null)

			return Promise.resolve('charlie')
		}, 1)
		deepEqual(item.alfa.length, 1);
	});
	
	it('clears callback result after param4', async function() {
		let item = {
			alfa: [],
		};
		await mainModule.OLSKCacheResultFetchExpire(item, 'bravo', function () {
			item.alfa.push(null)

			return Promise.resolve('charlie')
		}, 5);

		await (new Promise(function (res, rej) {
			setTimeout(async function () {
				return res(await mainModule.OLSKCacheResultFetchExpire(item, 'bravo', function () {
					item.alfa.push(null)

					return Promise.resolve('charlie')
				}, 1));
			}, 10)
		}))
		
		deepEqual(item.alfa.length, 2);
	});

});

describe('OLSKCacheResultFetchRenew', function testOLSKCacheResultFetchRenew() {

	it('rejects if param1 not object', function() {
		return rejects(mainModule.OLSKCacheResultFetchRenew(null, 'alfa', function () {}, 1));
	});
	
	it('rejects if param2 not string', function() {
		return rejects(mainModule.OLSKCacheResultFetchRenew({}, null, function () {}, 1));
	});
	
	it('rejects if param3 not function', function() {
		return rejects(mainModule.OLSKCacheResultFetchRenew({}, 'alfa', null, 1));
	});
	
	it('rejects if param4 not number', function() {
		return rejects(mainModule.OLSKCacheResultFetchRenew({}, 'alfa', function () {}, null));
	});
	
	it('returns value if exists', async function() {
		deepEqual(await mainModule.OLSKCacheResultFetchRenew({
			alfa: 'bravo',
		}, 'alfa', function () {}, 1, clearInterval), 'bravo');
	});
	
	it('skips callback if exists', async function() {
		let item = {
			alfa: [],
		};

		await mainModule.OLSKCacheResultFetchRenew(item, 'bravo', function () {
			item.alfa.push(null)

			return 'charlie'
		}, 3, clearInterval);

		deepEqual(item.bravo, 'charlie');

		await mainModule.OLSKCacheResultFetchRenew(item, 'bravo', function () {
			item.alfa.push(null)

			return 'delta';
		}, 3, clearInterval)

		deepEqual(item.bravo, 'charlie');
		deepEqual(item.alfa.length, 1);
	});
	
	it('returns callback result', async function() {
		deepEqual(await mainModule.OLSKCacheResultFetchRenew({}, 'alfa', function () {
			return 'bravo'
		}, 1, clearInterval), 'bravo');
	});
	
	it('renews callback result after param4', async function() {
		let item = {};
		
		await mainModule.OLSKCacheResultFetchRenew(item, 'alfa', function () {
			return !item.alfa ? 'bravo' : 'charlie';
		}, 3, clearInterval);

		deepEqual(item.alfa, 'bravo');

		await (new Promise(function (res, rej) {
			return setTimeout(res, 5)
		}))
		
		deepEqual(item.alfa, 'charlie');
	});
	
	it('calls param5 if no value', async function() {
		let item = {};

		await mainModule.OLSKCacheResultFetchRenew(item, 'alfa', function () {
			return 'bravo';
		}, 3, function (timerID) {
			item.charlie = true;

			return clearInterval(timerID);
		});

		await (new Promise(function (res, rej) {
			return setTimeout(res, 5)
		}))

		deepEqual(item.charlie, true);
	});
	
	it('calls param5 on renewal', async function() {
		let item = {
			charlie: [],
		};

		await mainModule.OLSKCacheResultFetchRenew(item, 'alfa', function () {
			return 'bravo';
		}, 3, function (timerID) {
			item.charlie.push(null);

			if (item.charlie.length == 3) {
				return clearInterval(timerID);
			}
		});

		await (new Promise(function (res, rej) {
			return setTimeout(res, 15)
		}))

		deepEqual(item.charlie, [null, null, null]);
	});
	
	it('passes timerID to param5', async function() {
		let item = {
			alfa: [],
		};

		await mainModule.OLSKCacheResultFetchRenew(item, 'bravo', function () {
			return item.alfa.push(null);
		}, 3, function (timerID) {
			if (item.alfa.length >= 3) {
				return clearInterval(timerID);
			};
		});

		await (new Promise(function (res, rej) {
			return setTimeout(res, 15)
		}))
		
		deepEqual(item.alfa.length, 3);
	});

});

describe('OLSKCacheResultFetchInterval', function testOLSKCacheResultFetchInterval() {

	it('throws if param1 not object', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval(null, 'alfa', function () {}, 1);
		}, /OLSKErrorInputNotValid/);
	});
	
	it('throws if param2 not string', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval({}, null, function () {}, 1);
		}, /OLSKErrorInputNotValid/);
	});
	
	it('throws if param3 not function', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval({}, 'alfa', null, 1);
		}, /OLSKErrorInputNotValid/);
	});
	
	it('throws if param4 not number', function() {
		throws(function () {
			mainModule.OLSKCacheResultFetchInterval({}, 'alfa', function () {}, null);
		}, /OLSKErrorInputNotValid/);
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
		}, /RCSErrorInputNotValid/);
	});
	
	it('throws error if param4 not number', function() {
		throws(function() {
			mainModule.OLSKCacheExpiringMapEntry({}, null, null, null);
		}, /RCSErrorInputNotValid/);
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
