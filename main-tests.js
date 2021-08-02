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

describe('OLSKCacheQueuedFetch', function test_OLSKCacheQueuedFetch() {

	const _OLSKCacheQueuedFetch = function (inputData) {
		return mod.OLSKCacheQueuedFetch(Object.assign({
			ParamMod: {},
			ParamKey: Math.random().toString(),
			ParamCallback: (function () {}),
			ParamInterval: 1,

			_ParamCallbackDidFinish: (function () {
				clearInterval(this.ParamMod._OLSKCacheTimerMap[this.ParamKey]);
			}),

			OLSKQueue: Object.assign({
				OLSKQueueAPI: (function () {}),
			}, inputData),

			OLSKDisk: Object.assign({
				OLSKDiskWrite: (function () {}),
			}, inputData),
			ParamFileDirectory: Math.random().toString(),
		}, inputData));
	};

	it('rejects if not object', function() {
		return rejects(mod.OLSKCacheQueuedFetch(null), /OLSKErrorInputNotValid/);
	});

	it('rejects if ParamMod not object', function() {
		return rejects(_OLSKCacheQueuedFetch({
			ParamMod: null,
		}), /OLSKErrorInputNotValid/);
	});
	
	it('rejects if ParamKey not string', function() {
		return rejects(_OLSKCacheQueuedFetch({
			ParamKey: null,
		}), /OLSKErrorInputNotValid/);
	});
	
	it('rejects if ParamCallback not function', function() {
		return rejects(_OLSKCacheQueuedFetch({
			ParamCallback: null,
		}), /OLSKErrorInputNotValid/);
	});
	
	it('rejects if ParamInterval not number', function() {
		return rejects(_OLSKCacheQueuedFetch({
			ParamInterval: '1',
		}), /OLSKErrorInputNotValid/);
	});

	it('rejects if OLSKQueue not object', function() {
		return rejects(_OLSKCacheQueuedFetch({
			OLSKQueue: null,
		}), /OLSKErrorInputNotValid/);
	});

	context('ParamFileURLs', function () {
		
		it('rejects if not array', function() {
			return rejects(_OLSKCacheQueuedFetch({
				ParamFileURLs: null,
			}), /OLSKErrorInputNotValid/);
		});

		it('rejects if OLSKDisk not array', function() {
			return rejects(_OLSKCacheQueuedFetch({
				ParamFileURLs: [],
				OLSKDisk: null,
			}), /OLSKErrorInputNotValid/);
		});

		it('rejects if ParamFileDirectory not string', function() {
			return rejects(_OLSKCacheQueuedFetch({
				ParamFileURLs: [],
				ParamFileDirectory: null,
			}), /OLSKErrorInputNotValid/);
		});

		it('rejects if ParamFileJSON not boolean', function() {
			return rejects(_OLSKCacheQueuedFetch({
				ParamFileURLs: [],
				ParamFileJSON: 'true',
			}), /OLSKErrorInputNotValid/);
		});
	
	});

	context('not_filled', function () {

		it('returns ParamCallback result', async function() {
			const item = Math.random().toString();

			deepEqual(await _OLSKCacheQueuedFetch({
				ParamCallback: (function () {
					return item;
				}),
			}), item);
		});

		it('assigns result to _OLSKCacheResultMap[key]', async function () {
			const _OLSKCacheResultMap = {};

			const ParamKey = Math.random().toString();

			await _OLSKCacheQueuedFetch({
				ParamMod: {
					_OLSKCacheResultMap,
				},
				ParamKey,
				ParamCallback: (function () {
					return ParamKey;
				}),
			});

			deepEqual(_OLSKCacheResultMap, {
				[ParamKey]: ParamKey,
			});
		});

	});

	context('filled', function () {
		
		it('returns _OLSKCacheResultMap[key]', async function() {
			const ParamKey = Math.random().toString();

			deepEqual(await _OLSKCacheQueuedFetch({
				ParamMod: {
					_OLSKCacheResultMap: {
						[ParamKey]: ParamKey,
					},
				},
				ParamKey,
			}), ParamKey);
		});

		it('skips ParamCallback', async function() {
			const ParamKey = Math.random().toString();

			deepEqual(await _OLSKCacheQueuedFetch({
				ParamMod: {
					_OLSKCacheResultMap: {
						[ParamKey]: ParamKey,
					},
				},
				ParamKey,
				ParamCallback: (function () {
					return Math.random().toString();
				}),
			}), ParamKey);
		});
	
	});

	context('ParamCallback', function () {
		
		it('repeats at ParamInterval', async function() {
			const ParamKey = Math.random().toString();
			const _OLSKCacheResultMap = {
				[ParamKey]: 1,
			};
			const item = Math.max(3, uRandomInt(4));

			await _OLSKCacheQueuedFetch({
				ParamMod: {
					_OLSKCacheResultMap,
				},
				ParamKey,
				ParamCallback: (function () {
					return _OLSKCacheResultMap[ParamKey] + 1;
				}),
				_ParamCallbackDidFinish: (function () {
					if (_OLSKCacheResultMap[ParamKey] >= item) {
						clearInterval(this.ParamMod._OLSKCacheTimerMap[this.ParamKey]);
					}
				}),
			});

			await (new Promise(function (res, rej) {
				return setTimeout(res, 5 * item);
			}));
			
			deepEqual(_OLSKCacheResultMap, {
				[ParamKey]: item,
			});
		});

		context('ParamFileURLs', function () {
			
			it('calls OLSKDiskWrite', async function () {
				const ParamFileDirectory = Math.random().toString();
				const ParamKey = uLink();
				const item = Math.random().toString();
				
				deepEqual(await uCapture(async function (OLSKDiskWrite) {
					await _OLSKCacheQueuedFetch({
						ParamKey,
						ParamCallback: (function () {
							return item;
						}),
						ParamFileURLs: [],
						OLSKDiskWrite,
						ParamFileDirectory,
					});
				}), [mod.OLSKCachePath(ParamFileDirectory, mod.OLSKCacheURLBasename(ParamKey)), item]);
			});

			context('ParamFileJSON', function () {

				it('calls JSON.stringify before write', async function () {
					const ParamFileDirectory = Math.random().toString();
					const ParamKey = uLink();
					const item = {
						[Math.random().toString()]: Math.random().toString(),
					};
					
					deepEqual(await uCapture(async function (OLSKDiskWrite) {
						await _OLSKCacheQueuedFetch({
							ParamKey,
							ParamCallback: (function () {
								return item;
							}),
							ParamFileURLs: [],
							ParamFileJSON: true,
							OLSKDiskWrite,
							ParamFileDirectory,
						});
					}), [mod.OLSKCachePath(ParamFileDirectory, mod.OLSKCacheURLBasename(ParamKey)), JSON.stringify(item)]);
				});
			
			});
		
		});
	
	});

	context('SetupQueue', function test_SetupQueue() {

		it('calls OLSKQueueAPI', function () {
			const item = Math.random().toString();
			deepEqual(uCapture(function (capture) {
				_OLSKCacheQueuedFetch({
					OLSKQueueAPI: (function () {
						capture(item);
					}),
				})
			}), [item]);
		});

		it('sets ParamMod[_OLSKCacheQueue] if not filled', function () {
			const item = Math.random().toString();
			const ParamMod = {};

			_OLSKCacheQueuedFetch({
				ParamMod,
				OLSKQueueAPI: (function () {
					return item;
				}),
			})
			deepEqual(ParamMod._OLSKCacheQueue, item);
		});

		it('skips set ParamMod[_OLSKCacheQueue] if filled', function () {
			const _OLSKCacheQueue = Math.random().toString();
			const ParamMod = {
				_OLSKCacheQueue,
			};

			_OLSKCacheQueuedFetch({
				ParamMod,
				OLSKQueueAPI: (function () {
					return Math.random().toString();
				}),
			})
			deepEqual(ParamMod._OLSKCacheQueue, _OLSKCacheQueue);
		});

	});

	context('SetupResultMap', function test_SetupResultMap() {

		it('sets ParamMod[_OLSKCacheResultMap] if not filled', function () {
			const ParamMod = {};

			_OLSKCacheQueuedFetch({
				ParamMod,
			})
			deepEqual(ParamMod._OLSKCacheResultMap, {});
		});

		it('skips set ParamMod[_OLSKCacheResultMap] if filled', function () {
			const _OLSKCacheResultMap = Math.random().toString();
			const ParamMod = {
				_OLSKCacheResultMap,
			};

			_OLSKCacheQueuedFetch({
				ParamMod,
			})
			deepEqual(ParamMod._OLSKCacheResultMap, _OLSKCacheResultMap);
		});

		context('ParamFileURLs', function () {
			
			it('calls OLSKDiskRead', function () {
				const ParamFileDirectory = Math.random().toString();
				const url = uLink();
				
				deepEqual(uCapture(function (OLSKDiskRead) {
					_OLSKCacheQueuedFetch({
						ParamFileURLs: [url],
						OLSKDiskRead,
						ParamFileDirectory
					});
				}), [mod.OLSKCachePath(ParamFileDirectory, mod.OLSKCacheURLBasename(url))]);
			});

			it('sets ParamMod[_OLSKCacheResultMap] if OLSKDiskRead filled', async function () {
				const ParamMod = {};
				const ParamKey = uLink();
				const OLSKDiskRead = uRandomElement(Math.random().toString(), null);

				await _OLSKCacheQueuedFetch({
					ParamMod,
					ParamKey,
					ParamFileURLs: [ParamKey],
					OLSKDiskRead: (function () {
						return OLSKDiskRead;
					}),
				});

				deepEqual(ParamMod._OLSKCacheResultMap, {
					[ParamKey]: OLSKDiskRead,
				});
			});

			context('ParamFileJSON', function () {

				it('calls JSON.parse after read', async function () {
					const ParamMod = {};
					const ParamKey = uLink();
					const OLSKDiskRead = {
						[Math.random().toString()]: Math.random().toString(),
					};

					await _OLSKCacheQueuedFetch({
						ParamMod,
						ParamKey,
						ParamFileURLs: [ParamKey],
						ParamFileJSON: true,
						OLSKDiskRead: (function () {
							return JSON.stringify(OLSKDiskRead);
						}),
					});

					deepEqual(ParamMod._OLSKCacheResultMap[ParamKey], OLSKDiskRead);
				});
			
			});
		
		});

	});

	context('SetupTimerMap', function test_SetupTimerMap() {

		it('sets ParamMod[_OLSKCacheTimerMap] if not filled', function () {
			const ParamMod = {};

			_OLSKCacheQueuedFetch({
				ParamMod,
			})
			deepEqual(ParamMod._OLSKCacheTimerMap, {});
		});

		it('skips set ParamMod[_OLSKCacheTimerMap] if filled', function () {
			const _OLSKCacheTimerMap = {
				[Math.random().toString()]: Math.random().toString(),
			};
			const ParamMod = {
				_OLSKCacheTimerMap: Object.assign({}, _OLSKCacheTimerMap),
			};

			_OLSKCacheQueuedFetch({
				ParamMod,
			});

			deepEqual(ParamMod._OLSKCacheTimerMap, _OLSKCacheTimerMap);
		});

	});

});
