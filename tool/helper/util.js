const nodePath = require('path');
const nodeFS = require('fs');

/**
 * Note:
 * - If `parentPath` and `subPath` is the same, return false.
 * - Symlink link are resolved, otherwise may cause risk, e.g.,
 *   when checking if `/foo/bar/file.txt` inside `/foo`,
 *   consider if `/foo/bar` is a symlink pointing outside `/foo` (e.g., `/mnt/data/bar`).
 * - If `parentPath` or `subPath` do not exist, will throw error.
 * - If `parentPath` or `subPath` are not absolute paths, will throw error.
 */
exports.isSubPathSafe = function (parentPathAbs, subPathAbs) {
    if (!nodePath.isAbsolute(parentPathAbs)) {
        throw new Error('parentPath must be an absolute path');
    }
    if (!nodePath.isAbsolute(subPathAbs)) {
        throw new Error('subPath must be an absolute path');
    }
    const parentPathReal = nodeFS.realpathSync(parentPathAbs);
    const subPathReal = nodeFS.realpathSync(subPathAbs);
    const relativePath = nodePath.relative(parentPathReal, subPathReal);
    // If the paths are the same, nodePath.relative returns ''.
    return relativePath && !relativePath.startsWith('..') && !nodePath.isAbsolute(relativePath);
};
