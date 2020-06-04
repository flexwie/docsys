"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _authenticate = _interopRequireWildcard(require("../lib/helpers/authenticate"));

var _document = require("../controller/document.controller");

var _documentCreateNew = _interopRequireDefault(require("../lib/requestSchemas/document.createNew.json"));

var _documentCheckout = _interopRequireDefault(require("../lib/requestSchemas/document.checkout.json"));

var _documentShare = _interopRequireDefault(require("../lib/requestSchemas/document.share.json"));

var _documentFileid = _interopRequireDefault(require("../lib/requestSchemas/document.fileid.json"));

var _validator = require("../lib/helpers/validator");

var multer = require('multer');

var router = _express["default"].Router();

var uploadFileHandler = multer({
  storage: multer.memoryStorage()
});
router.route('/')
/**
 * @api {get} /document/ All documents
 * @apiName documentsGetAll
 * @apiGroup Document
 * @apiDescription Gets all documents on the instance. Can only be accessed by an admin.
 * @apiSuccess {Object[]} document All documents
 * @apiError (401) NotAuthorized Only admins are allow to access this ressource
 * @apiError (500) InternalServerError Something went wron processing your request
 */
.get([_authenticate["default"], _authenticate.requireAdmin, _document.getAllFiles], function (req, res) {
  res.status(200).json({
    docs: res.locals.files
  });
})
/**
* @api {post} /document/ New document
* @apiName documentCreate
* @apiGroup Document
* @apiDescription Creates and uploads a new documents with its body.
* @apiParam {Buffer[]} files Page(s) for the document
* @apiParam {String} title Documents subject or title
* @apiParam {Date} dated Date the original document was recieved
* @apiParam {String} comment Comment to append to log
* @apiSuccess {Object} document The created document
* @apiError (415) {String} FileTypeError Filetype is not supported. So far only PDFs and picture types are supported
* @apiError (500) {String} InternalError Something went wrong
*/
.post([_authenticate["default"], uploadFileHandler.single('documents'), (0, _expressValidator.checkSchema)(_documentCreateNew["default"]), _validator.checkSchemaValidation, _document.createNewFile, _document.uploadFiles], function (req, res) {
  res.status(200).json({
    document: res.locals.file
  });
});
router.route('/own')
/**
 * @api {get} /document/own Own documents
 * @apiName documentGetOwn
 * @apiGroup Document
 * @apiDescription Returns the users documents
 * @apiSuccess {Array} docs User documents basic metadata
 * @apiError (401) {String} PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], _document.getOwnFiles], function (req, res) {
  res.status(200).json({
    docs: res.locals.files
  });
});
router.route('/shared')
/**
 * @api {get} /document/shared Shared documents
 * @apiName documentGetShared
 * @apiGroup Document
 * @apiDescription Returns the documents shared with the user
 * @apiSuccess {Array} sharedDocs Shared documents basic metadata
 * @apiError (401) {String} PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], _document.getSharedFiles], function (req, res) {
  res.status(200).json({
    docs: res.locals.files
  });
});
router.route('/recent')
/**
 * @api {get} /document/recent Get recent activity
 * @apiName documentGetRecent
 * @apiGroup Document
 * @apiDescription Gets the recent activity on the users documents. Query 'limit' limits the amount of returned activity.
 * @apiSuccess {Array} recent Recent actvity
 * @apiError (401) {String} PermissionError Not allowed to GET this
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], _document.getRecent], function (req, res) {
  res.status(200).json(res.locals.recent);
});
router.route('/comment/:fileid')
/**
 * @api {post} /document/comment/:fileid Add comment to file log
 * @apiName documentAddComment
 * @apiGroup Document
 * @apiDescription Returns the file log
 * @apiSuccess {Array} logs Log of the file
 * @apiError (401) {String} PermissionError Not allowed to POST a comment
 * @apiError (500) {String} InternalError Something went wrong
 */
