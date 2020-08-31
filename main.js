const mod = {

	OLSKCacheWriteFile (param1, param2, param3, OLSKDisk, pathPackage) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!OLSKDisk.OLSKDiskIsRealFolderPath(param3)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return OLSKDisk.OLSKDiskWriteFile(pathPackage.join(OLSKDisk.OLSKDiskCreateFolder(pathPackage.join(param3, OLSKDisk.OLSKDiskCacheFolderName())), [param2, '.', exports.OLSKCacheFileExtensionJSON()].join('')), JSON.stringify(param1, null, '\t'));
	},

	OLSKCacheWriteFile2 (param1, param2, param3, OLSKDisk, pathPackage) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!OLSKDisk.OLSKDiskIsRealFolderPath(param3)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		OLSKDisk.OLSKDiskWriteFile(pathPackage.join(OLSKDisk.OLSKDiskCreateFolder(pathPackage.join(param3, OLSKDisk.OLSKDiskCacheFolderName())), [param2, '.', exports.OLSKCacheFileExtensionJSON()].join('')), JSON.stringify(param1, null, '\t'));

		return param1;
	},

	OLSKCacheReadFile (param1, param2, OLSKDisk, pathPackage) {
		if (typeof param1 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!OLSKDisk.OLSKDiskIsRealFolderPath(param2)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		try {
			return JSON.parse(OLSKDisk.OLSKDiskReadFile(pathPackage.join(param2, OLSKDisk.OLSKDiskCacheFolderName(), [param1, '.', exports.OLSKCacheFileExtensionJSON()].join(''))));
		} catch(e) {
			return null;
		}
	},

	OLSKCacheFileExtensionJSON () {
		return 'json';
	},

	async OLSKCacheResultFetchOnce (param1, param2, param3) {
		if (typeof param1 !== 'object' || param1 === null) {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (!param1[param2]) {
			param1[param2] = await param3();
		}

		return Promise.resolve(param1[param2]);
	},

	OLSKCacheResultFetchOnceSync (param1, param2, param3) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!param1[param2]) {
			param1[param2] = param3();
		}

		return param1[param2];
	},

	async OLSKCacheResultFetchExpire (param1, param2, param3, param4) {
		if (typeof param1 !== 'object' || param1 === null) {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param4 !== 'number') {
			throw new Error('RCSErrorInputNotValid');
		}

		if (!param1[param2]) {
			param1[param2] = await param3();

			setTimeout(function () {
				delete param1[param2];
			}, param4);
		}

		return Promise.resolve(param1[param2]);
	},

	async OLSKCacheResultFetchRenew (param1, param2, param3, param4, param5 = function () {}) {
		if (typeof param1 !== 'object' || param1 === null) {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof param4 !== 'number') {
			throw new Error('RCSErrorInputNotValid');
		}

		if (!param1[param2]) {
			let timerID;
			
			const callback = async function () {
				param1[param2] = await param3();

				return param5(timerID);
			};

			await callback();

			timerID = setInterval(function () {
				return callback();
			}, param4);
		}

		return Promise.resolve(param1[param2]);
	},

	OLSKCacheResultFetchInterval(param1, param2, param3, param4) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param4 !== 'number') {
			throw new Error('OLSKErrorInputNotValid');
		}

		const callback = async function () {
			return param1[param2] = await param3();
		};

		callback();

		return setInterval(callback, param4);
	},

	OLSKCacheExpiringMapEntry(param1, param2, param3, param4) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('RCSErrorInputNotValid');
		}

		if (typeof param4 !== 'number') {
			throw new Error('RCSErrorInputNotValid');
		}

		param1[param2] = param3;

		setTimeout(function () {
			delete param1[param2];
		}, param4);

		return param2;
	},

};

Object.assign(exports, mod);
