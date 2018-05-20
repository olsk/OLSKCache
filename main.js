/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('OLSKFilesystem');

var fsPackage = require('fs');
var pathPackage = require('path');
var mkdirpPackage = require('mkdirp');

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

exports.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory = function(inputData, cacheKey, rootDirectory) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof cacheKey !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!filesystemLibrary.OLSKFilesystemInputDataIsRealDirectoryPath(rootDirectory)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	var cacheDirectory = pathPackage.join(rootDirectory, filesystemLibrary.OLSKFilesystemCacheDirectoryName());

	if (!fsPackage.existsSync(cacheDirectory)) {
		mkdirpPackage.sync(cacheDirectory);
	}

	fsPackage.writeFileSync(pathPackage.join(cacheDirectory, [cacheKey, '.', exports.OLSKCacheFileExtensionJSON()].join('')), JSON.stringify(inputData, null, '\t'));

	return null;
};

//_ OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory

exports.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory = function(inputData, rootDirectory) {
	if (typeof inputData !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!filesystemLibrary.OLSKFilesystemInputDataIsRealDirectoryPath(rootDirectory)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	var cacheDirectory = pathPackage.join(rootDirectory, filesystemLibrary.OLSKFilesystemCacheDirectoryName());

	if (!fsPackage.existsSync(cacheDirectory)) {
		return null;
	}

	var cacheObjectFileFullPath = pathPackage.join(cacheDirectory, [inputData, '.', exports.OLSKCacheFileExtensionJSON()].join(''));

	if (!fsPackage.existsSync(cacheObjectFileFullPath)) {
		return null;
	}

	return JSON.parse(fsPackage.readFileSync(cacheObjectFileFullPath, filesystemLibrary.OLSKFilesystemDefaultTextEncoding()));
};

//_ OLSKCacheFileExtensionJSON

exports.OLSKCacheFileExtensionJSON = function() {
	return 'json';
};