.post([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile, _document.appendComment], function (req, res) {
  res.status(200).json(res.locals.file.log);
});
router.route('/checkout/:fileid')
/**
 * @api {get} /document/checkout/:fileid Document checkout
 * @apiName documentCheckout
 * @apiGroup Document
 * @apiDescription Checks out document and sends files as ZIP archive
 * @apiParam {String} fileid The fileid as part of the GET URL
 * @apiSuccess (200) {Stream} ZIP file stream
 * @apiError (401) PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentCheckout["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile,
/* lockFile ,*/
_document.downloadFile], function (req, res) {
  res.writeHead(200, {
    'Content-Type': res.locals.file.mime,
    'Content-disposition': "attachment; filename=".concat(res.locals.file.title),
    //.${res.locals.file.extension}
    'Content-Length': res.locals.fileBuffer.length
  });
  res.end(res.locals.fileBuffer); // const stream = new Readable()
  // stream._read = () => { }
  // stream.push(res.locals.fileBuffer)
  // stream.push(null)
  // stream.pipe(res)
})
/**
* @api {unlock} /document/checkout/:fileid
* @apiName documentAdminUnlock
* @apiGroup Document
* @apiDescription Unlocks a locked document without actually submitting a new document file. Requires user to be an admin
* @apiParam {String} fileid The fileid as part of the POST URL
* @apiSuccess (200) {Object} The unlocked document
* @apiError (401) PermissionError Not allowed to UNLOCK this file
* @apiError (500) {String} InternalError Something went wrong
*/
.unlock([_authenticate["default"], _authenticate.requireAdmin, (0, _expressValidator.checkSchema)(_documentCheckout["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.unlockFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
});
router.route('/share/:fileid')
/**
 * @api {post} /document/share/:fileid
 * @apiName documentShareFile
 * @apiGroup Document
 * @apiDescription Shares file with a new user
 * @apiParam {String} fileid The fileid as part of the POST URL
 * @apiParam {String} whoToShare Username to share the file with. Provided in body or query.
 * @apiSuccess (200) {Object} The updated document
 * @apiError (401) PermissionError Not allowed to edit this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.post([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentShare["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile, _document.shareFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
});
router.route('/archive/:fileid')
/**
 * @api {post} /document/archive/:fileid
 * @apiName documentArchiveFile
 * @apiGroup Document
 * @apiDescription Moves the file to the archive
 * @apiParam {String} fileid The fileid as part of the POST URL
 * @apiSuccess (200) {Object} The archived document
 * @apiError (401) PermissionError Not allowed to archive this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.post([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile, _document.archiveFile], function (req, res) {
  res.status(200).json({
    file: res.locals.file
  });
}); // router.route('/queue/:queue/:fileid')
//     .post([authenticate, checkSchema(fileid), checkSchemaValidation, getSingleFile, checkPermissionToFile, downloadFile, handleQueue])

router.route('/:fileid')
/**
 * @api {get} /document/:fileid Get single document
 * @apiName documentGetSingle
 * @apiGroup Document
 * @apiDescription Returns the single requested document
 * @apiParam {String} fileid The fileid as part of the GET URL
 * @apiSuccess {Object} document The requested object
 * @apiError (401) {String} PermissionError Not allowed to GET this file
 * @apiError (500) {String} InternalError Something went wrong
 */
.get([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.getSingleFile, _document.checkPermissionToFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
})
/**
* @api {delete} /document/:fileid Deletes document
* @apiName documentDeleteSingle
* @apiGroup Document
* @apiDescription Deletes the requested document
* @apiParam {String} fileid The fileid as part of the GET URL
* @apiSuccess {Object} document The deleted object
* @apiError (401) {String} PermissionError Not allowed to DELETE this file
* @apiError (500) {String} InternalError Something went wrong
*/
["delete"]([_authenticate["default"], (0, _expressValidator.checkSchema)(_documentFileid["default"]), _validator.checkSchemaValidation, _document.deleteSingleFile], function (req, res) {
  res.status(200).json({
    doc: res.locals.file
  });
});
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvZG9jdW1lbnQucm91dGUudHMiXSwibmFtZXMiOlsibXVsdGVyIiwicmVxdWlyZSIsInJvdXRlciIsImV4cHJlc3MiLCJSb3V0ZXIiLCJ1cGxvYWRGaWxlSGFuZGxlciIsInN0b3JhZ2UiLCJtZW1vcnlTdG9yYWdlIiwicm91dGUiLCJnZXQiLCJhdXRoZW50aWNhdGUiLCJyZXF1aXJlQWRtaW4iLCJnZXRBbGxGaWxlcyIsInJlcSIsInJlcyIsInN0YXR1cyIsImpzb24iLCJkb2NzIiwibG9jYWxzIiwiZmlsZXMiLCJwb3N0Iiwic2luZ2xlIiwiY3JlYXRlTmV3IiwiY2hlY2tTY2hlbWFWYWxpZGF0aW9uIiwiY3JlYXRlTmV3RmlsZSIsInVwbG9hZEZpbGVzIiwiZG9jdW1lbnQiLCJmaWxlIiwiZ2V0T3duRmlsZXMiLCJnZXRTaGFyZWRGaWxlcyIsImdldFJlY2VudCIsInJlY2VudCIsImZpbGVpZCIsImdldFNpbmdsZUZpbGUiLCJjaGVja1Blcm1pc3Npb25Ub0ZpbGUiLCJhcHBlbmRDb21tZW50IiwibG9nIiwiY2hlY2tvdXQiLCJkb3dubG9hZEZpbGUiLCJ3cml0ZUhlYWQiLCJtaW1lIiwidGl0bGUiLCJmaWxlQnVmZmVyIiwibGVuZ3RoIiwiZW5kIiwidW5sb2NrIiwidW5sb2NrRmlsZSIsImRvYyIsInNoYXJlIiwic2hhcmVGaWxlIiwiYXJjaGl2ZUZpbGUiLCJkZWxldGVTaW5nbGVGaWxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBSUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBVkEsSUFBTUEsTUFBTSxHQUFHQyxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFZQSxJQUFJQyxNQUFNLEdBQUdDLG9CQUFRQyxNQUFSLEVBQWI7O0FBQ0EsSUFBSUMsaUJBQWlCLEdBQUdMLE1BQU0sQ0FBQztBQUMzQk0sRUFBQUEsT0FBTyxFQUFFTixNQUFNLENB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VUFBQ3RDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ2hHQSxFQUFBQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUFFK0IsSUFBQUEsR0FBRyxFQUFFakMsR0FBRyxDQUFDSSxNQUFKLENBQVdTO0FBQWxCLEdBQXJCO0FBQ0gsQ0ExQkw7QUE0QkF5QixNQUFNLENBQUNDLE9BQVAsR0FBaUJuRCxNQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzLCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tIFwiZXhwcmVzc1wiXHJcbmltcG9ydCB7IGNoZWNrU2NoZW1hIH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InXHJcbmNvbnN0IG11bHRlciA9IHJlcXVpcmUoJ211bHRlcicpXHJcbmltcG9ydCB7IFJlYWRhYmxlIH0gZnJvbSBcInN0cmVhbVwiXHJcblxyXG5pbXBvcnQgYXV0aGVudGljYXRlLCB7IHJlcXVpcmVBZG1pbiB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2F1dGhlbnRpY2F0ZSdcclxuaW1wb3J0IHsgZ2V0QWxsRmlsZXMsIGNyZWF0ZU5ld0ZpbGUsIGdldFJlY2VudCwgdXBsb2FkRmlsZXMsIGdldE93bkZpbGVzLCBnZXRTaGFyZWRGaWxlcywgY2hlY2tQZXJtaXNzaW9uVG9GaWxlLCBsb2NrRmlsZSwgZ2V0U2luZ2xlRmlsZSwgZG93bmxvYWRGaWxlLCB1bmxvY2tGaWxlLCBzaGFyZUZpbGUsIGNoZWNrRmlsZU93bmVyc2hpcCwgZGVsZXRlU2luZ2xlRmlsZSwgYXBwZW5kQ29tbWVudCwgYXJjaGl2ZUZpbGUgfSBmcm9tICcuLi9jb250cm9sbGVyL2RvY3VtZW50LmNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IGNyZWF0ZU5ldyBmcm9tICcuLi9saWIvcmVxdWVzdFNjaGVtYXMvZG9jdW1lbnQuY3JlYXRlTmV3Lmpzb24nXHJcbmltcG9ydCBjaGVja291dCBmcm9tICcuLi9saWIvcmVxdWVzdFNjaGVtYXMvZG9jdW1lbnQuY2hlY2tvdXQuanNvbidcclxuaW1wb3J0IHNoYXJlIGZyb20gJy4uL2xpYi9yZXF1ZXN0U2NoZW1hcy9kb2N1bWVudC5zaGFyZS5qc29uJ1xyXG5pbXBvcnQgZmlsZWlkIGZyb20gJy4uL2xpYi9yZXF1ZXN0U2NoZW1hcy9kb2N1bWVudC5maWxlaWQuanNvbidcclxuaW1wb3J0IHsgY2hlY2tTY2hlbWFWYWxpZGF0aW9uIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvdmFsaWRhdG9yJztcclxuXHJcbmxldCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpXHJcbmxldCB1cGxvYWRGaWxlSGFuZGxlciA9IG11bHRlcih7XHJcbiAgICBzdG9yYWdlOiBtdWx0ZXIubWVtb3J5U3RvcmFnZSgpXHJcbn0pXHJcblxyXG5yb3V0ZXIucm91dGUoJy8nKVxyXG4gICAgLyoqXHJcbiAgICAgKiBAYXBpIHtnZXR9IC9kb2N1bWVudC8gQWxsIGRvY3VtZW50c1xyXG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRzR2V0QWxsXHJcbiAgICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcclxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBHZXRzIGFsbCBkb2N1bWVudHMgb24gdGhlIGluc3RhbmNlLiBDYW4gb25seSBiZSBhY2Nlc3NlZCBieSBhbiBhZG1pbi5cclxuICAgICAqIEBhcGlTdWNjZXNzIHtPYmplY3RbXX0gZG9jdW1lbnQgQWxsIGRvY3VtZW50c1xyXG4gICAgICogQGFwaUVycm9yICg0MDEpIE5vdEF1dGhvcml6ZWQgT25seSBhZG1pbnMgYXJlIGFsbG93IHRvIGFjY2VzcyB0aGlzIHJlc3NvdXJjZVxyXG4gICAgICogQGFwaUVycm9yICg1MDApIEludGVybmFsU2VydmVyRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbiBwcm9jZXNzaW5nIHlvdXIgcmVxdWVzdFxyXG4gICAgICovXHJcbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIHJlcXVpcmVBZG1pbiwgZ2V0QWxsRmlsZXNdLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IGRvY3M6IHJlcy5sb2NhbHMuZmlsZXMgfSlcclxuICAgIH0pXHJcbiAgICAvKipcclxuICAgICogQGFwaSB7cG9zdH0gL2RvY3VtZW50LyBOZXcgZG9jdW1lbnRcclxuICAgICogQGFwaU5hbWUgZG9jdW1lbnRDcmVhdGVcclxuICAgICogQGFwaUdyb3VwIERvY3VtZW50XHJcbiAgICAqIEBhcGlEZXNjcmlwdGlvbiBDcmVhdGVzIGFuZCB1cGxvYWRzIGEgbmV3IGRvY3VtZW50cyB3aXRoIGl0cyBib2R5LlxyXG4gICAgKiBAYXBpUGFyYW0ge0J1ZmZlcltdfSBmaWxlcyBQYWdlKHMpIGZvciB0aGUgZG9jdW1lbnRcclxuICAgICogQGFwaVBhcmFtIHtTdHJpbmd9IHRpdGxlIERvY3VtZW50cyBzdWJqZWN0IG9yIHRpdGxlXHJcbiAgICAqIEBhcGlQYXJhbSB7RGF0ZX0gZGF0ZWQgRGF0ZSB0aGUgb3JpZ2luYWwgZG9jdW1lbnQgd2FzIHJlY2lldmVkXHJcbiAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBjb21tZW50IENvbW1lbnQgdG8gYXBwZW5kIHRvIGxvZ1xyXG4gICAgKiBAYXBpU3VjY2VzcyB7T2JqZWN0fSBkb2N1bWVudCBUaGUgY3JlYXRlZCBkb2N1bWVudFxyXG4gICAgKiBAYXBpRXJyb3IgKDQxNSkge1N0cmluZ30gRmlsZVR5cGVFcnJvciBGaWxldHlwZSBpcyBub3Qgc3VwcG9ydGVkLiBTbyBmYXIgb25seSBQREZzIGFuZCBwaWN0dXJlIHR5cGVzIGFyZSBzdXBwb3J0ZWRcclxuICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcclxuICAgICovXHJcbiAgICAucG9zdChbYXV0aGVudGljYXRlLCB1cGxvYWRGaWxlSGFuZGxlci5zaW5nbGUoJ2RvY3VtZW50cycpLCBjaGVja1NjaGVtYShjcmVhdGVOZXcgYXMgYW55KSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBjcmVhdGVOZXdGaWxlLCB1cGxvYWRGaWxlc10sIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZG9jdW1lbnQ6IHJlcy5sb2NhbHMuZmlsZSB9KVxyXG4gICAgfSlcclxuXHJcbnJvdXRlci5yb3V0ZSgnL293bicpXHJcbiAgICAvKipcclxuICAgICAqIEBhcGkge2dldH0gL2RvY3VtZW50L293biBPd24gZG9jdW1lbnRzXHJcbiAgICAgKiBAYXBpTmFtZSBkb2N1bWVudEdldE93blxyXG4gICAgICogQGFwaUdyb3VwIERvY3VtZW50XHJcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgdXNlcnMgZG9jdW1lbnRzXHJcbiAgICAgKiBAYXBpU3VjY2VzcyB7QXJyYXl9IGRvY3MgVXNlciBkb2N1bWVudHMgYmFzaWMgbWV0YWRhdGFcclxuICAgICAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gR0VUIHRoaXMgZmlsZVxyXG4gICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcclxuICAgICAqL1xyXG4gICAgLmdldChbYXV0aGVudGljYXRlLCBnZXRPd25GaWxlc10sIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZG9jczogcmVzLmxvY2Fscy5maWxlcyB9KVxyXG4gICAgfSlcclxuXHJcbnJvdXRlci5yb3V0ZSgnL3NoYXJlZCcpXHJcbiAgICAvKipcclxuICAgICAqIEBhcGkge2dldH0gL2RvY3VtZW50L3NoYXJlZCBTaGFyZWQgZG9jdW1lbnRzXHJcbiAgICAgKiBAYXBpTmFtZSBkb2N1bWVudEdldFNoYXJlZFxyXG4gICAgICogQGFwaUdyb3VwIERvY3VtZW50XHJcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgZG9jdW1lbnRzIHNoYXJlZCB3aXRoIHRoZSB1c2VyXHJcbiAgICAgKiBAYXBpU3VjY2VzcyB7QXJyYXl9IHNoYXJlZERvY3MgU2hhcmVkIGRvY3VtZW50cyBiYXNpYyBtZXRhZGF0YVxyXG4gICAgICogQGFwaUVycm9yICg0MDEpIHtTdHJpbmd9IFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBHRVQgdGhpcyBmaWxlXHJcbiAgICAgKiBAYXBpRXJyb3IgKDUwMCkge1N0cmluZ30gSW50ZXJuYWxFcnJvciBTb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICovXHJcbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGdldFNoYXJlZEZpbGVzXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBkb2NzOiByZXMubG9jYWxzLmZpbGVzIH0pXHJcbiAgICB9KVxyXG5cclxucm91dGVyLnJvdXRlKCcvcmVjZW50JylcclxuICAgIC8qKlxyXG4gICAgICogQGFwaSB7Z2V0fSAvZG9jdW1lbnQvcmVjZW50IEdldCByZWNlbnQgYWN0aXZpdHlcclxuICAgICAqIEBhcGlOYW1lIGRvY3VtZW50R2V0UmVjZW50XHJcbiAgICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcclxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBHZXRzIHRoZSByZWNlbnQgYWN0aXZpdHkgb24gdGhlIHVzZXJzIGRvY3VtZW50cy4gUXVlcnkgJ2xpbWl0JyBsaW1pdHMgdGhlIGFtb3VudCBvZiByZXR1cm5lZCBhY3Rpdml0eS5cclxuICAgICAqIEBhcGlTdWNjZXNzIHtBcnJheX0gcmVjZW50IFJlY2VudCBhY3R2aXR5XHJcbiAgICAgKiBAYXBpRXJyb3IgKDQwMSkge1N0cmluZ30gUGVybWlzc2lvbkVycm9yIE5vdCBhbGxvd2VkIHRvIEdFVCB0aGlzXHJcbiAgICAgKiBAYXBpRXJyb3IgKDUwMCkge1N0cmluZ30gSW50ZXJuYWxFcnJvciBTb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICovXHJcbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGdldFJlY2VudF0sIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlcy5sb2NhbHMucmVjZW50KVxyXG4gICAgfSlcclxuXHJcbnJvdXRlci5yb3V0ZSgnL2NvbW1lbnQvOmZpbGVpZCcpXHJcbiAgICAvKipcclxuICAgICAqIEBhcGkge3Bvc3R9IC9kb2N1bWVudC9jb21tZW50LzpmaWxlaWQgQWRkIGNvbW1lbnQgdG8gZmlsZSBsb2dcclxuICAgICAqIEBhcGlOYW1lIGRvY3VtZW50QWRkQ29tbWVudFxyXG4gICAgICogQGFwaUdyb3VwIERvY3VtZW50XHJcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gUmV0dXJucyB0aGUgZmlsZSBsb2dcclxuICAgICAqIEBhcGlTdWNjZXNzIHtBcnJheX0gbG9ncyBMb2cgb2YgdGhlIGZpbGVcclxuICAgICAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gUE9TVCBhIGNvbW1lbnRcclxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXHJcbiAgICAgKi9cclxuICAgIC5wb3N0KFthdXRoZW50aWNhdGUsIGNoZWNrU2NoZW1hKGZpbGVpZCksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgZ2V0U2luZ2xlRmlsZSwgY2hlY2tQZXJtaXNzaW9uVG9GaWxlLCBhcHBlbmRDb21tZW50XSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzLmxvY2Fscy5maWxlLmxvZylcclxuICAgIH0pXHJcblxyXG5yb3V0ZXIucm91dGUoJy9jaGVja291dC86ZmlsZWlkJylcclxuICAgIC8qKlxyXG4gICAgICogQGFwaSB7Z2V0fSAvZG9jdW1lbnQvY2hlY2tvdXQvOmZpbGVpZCBEb2N1bWVudCBjaGVja291dFxyXG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRDaGVja291dFxyXG4gICAgICogQGFwaUdyb3VwIERvY3VtZW50XHJcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gQ2hlY2tzIG91dCBkb2N1bWVudCBhbmQgc2VuZHMgZmlsZXMgYXMgWklQIGFyY2hpdmVcclxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBmaWxlaWQgVGhlIGZpbGVpZCBhcyBwYXJ0IG9mIHRoZSBHRVQgVVJMXHJcbiAgICAgKiBAYXBpU3VjY2VzcyAoMjAwKSB7U3RyZWFtfSBaSVAgZmlsZSBzdHJlYW1cclxuICAgICAqIEBhcGlFcnJvciAoNDAxKSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gR0VUIHRoaXMgZmlsZVxyXG4gICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmdcclxuICAgICAqL1xyXG4gICAgLmdldChbYXV0aGVudGljYXRlLCBjaGVja1NjaGVtYShjaGVja291dCksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgZ2V0U2luZ2xlRmlsZSwgY2hlY2tQZXJtaXNzaW9uVG9GaWxlLCAvKiBsb2NrRmlsZSAsKi8gZG93bmxvYWRGaWxlXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6IHJlcy5sb2NhbHMuZmlsZS5taW1lLFxyXG4gICAgICAgICAgICAnQ29udGVudC1kaXNwb3NpdGlvbic6IGBhdHRhY2htZW50OyBmaWxlbmFtZT0ke3Jlcy5sb2NhbHMuZmlsZS50aXRsZX1gLCAvLy4ke3Jlcy5sb2NhbHMuZmlsZS5leHRlbnNpb259XHJcbiAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IHJlcy5sb2NhbHMuZmlsZUJ1ZmZlci5sZW5ndGhcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXMuZW5kKHJlcy5sb2NhbHMuZmlsZUJ1ZmZlcilcclxuXHJcbiAgICAgICAgLy8gY29uc3Qgc3RyZWFtID0gbmV3IFJlYWRhYmxlKClcclxuICAgICAgICAvLyBzdHJlYW0uX3JlYWQgPSAoKSA9PiB7IH1cclxuICAgICAgICAvLyBzdHJlYW0ucHVzaChyZXMubG9jYWxzLmZpbGVCdWZmZXIpXHJcbiAgICAgICAgLy8gc3RyZWFtLnB1c2gobnVsbClcclxuXHJcbiAgICAgICAgLy8gc3RyZWFtLnBpcGUocmVzKVxyXG4gICAgfSlcclxuICAgIC8qKlxyXG4gICAgKiBAYXBpIHt1bmxvY2t9IC9kb2N1bWVudC9jaGVja291dC86ZmlsZWlkXHJcbiAgICAqIEBhcGlOYW1lIGRvY3VtZW50QWRtaW5VbmxvY2tcclxuICAgICogQGFwaUdyb3VwIERvY3VtZW50XHJcbiAgICAqIEBhcGlEZXNjcmlwdGlvbiBVbmxvY2tzIGEgbG9ja2VkIGRvY3VtZW50IHdpdGhvdXQgYWN0dWFsbHkgc3VibWl0dGluZyBhIG5ldyBkb2N1bWVudCBmaWxlLiBSZXF1aXJlcyB1c2VyIHRvIGJlIGFuIGFkbWluXHJcbiAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBmaWxlaWQgVGhlIGZpbGVpZCBhcyBwYXJ0IG9mIHRoZSBQT1NUIFVSTFxyXG4gICAgKiBAYXBpU3VjY2VzcyAoMjAwKSB7T2JqZWN0fSBUaGUgdW5sb2NrZWQgZG9jdW1lbnRcclxuICAgICogQGFwaUVycm9yICg0MDEpIFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBVTkxPQ0sgdGhpcyBmaWxlXHJcbiAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXHJcbiAgICAqL1xyXG4gICAgLnVubG9jayhbYXV0aGVudGljYXRlLCByZXF1aXJlQWRtaW4sIGNoZWNrU2NoZW1hKGNoZWNrb3V0KSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBnZXRTaW5nbGVGaWxlLCB1bmxvY2tGaWxlXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBkb2M6IHJlcy5sb2NhbHMuZmlsZSB9KVxyXG4gICAgfSlcclxuXHJcbnJvdXRlci5yb3V0ZSgnL3NoYXJlLzpmaWxlaWQnKVxyXG4gICAgLyoqXHJcbiAgICAgKiBAYXBpIHtwb3N0fSAvZG9jdW1lbnQvc2hhcmUvOmZpbGVpZFxyXG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRTaGFyZUZpbGVcclxuICAgICAqIEBhcGlHcm91cCBEb2N1bWVudFxyXG4gICAgICogQGFwaURlc2NyaXB0aW9uIFNoYXJlcyBmaWxlIHdpdGggYSBuZXcgdXNlclxyXG4gICAgICogQGFwaVBhcmFtIHtTdHJpbmd9IGZpbGVpZCBUaGUgZmlsZWlkIGFzIHBhcnQgb2YgdGhlIFBPU1QgVVJMXHJcbiAgICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gd2hvVG9TaGFyZSBVc2VybmFtZSB0byBzaGFyZSB0aGUgZmlsZSB3aXRoLiBQcm92aWRlZCBpbiBib2R5IG9yIHF1ZXJ5LlxyXG4gICAgICogQGFwaVN1Y2Nlc3MgKDIwMCkge09iamVjdH0gVGhlIHVwZGF0ZWQgZG9jdW1lbnRcclxuICAgICAqIEBhcGlFcnJvciAoNDAxKSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gZWRpdCB0aGlzIGZpbGVcclxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXHJcbiAgICAgKi9cclxuICAgIC5wb3N0KFthdXRoZW50aWNhdGUsIGNoZWNrU2NoZW1hKHNoYXJlKSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBnZXRTaW5nbGVGaWxlLCBjaGVja1Blcm1pc3Npb25Ub0ZpbGUsIHNoYXJlRmlsZV0sIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZG9jOiByZXMubG9jYWxzLmZpbGUgfSlcclxuICAgIH0pXHJcblxyXG5yb3V0ZXIucm91dGUoJy9hcmNoaXZlLzpmaWxlaWQnKVxyXG4gICAgLyoqXHJcbiAgICAgKiBAYXBpIHtwb3N0fSAvZG9jdW1lbnQvYXJjaGl2ZS86ZmlsZWlkXHJcbiAgICAgKiBAYXBpTmFtZSBkb2N1bWVudEFyY2hpdmVGaWxlXHJcbiAgICAgKiBAYXBpR3JvdXAgRG9jdW1lbnRcclxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBNb3ZlcyB0aGUgZmlsZSB0byB0aGUgYXJjaGl2ZVxyXG4gICAgICogQGFwaVBhcmFtIHtTdHJpbmd9IGZpbGVpZCBUaGUgZmlsZWlkIGFzIHBhcnQgb2YgdGhlIFBPU1QgVVJMXHJcbiAgICAgKiBAYXBpU3VjY2VzcyAoMjAwKSB7T2JqZWN0fSBUaGUgYXJjaGl2ZWQgZG9jdW1lbnRcclxuICAgICAqIEBhcGlFcnJvciAoNDAxKSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gYXJjaGl2ZSB0aGlzIGZpbGVcclxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nXHJcbiAgICAgKi9cclxuICAgIC5wb3N0KFthdXRoZW50aWNhdGUsIGNoZWNrU2NoZW1hKGZpbGVpZCksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgZ2V0U2luZ2xlRmlsZSwgY2hlY2tQZXJtaXNzaW9uVG9GaWxlLCBhcmNoaXZlRmlsZV0sIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZmlsZTogcmVzLmxvY2Fscy5maWxlIH0pXHJcbiAgICB9KVxyXG5cclxuLy8gcm91dGVyLnJvdXRlKCcvcXVldWUvOnF1ZXVlLzpmaWxlaWQnKVxyXG4vLyAgICAgLnBvc3QoW2F1dGhlbnRpY2F0ZSwgY2hlY2tTY2hlbWEoZmlsZWlkKSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBnZXRTaW5nbGVGaWxlLCBjaGVja1Blcm1pc3Npb25Ub0ZpbGUsIGRvd25sb2FkRmlsZSwgaGFuZGxlUXVldWVdKVxyXG5cclxucm91dGVyLnJvdXRlKCcvOmZpbGVpZCcpXHJcbiAgICAvKipcclxuICAgICAqIEBhcGkge2dldH0gL2RvY3VtZW50LzpmaWxlaWQgR2V0IHNpbmdsZSBkb2N1bWVudFxyXG4gICAgICogQGFwaU5hbWUgZG9jdW1lbnRHZXRTaW5nbGVcclxuICAgICAqIEBhcGlHcm91cCBEb2N1bWVudFxyXG4gICAgICogQGFwaURlc2NyaXB0aW9uIFJldHVybnMgdGhlIHNpbmdsZSByZXF1ZXN0ZWQgZG9jdW1lbnRcclxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBmaWxlaWQgVGhlIGZpbGVpZCBhcyBwYXJ0IG9mIHRoZSBHRVQgVVJMXHJcbiAgICAgKiBAYXBpU3VjY2VzcyB7T2JqZWN0fSBkb2N1bWVudCBUaGUgcmVxdWVzdGVkIG9iamVjdFxyXG4gICAgICogQGFwaUVycm9yICg0MDEpIHtTdHJpbmd9IFBlcm1pc3Npb25FcnJvciBOb3QgYWxsb3dlZCB0byBHRVQgdGhpcyBmaWxlXHJcbiAgICAgKiBAYXBpRXJyb3IgKDUwMCkge1N0cmluZ30gSW50ZXJuYWxFcnJvciBTb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICovXHJcbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGNoZWNrU2NoZW1hKGZpbGVpZCksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgZ2V0U2luZ2xlRmlsZSwgY2hlY2tQZXJtaXNzaW9uVG9GaWxlXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBkb2M6IHJlcy5sb2NhbHMuZmlsZSB9KVxyXG4gICAgfSlcclxuICAgIC8qKlxyXG4gICAgKiBAYXBpIHtkZWxldGV9IC9kb2N1bWVudC86ZmlsZWlkIERlbGV0ZXMgZG9jdW1lbnRcclxuICAgICogQGFwaU5hbWUgZG9jdW1lbnREZWxldGVTaW5nbGVcclxuICAgICogQGFwaUdyb3VwIERvY3VtZW50XHJcbiAgICAqIEBhcGlEZXNjcmlwdGlvbiBEZWxldGVzIHRoZSByZXF1ZXN0ZWQgZG9jdW1lbnRcclxuICAgICogQGFwaVBhcmFtIHtTdHJpbmd9IGZpbGVpZCBUaGUgZmlsZWlkIGFzIHBhcnQgb2YgdGhlIEdFVCBVUkxcclxuICAgICogQGFwaVN1Y2Nlc3Mge09iamVjdH0gZG9jdW1lbnQgVGhlIGRlbGV0ZWQgb2JqZWN0XHJcbiAgICAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBQZXJtaXNzaW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gREVMRVRFIHRoaXMgZmlsZVxyXG4gICAgKiBAYXBpRXJyb3IgKDUwMCkge1N0cmluZ30gSW50ZXJuYWxFcnJvciBTb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgKi9cclxuICAgIC5kZWxldGUoW2F1dGhlbnRpY2F0ZSwgY2hlY2tTY2hlbWEoZmlsZWlkKSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBkZWxldGVTaW5nbGVGaWxlXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBkb2M6IHJlcy5sb2NhbHMuZmlsZSB9KVxyXG4gICAgfSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyIl19