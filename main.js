/*!
 * OLSKCache
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const OLSKDisk = require('OLSKDisk');

const pathPackage = require('path');

//_ OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject

exports.OLSKCacheValueWithCallbackFunctionCacheKeyAndCacheObject = function(callback, key, cacheObject) {
	if (typeof callback !== 'function') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof key !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof cacheObject !== 'object' || cacheObject === null) {
		return callback();
	}

	if (cacheObject[key] === undefined) {
		cacheObject[key] = callback();
	}

	return cacheObject[key];
};

//_ OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory

exports.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory = function(param1, param2, param3) {
	if (typeof param1 !== 'object' || param1 === null) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!OLSKDisk.OLSKDiskIsRealFolderPath(param3)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	return OLSKDisk.OLSKDiskWriteFile(pathPackage.join(OLSKDisk.OLSKDiskCreateFolder(pathPackage.join(param3, OLSKDisk.OLSKDiskCacheFolderName())), [param2, '.', exports.OLSKCacheFileExtensionJSON()].join('')), JSON.stringify(param1, null, '\t'));
};

//_ OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory

exports.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory = function(param1, param2) {
	if (typeof param1 !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!OLSKDisk.OLSKDiskIsRealFolderPath(param2)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	try {
		return JSON.parse(OLSKDisk.OLSKDiskReadFile(pathPackage.join(param2, OLSKDisk.OLSKDiskCacheFolderName(), [param1, '.', exports.OLSKCacheFileExtensionJSON()].join(''))));
	} catch(e) {
		return null;
	}
};

//_ OLSKCacheFileExtensionJSON

exports.OLSKCacheFileExtensionJSON = function() {
	return 'json';
};
