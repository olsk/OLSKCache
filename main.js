/*!
 * OLSKCache
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const OLSKDisk = require('OLSKDisk');

const fsPackage = require('fs');
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

	fsPackage.writeFileSync(pathPackage.join(OLSKDisk.OLSKDiskCreateFolder(pathPackage.join(param3, OLSKDisk.OLSKDiskCacheDirectoryName())), [param2, '.', exports.OLSKCacheFileExtensionJSON()].join('')), JSON.stringify(param1, null, '\t'));

	return null;
};

//_ OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory

exports.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory = function(param1, rootDirectory) {
	if (typeof param1 !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!OLSKDisk.OLSKDiskIsRealFolderPath(rootDirectory)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	var cacheDirectory = pathPackage.join(rootDirectory, OLSKDisk.OLSKDiskCacheDirectoryName());

	if (!fsPackage.existsSync(cacheDirectory)) {
		return null;
	}

	var cacheObjectFileFullPath = pathPackage.join(cacheDirectory, [param1, '.', exports.OLSKCacheFileExtensionJSON()].join(''));

	if (!fsPackage.existsSync(cacheObjectFileFullPath)) {
		return null;
	}

	return JSON.parse(fsPackage.readFileSync(cacheObjectFileFullPath, OLSKDisk.OLSKDiskDefaultTextEncoding()));
};

//_ OLSKCacheFileExtensionJSON

exports.OLSKCacheFileExtensionJSON = function() {
	return 'json';
};
