const mod = {

	OLSKCacheWriteFile (param1, param2, param3) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		const _require = require;

		_require('OLSKDisk').OLSKDiskWriteFile(_require('path').join(_require('OLSKDisk').OLSKDiskCreateFolder(param3), [param2, '.json'].join('')), JSON.stringify(param1, null, '\t'));

		return param1;
	},

	OLSKCacheReadFile (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		const _require = require;

		try {
			return JSON.parse(_require('OLSKDisk').OLSKDiskReadFile(_require('path').join(param2, [param1, '.json'].join(''))));
		} catch(e) {
			return null;
		}
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

		return param1[param2];
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

		return param1[param2];
	},

	async OLSKCacheResultFetchRenew (params) {
		if (typeof params !== 'object' || params === null) {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof params.ParamMap !== 'object' || params.ParamMap === null) {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof params.ParamKey !== 'string') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof params.ParamCallback !== 'function') {
			return Promise.reject('OLSKErrorInputNotValid');
		}

		if (typeof params.ParamInterval !== 'number') {
			throw new Error('RCSErrorInputNotValid');
		}

		let timerID;
		
		const callback = async function () {
			params.ParamMap[params.ParamKey] = await params.ParamCallback();

			return params._ParamCallbackDidFinish(timerID);
		};

		if (!params.ParamMap[params.ParamKey]) {
			await callback();
		}

		timerID = setInterval(function () {
			return callback();
		}, params.ParamInterval);

		return params.ParamMap[params.ParamKey];
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

	_OLSKCacheStringHash (inputData) {
		return require('crypto').createHash('md5').update(inputData).digest('hex');
	},

	OLSKCacheURLBasename (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		const host = (new URL('', inputData)).host.replace('www.', '');

		return host + '.' + mod._OLSKCacheStringHash(inputData);
	},

	OLSKCacheURLFilename (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		const extension = require('path').extname(inputData).split('?').shift();

		return mod.OLSKCacheURLBasename(inputData) + extension;
	},

};

Object.assign(exports, mod);
