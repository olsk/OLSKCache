const { throws, rejects, deepEqual } = require('assert');

const mod = require('./main.js');

const kTesting = {
	StubRootDirectory: function () {
		return require('path').join(__dirname, '__testing', require('OLSKDisk').OLSKDiskWorkspaceTestingFolderSubfolderNameFor('alfa.cache'));
	},
	StubCacheObjectValid: function () {
		return {
			'test-1990-01-01T21:09:00.000Z': 12.34,
		};
	},
};

describe('OLSKCacheWriteFile', function test_OLSKCacheWriteFile() {

	beforeEach(function() {
		require('OLSKDisk').OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws if param1 not object', function() {
		throws(function() {
			mod.OLSKCacheWriteFile(null, 'alfa', require('OLSKDisk').OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), null, require('OLSKDisk').OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not string', function() {
		throws(function() {
			mod.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alfa', null);
		}, /OLSKErrorInputNotValid/);
	});

	it('writes data', function() {
		const item = require('OLSKDisk').OLSKDiskCreateFolder(kTesting.StubRootDirectory());
		
		mod.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alfa', item);

		deepEqual(require('OLSKDisk').OLSKDiskReadFile(require('path').join(item, 'alfa.json')), JSON.stringify(kTesting.StubCacheObjectValid(), null, '\t'));
	});

	it('returns param1', function() {
		deepEqual(mod.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alfa', require('OLSKDisk').OLSKDiskCreateFolder(kTesting.StubRootDirectory())), kTesting.StubCacheObjectValid());
	});

});

describe('OLSKCacheReadFile', function test_OLSKCacheReadFile() {

	beforeEach(function() {
		require('OLSKDisk').OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('throws if param1 not string', function() {
		throws(function() {
			mod.OLSKCacheReadFile(null, kTesting.StubRootDirectory());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod.OLSKCacheReadFile('alfa', null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns null', function() {
		deepEqual(mod.OLSKCacheReadFile('alfa', require('OLSKDisk').OLSKDiskCreateFolder(kTesting.StubRootDirectory())), null);
	});

	it('returns cacheObject if exists', function() {
		mod.OLSKCacheWriteFile(kTesting.StubCacheObjectValid(), 'alfa', require('OLSKDisk').OLSKDiskCreateFolder(kTesting.StubRootDirectory()));
		deepEqual(mod.OLSKCacheReadFile('alfa', kTesting.StubRootDirectory()), kTesting.StubCacheObjectValid());
	});

});

describe('OLSKCacheResultFetchOnce', function test_OLSKCacheResultFetchOnce() {

	it('rejects if param1 not object', function() {
		return rejects(mod.OLSKCacheResultFetchOnce(null, 'alfa', function () {}));
	});
	
	it('rejects if param2 not string', function() {
		return rejects(mod.OLSKCacheResultFetchOnce({}, null, function () {}));
	});
	
	it('rejects if param3 not function', function() {
		return rejects(mod.OLSKCacheResultFetchOnce({}, 'alfa', null));
	});
	
	it('returns value if exists', async function() {
		deepEqual(await mod.OLSKCacheResultFetchOnce({
			alfa: 'bravo',
		}, 'alfa', function () {}), 'bravo');
	});
	
	it('returns callback result', async function() {
		deepEqual(await mod.OLSKCacheResultFetchOnce({}, 'alfa', function () {
			return Promise.resolve('bravo');
		}), 'bravo');
	});
	
	it('stores callback result', async function() {
		let item = {
			alfa: [],
		};
		await mod.OLSKCacheResultFetchOnce(item, 'bravo', function () {
			return item.alfa.push('charlie');
		});
		await mod.OLSKCacheResultFetchOnce(item, 'bravo', function () {
			return item.alfa.push('delta');

			return Promise.resolve('charlie');
		});
		deepEqual(item.alfa, ['charlie']);
	});

});

describe('OLSKCacheResultFetchOnceSync', function test_OLSKCacheResultFetchOnceSync() {

	it('throws if param1 not object', function() {
		throws(function () {
			mod.OLSKCacheResultFetchOnceSync(null, 'alfa', function () {});
		}, /ErrorInputNotValid/);
	});
	
	it('throws if param2 not string', function() {
		throws(function () {
			mod.OLSKCacheResultFetchOnceSync({}, null, function () {});
		}, /ErrorInputNotValid/);
	});
	
	it('throws if param3 not function', function() {
		throws(function () {
			mod.OLSKCacheResultFetchOnceSync({}, 'alfa', null);
		}, /ErrorInputNotValid/);
	});
	
	it('returns value if exists', function() {
		deepEqual(mod.OLSKCacheResultFetchOnceSync({
			alfa: 'bravo',
		}, 'alfa', function () {}), 'bravo');
	});
	
	it('returns callback result', async function() {
		deepEqual(await mod.OLSKCacheResultFetchOnceSync({}, 'alfa', function () {
			return Promise.resolve('bravo');
		}), 'bravo');
	});
	
	it('stores callback result', async function() {
		let item = {
			alfa: [],
		};
		await mod.OLSKCacheResultFetchOnceSync(item, 'bravo', function () {
			return item.alfa.push('charlie');
		});
		await mod.OLSKCacheResultFetchOnceSync(item, 'bravo', function () {
			return item.alfa.push('delta');

			return Promise.resolve('charlie');
		});
		deepEqual(item.alfa, ['charlie']);
	});
	
	it('stores calls without await', async function() {
		let item = {
			alfa: [],
		};
		mod.OLSKCacheResultFetchOnceSync(item, 'bravo', function () {
			return item.alfa.push('charlie');
		});
		await mod.OLSKCacheResultFetchOnceSync(item, 'bravo', function () {
			return item.alfa.push('delta');
		});
		deepEqual(item.alfa, ['charlie']);
	});

});

describe('OLSKCacheResultFetchExpire', function test_OLSKCacheResultFetchExpire() {

	it('rejects if param1 not object', function() {
		return rejects(mod.OLSKCacheResultFetchExpire(null, 'alfa', function () {}, 1));
	});
	
	it('rejects if param2 not string', function() {
		return rejects(mod.OLSKCacheResultFetchExpire({}, null, function () {}, 1));
	});
	
	it('rejects if param3 not function', function() {
		return rejects(mod.OLSKCacheResultFetchExpire({}, 'alfa', null, 1));
	});
	
	it('rejects if param4 not number', function() {
		return rejects(mod.OLSKCacheResultFetchExpire({}, 'alfa', function () {}, null));
	});
	
	it('returns value if exists', async function() {
		deepEqual(await mod.OLSKCacheResultFetchExpire({
			alfa: 'bravo',
		}, 'alfa', function () {}, 1), 'bravo');
	});
	
	it('returns callback result', async function() {
		deepEqual(await mod.OLSKCacheResultFetchExpire({}, 'alfa', function () {
			return Promise.resolve('bravo');
		}, 1), 'bravo');
	});
	
	it('stores callback result', async function() {
		let item = {
			alfa: [],
		};
		await mod.OLSKCacheResultFetchExpire(item, 'bravo', function () {
			item.alfa.push(null);

			return Promise.resolve('charlie');
		}, 1);
		await mod.OLSKCacheResultFetchExpire(item, 'bravo', function () {
			item.alfa.push(null);

			return Promise.resolve('charlie');
		}, 1);
		deepEqual(item.alfa.length, 1);
	});
	
	it('clears callback result after param4', async function() {
		let item = {
			alfa: [],
		};
		await mod.OLSKCacheResultFetchExpire(item, 'bravo', function () {
			item.alfa.push(null);

			return Promise.resolve('charlie');
		}, 5);

		await (new Promise(function (res, rej) {
			setTimeout(async function () {
				return res(await mod.OLSKCacheResultFetchExpire(item, 'bravo', function () {
					item.alfa.push(null);

					return Promise.resolve('charlie');
				}, 1));
			}, 10);
		}));
		
		deepEqual(item.alfa.length, 2);
	});

});

describe('OLSKCacheResultFetchRenew', function test_OLSKCacheResultFetchRenew() {

	const _OLSKCacheResultFetchRenew = function (inputData) {
		return mod.OLSKCacheResultFetchRenew(Object.assign({
			ParamMap: {},
			ParamKey: Math.random().toString(),
			ParamCallback: (function () {}),
			ParamInterval: 1,
			_ParamCallbackDidFinish: clearInterval,
		}, inputData));
	};

	it('rejects if not object', function() {
		return rejects(mod.OLSKCacheResultFetchRenew(null));
	});

	it('rejects if ParamMap not object', function() {
		return rejects(_OLSKCacheResultFetchRenew({
			ParamMap: null,
		}));
	});
	
	it('rejects if ParamKey not string', function() {
		return rejects(_OLSKCacheResultFetchRenew({
			ParamKey: null,
		}));
	});
	
	it('rejects if ParamCallback not function', function() {
		return rejects(_OLSKCacheResultFetchRenew({
			ParamCallback: null,
		}));
	});
	
	it('rejects if ParamInterval not number', function() {
		return rejects(_OLSKCacheResultFetchRenew({
			ParamInterval: '1',
		}));
	});

	context('no existing', function () {

		it('returns callback result', async function() {
			const item = Math.random().toString();

			deepEqual(await _OLSKCacheResultFetchRenew({
				ParamCallback: (function () {
					return item;
				}),
			}), item);
		});

		it('assigns result to key', async function () {
			const ParamMap = {};

			const ParamKey = Math.random().toString();

			await _OLSKCacheResultFetchRenew({
				ParamMap,
				ParamKey,
				ParamCallback: (function () {
					return ParamKey;
				}),
			});

			deepEqual(ParamMap, {
				[ParamKey]: ParamKey,
			});
		});

		it('calls _ParamCallbackDidFinish', async function() {
			const ParamMap = {};
			const ParamKey = Math.random().toString();
			const _ParamCallbackDidFinish = Math.random().toString();

			await _OLSKCacheResultFetchRenew({
				ParamMap,
				ParamKey,
				ParamCallback: (function () {
					return Math.random().toString();
				}),
				_ParamCallbackDidFinish: (function () {
					ParamMap[ParamKey] = _ParamCallbackDidFinish;
				}),
			});

			await (new Promise(function (res, rej) {
				return setTimeout(res, 5);
			}));

			deepEqual(ParamMap, {
				[ParamKey]: _ParamCallbackDidFinish,
			});
		});

	});

	context('existing', function () {
		
		it('returns value', async function() {
			const ParamKey = Math.random().toString();

			deepEqual(await _OLSKCacheResultFetchRenew({
				ParamMap: {
					ParamKey,
				},
				ParamKey: 'ParamKey',
			}), ParamKey);
		});

		it('skips ParamCallback', async function() {
			const item = [];

			const ParamKey = Math.random().toString();

			await _OLSKCacheResultFetchRenew({
				ParamMap: {
					ParamKey,
				},
				ParamKey: 'ParamKey',
				ParamCallback: (function () {
					item.push(null);
				}),
			})

			deepEqual(item, []);
		});
		
		it('renews callback result after ParamInterval', async function() {
			const ParamKey = Math.random().toString();
			const ParamMap = {
				ParamKey,
			};
			const result = Math.random().toString();

			await _OLSKCacheResultFetchRenew({
				ParamMap,
				ParamKey: 'ParamKey',
				ParamCallback: (function () {
					return result;
				}),
			})

			deepEqual(ParamMap, {
				ParamKey
			});

			await (new Promise(function (res, rej) {
				return setTimeout(res, 5);
			}));
			
			deepEqual(ParamMap, {
				ParamKey: result,
			});
		});

		it('calls _ParamCallbackDidFinish', async function() {
			const ParamKey = Math.random().toString();
			const ParamMap = {
				[ParamKey]: ParamKey,
			};
			const _ParamCallbackDidFinish = Math.random().toString();

			await _OLSKCacheResultFetchRenew({
				ParamMap,
				ParamKey,
				ParamCallback: (function () {
					return Math.random().toString();
				}),
				_ParamCallbackDidFinish: (function () {
					ParamMap[ParamKey] = _ParamCallbackDidFinish;
				}),
			})

			deepEqual(ParamMap, {
				[ParamKey]: ParamKey,
			});

			await (new Promise(function (res, rej) {
				return setTimeout(res, 5);
			}));
			
			deepEqual(ParamMap, {
				[ParamKey]: _ParamCallbackDidFinish,
			});
		});
	
	});

	context('_ParamCallbackDidFinish', function () {

		it('passes timerID', async function() {
			const ParamKey = Math.random().toString();
			const ParamMap = {
				[ParamKey]: 0,
			};

			await _OLSKCacheResultFetchRenew({
				ParamMap,
				ParamKey,
				ParamCallback: (function () {
					return ParamMap[ParamKey] + 1;
				}),
				_ParamCallbackDidFinish: (function (timerID) {
					if (ParamMap[ParamKey] >= 3) {
						return clearInterval(timerID);
					}
				}),
			});

			await (new Promise(function (res, rej) {
				return setTimeout(res, 15);
			}));
			
			deepEqual(ParamMap[ParamKey], 3);
		});
	
	});

});

describe('OLSKCacheResultFetchInterval', function test_OLSKCacheResultFetchInterval() {

	it('throws if param1 not object', function() {
		throws(function () {
			mod.OLSKCacheResultFetchInterval(null, 'alfa', function () {}, 1);
		}, /OLSKErrorInputNotValid/);
	});
	
	it('throws if param2 not string', function() {
		throws(function () {
			mod.OLSKCacheResultFetchInterval({}, null, function () {}, 1);
		}, /OLSKErrorInputNotValid/);
	});
	
	it('throws if param3 not function', function() {
		throws(function () {
			mod.OLSKCacheResultFetchInterval({}, 'alfa', null, 1);
		}, /OLSKErrorInputNotValid/);
	});
	
	it('throws if param4 not number', function() {
		throws(function () {
			mod.OLSKCacheResultFetchInterval({}, 'alfa', function () {}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns timerID', function() {
		deepEqual(mod.OLSKCacheResultFetchInterval({}, 'alfa', function () {}, 1).constructor.name, 'Timeout');
	});
	
	it('updates result before interval', function(done) {
		let item = {};

		mod.OLSKCacheResultFetchInterval(item, 'alfa', function () {
			return [item.alfa];
		}, 10);

		setTimeout(function() {
			deepEqual(item.alfa, [undefined]);

			done();
		}, 5);
	});
	
	it('updates result after interval once', function(done) {
		let item = {};

		mod.OLSKCacheResultFetchInterval(item, 'alfa', function () {
			return [item.alfa];
		}, 10);

		setTimeout(function() {
			deepEqual(item.alfa, [[undefined]]);

			done();
		}, 15);
	});
	
	it('updates result after interval once', function(done) {
		let item = {};

		mod.OLSKCacheResultFetchInterval(item, 'alfa', function () {
			return [item.alfa];
		}, 10);

		setTimeout(function() {
			deepEqual(item.alfa, [[[undefined]]]);

			done();
		}, 25);
	});

});

describe('OLSKCacheExpiringMapEntry', function test_OLSKCacheExpiringMapEntry() {

	it('throws error if param1 not object', function() {
		throws(function() {
			mod.OLSKCacheExpiringMapEntry(null, null, null, 1);
		}, /RCSErrorInputNotValid/);
	});
	
	it('throws error if param4 not number', function() {
		throws(function() {
			mod.OLSKCacheExpiringMapEntry({}, null, null, null);
		}, /RCSErrorInputNotValid/);
	});
	
	it('returns param2', function() {
		deepEqual(mod.OLSKCacheExpiringMapEntry({}, 'alfa', null, 0), 'alfa');
	});
	
	it('sets param2', function() {
		let item = {};

		mod.OLSKCacheExpiringMapEntry(item, 'alfa', 'bravo', 10);

		deepEqual(item, {
			alfa: 'bravo',
		});
	});
	
	it('keeps param2 until duration', function(done) {
		let item = {};

		mod.OLSKCacheExpiringMapEntry(item, 'alfa', 'bravo', 10);

		setTimeout(function () {
			deepEqual(item, {
				alfa: 'bravo',
			});

			done();
		}, 5);
	});
	
	it('deletes param2 after duration', function(done) {
		let item = {};

		mod.OLSKCacheExpiringMapEntry(item, 'alfa', 'bravo', 10);

		setTimeout(function () {
			deepEqual(item, {});

			done();
		}, 15);
	});

});

describe('OLSKCacheURLBasename', function test_OLSKCacheURLBasename() {

	it('throws if not string', function () {
		throws(function () {
			mod.OLSKCacheURLBasename(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string', function () {
		const host = uRandomElement('www.example.com', 'www.alfa.bravo');
		const filename = Date.now().toString();
		const item = 'https://' + host + '/' + filename;

		deepEqual(mod.OLSKCacheURLBasename(item), host.replace('www.', '') + '.' + mod._OLSKCacheStringHash(item));
	});

});

describe('OLSKCacheURLFilename', function test_OLSKCacheURLFilename() {

	it('throws if not string', function () {
		throws(function () {
			mod.OLSKCacheURLFilename(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string', function () {
		const extension = '.' + uRandomElement('png', 'jpg', 'gif');
		const filename = Date.now().toString();
		const item = uLink(filename + extension);

		deepEqual(mod.OLSKCacheURLFilename(item), mod.OLSKCacheURLBasename(item).replace('.html', '') + extension);
	});

	it('strips query', function () {
		const extension = '.' + uRandomElement('png', 'jpg', 'gif');
		const filename = Date.now().toString();
		const item = uLink(filename + extension);
		const query = '?' + Date.now().toString();

		deepEqual(mod.OLSKCacheURLFilename(item + query), mod.OLSKCacheURLBasename(item + query).replace('.html', '') + extension);
	});

});

describe('OLSKCachePath', function test_OLSKCachePath() {

	it('throws if param1 not string', function () {
		throws(function () {
			mod.OLSKCachePath(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string', function () {
		const item = Math.random().toString();
		deepEqual(mod.OLSKCachePath(item), require('path').join(item, '__cached'));
	});

	it('concatenates other arguments', function () {
		const root = Math.random().toString();
		const items = Array.from(Array(uRandomInt(5))).map(function () {
			return Math.random().toString();
		});
		deepEqual(mod.OLSKCachePath(...[root].concat(items)), require('path').join(...[root, '__cached'].concat(items)));
	});

});
