"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _expressValidator = require("express-validator");

var _authenticate = _interopRequireWildcard(require("../lib/helpers/authenticate"));

var _user = require("../controller/user.controller");

var _userCreateNew = _interopRequireDefault(require("../lib/requestSchemas/user.createNew.json"));

var _userLogin = _interopRequireDefault(require("../lib/requestSchemas/user.login.json"));

var _userUsername = _interopRequireDefault(require("../lib/requestSchemas/user.username.json"));

var _validator = require("../lib/helpers/validator");

var express = require('express');

var multer = require('multer');

var router = express.Router();
var uploadFileHandler = multer({
  storage: multer.memoryStorage()
});
router.route('/')
/**
 * @api {get} /user/ Get All Users
 * @apiName UserNameAutoComplete
 * @apiGroup User
 * @apiDescription Gives back the full user list
 * @apiSuccess {Array} user List of user profiles
 * @apiError (500) {String} InternalError Something went wrong.
 */
.get([_authenticate["default"], _user.getAllUser], function (req, res) {
  res.status(200).json({
    user: res.locals.user
  });
});
router.route('/login')
/**
 * @api {post} /user/login User login
 * @apiName userLogin
 * @apiGroup User
 * @apiDescription Logs user in and returns the user and API token
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiSuccess {Object} user User profile
 * @apiSuccess {String} token API token
 * @apiError (401) {String} LoginFailed
 */
.post([(0, _expressValidator.checkSchema)(_userLogin["default"]), _validator.checkSchemaValidation, _user.authenticateUser], function (req, res) {
  res.status(200).json({
    user: res.locals.user,
    token: res.locals.token
  });
});
router.route('/signup')
/**
 * @api {post} /user/signup User signup
 * @apiName userSignup
 * @apiGroup User
 * @apiDescription Signs user up and logs in automatically
 * @apiParam {String} username Username
 * @apiParam {String} password Password according to policy
 * @apiParam {String} mail Valid email
 * @apiParam {String} displayName Full name
 * @apiSuccess {Object} user User profile
 * @apiSuccess {String} token API token
 * @apiError (500) {String} InternalError Something went wrong during signup. Most likely to be during validation.
 * @apiDeprecated Users should not be allowed to sign up by themselfes but rather be invited to use docSys
 */
.post([(0, _expressValidator.checkSchema)(_userCreateNew["default"]), _validator.checkSchemaValidation, _user.addUser, _user.authenticateUser], function (req, res) {
  res.status(200).json({
    user: res.locals.user,
    token: res.locals.token
  });
});
router.route('/unlock/:username')
/**
     * @api {post} /user/unlock/:username Unlock locked user
     * @apiName userUnlock
     * @apiGroup User
     * @apiDescription Unlocks user and sets login attempts to 0
     * @apiParam {String} username Username
     * @apiSuccess {Object} user User profile
     * @apiError (401) {String} AuthentificationError Not allowed to access ressource
     */
.post([_authenticate["default"], _authenticate.requireAdmin, (0, _expressValidator.checkSchema)(_userUsername["default"]), _validator.checkSchemaValidation, _user.unlockUser], function (req, res) {
  res.status(200).json({
    user: res.locals.user
  });
});
router.route('/:username')
/**
 * @api {get} /user/:username Get single user
 * @apiName userGetSingle
 * @apiGroup User
 * @apiDescription Returns a single user object without password
 * @apiParam {String} username
 * @apiSuccess {Object} user User profile
 * @apiError (401) {String} AuthentificationError Not allowed to access ressource
 */
.get([_authenticate["default"], (0, _expressValidator.checkSchema)(_userUsername["default"]), _validator.checkSchemaValidation, _user.findUser], function (req, res) {
  res.status(200).json({
    user: res.locals.user
  });
})
/**
 * @api {delete} /user/:username Delete user
 * @apiName userDeleteSingle
 * @apiGroup User
 * @apiDescription Deletes a single user
 * @apiParam {String} username
 * @apiSuccess {Object} user Username
 * @apiError (401) {String} AuthentificationError Not allowed to access ressource
 */
["delete"]([_authenticate["default"], _authenticate.requireAdmin, (0, _expressValidator.checkSchema)(_userUsername["default"]), _validator.checkSchemaValidation, _user.deleteUser], function (req, res) {
  res.status(200).json({
    user: res.locals.user
  });
})
/**
 * @api {post} /user/:username Update user
 * @apiName userUpdateSingle
 * @apiGroup User
 * @apiDescription Updates a single user. Changes every property that is set in the request body.
 * @apiParam {String} username
 * @apiSuccess {Object} user Updated user object
 * @apiError (401) {String} AuthentificationError Not allowed to access ressource
 */
.post([_authenticate["default"], uploadFileHandler.single('avatar'), (0, _expressValidator.checkSchema)(_userUsername["default"]), _validator.checkSchemaValidation, _user.updateUser], function (req, res) {
  res.status(200).json({
    user: res.locals.user
  });
});
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvdXNlci5yb3V0ZS50cyJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsIm11bHRlciIsInJvdXRlciIsIlJvdXRlciIsInVwbG9hZEZpbGVIYW5kbGVyIiwic3RvcmFnZSIsIm1lbW9yeVN0b3JhZ2UiLCJyb3V0ZSIsImdldCIsImF1dGhlbnRpY2F0ZSIsImdldEFsbFVzZXIiLCJyZXEiLCJyZXMiLCJzdGF0dXMiLCJqc29uIiwidXNlciIsImxvY2FscyIsInBvc3QiLCJsb2dpbiIsImNoZWNrU2NoZW1hVmFsaWRhdGlvbiIsImF1dGhlbnRpY2F0ZVVzZXIiLCJ0b2tlbiIsInNpZ251cCIsImFkZFVzZXIiLCJyZXF1aXJlQWRtaW4iLCJ1c2VybmFtZSIsInVubG9ja1VzZXIiLCJmaW5kVXNlciIsImRlbGV0ZVVzZXIiLCJzaW5nbGUiLCJ1cGRhdGVVc2VyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBVkEsSUFBSUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFyQjs7QUFFQSxJQUFNQyxNQUFNLEdBQUdELE9BQU8sQ0FBQyxRQUFELENBQXRCOztBQVVBLElBQUlFLE1BQU0sR0FBR0gsT0FBTyxDQUFDSSxNQUFSLEVBQWI7QUFDQSxJQUFJQyxpQkFBaUIsR0FBR0gsTUFBTSxDQUFDO0FBQzNCSSxFQUFBQSxPQUFPLEVBQUVKLE1BQU0sQ0FBQ0ssYUFBUDtBQURrQixDQUFELENBQTlCO0FBSUFKLE1BQU0sQ0FBQ0ssS0FBUCxDQUFhLEdBQWI7QUFDSTs7Ozs7Ozs7QUFESixDQVNLQyxHQVRMLENBU1MsQ0FBQ0Msd0JBQUQsRUFBZUMsZ0JBQWYsQ0FUVCxFQVNxQyxVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUMzQ0EsRUFBQUEsR0FBRyxDQUFDQyxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FB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QUFNQyxHQUFOLEVBQWM7QUFDcklBLEVBQUFBLEdBQUcsQ0FBQ0MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUVDLElBQUFBLElBQUksRUFBRUgsR0FBRyxDQUFDSSxNQUFKLENBQVdEO0FBQW5CLEdBQXJCO0FBQ0gsQ0FwQ0w7QUFzQ0FnQixNQUFNLENBQUNDLE9BQVAsR0FBaUI5QixNQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImxldCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpXHJcbmltcG9ydCB7IGNoZWNrU2NoZW1hIH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InXHJcbmNvbnN0IG11bHRlciA9IHJlcXVpcmUoJ211bHRlcicpXHJcblxyXG5pbXBvcnQgYXV0aGVudGljYXRlLCB7IHJlcXVpcmVBZG1pbiB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL2F1dGhlbnRpY2F0ZSdcclxuaW1wb3J0IHsgYXV0aGVudGljYXRlVXNlciwgYWRkVXNlciwgZmluZFVzZXIsIGdldEFsbFVzZXIsIGRlbGV0ZVVzZXIsIHVubG9ja1VzZXIsIHVwZGF0ZVVzZXIgfSBmcm9tICcuLi9jb250cm9sbGVyL3VzZXIuY29udHJvbGxlcic7XHJcblxyXG5pbXBvcnQgc2lnbnVwIGZyb20gJy4uL2xpYi9yZXF1ZXN0U2NoZW1hcy91c2VyLmNyZWF0ZU5ldy5qc29uJ1xyXG5pbXBvcnQgbG9naW4gZnJvbSAnLi4vbGliL3JlcXVlc3RTY2hlbWFzL3VzZXIubG9naW4uanNvbidcclxuaW1wb3J0IHVzZXJuYW1lIGZyb20gJy4uL2xpYi9yZXF1ZXN0U2NoZW1hcy91c2VyLnVzZXJuYW1lLmpzb24nXHJcbmltcG9ydCB7IGNoZWNrU2NoZW1hVmFsaWRhdGlvbiB9IGZyb20gJy4uL2xpYi9oZWxwZXJzL3ZhbGlkYXRvcic7XHJcblxyXG5sZXQgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKVxyXG5sZXQgdXBsb2FkRmlsZUhhbmRsZXIgPSBtdWx0ZXIoe1xyXG4gICAgc3RvcmFnZTogbXVsdGVyLm1lbW9yeVN0b3JhZ2UoKVxyXG59KVxyXG5cclxucm91dGVyLnJvdXRlKCcvJylcclxuICAgIC8qKlxyXG4gICAgICogQGFwaSB7Z2V0fSAvdXNlci8gR2V0IEFsbCBVc2Vyc1xyXG4gICAgICogQGFwaU5hbWUgVXNlck5hbWVBdXRvQ29tcGxldGVcclxuICAgICAqIEBhcGlHcm91cCBVc2VyXHJcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gR2l2ZXMgYmFjayB0aGUgZnVsbCB1c2VyIGxpc3RcclxuICAgICAqIEBhcGlTdWNjZXNzIHtBcnJheX0gdXNlciBMaXN0IG9mIHVzZXIgcHJvZmlsZXNcclxuICAgICAqIEBhcGlFcnJvciAoNTAwKSB7U3RyaW5nfSBJbnRlcm5hbEVycm9yIFNvbWV0aGluZyB3ZW50IHdyb25nLlxyXG4gICAgICovXHJcbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGdldEFsbFVzZXJdLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHVzZXI6IHJlcy5sb2NhbHMudXNlciB9KVxyXG4gICAgfSlcclxuXHJcbnJvdXRlci5yb3V0ZSgnL2xvZ2luJylcclxuICAgIC8qKlxyXG4gICAgICogQGFwaSB7cG9zdH0gL3VzZXIvbG9naW4gVXNlciBsb2dpblxyXG4gICAgICogQGFwaU5hbWUgdXNlckxvZ2luXHJcbiAgICAgKiBAYXBpR3JvdXAgVXNlclxyXG4gICAgICogQGFwaURlc2NyaXB0aW9uIExvZ3MgdXNlciBpbiBhbmQgcmV0dXJucyB0aGUgdXNlciBhbmQgQVBJIHRva2VuXHJcbiAgICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gdXNlcm5hbWVcclxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBwYXNzd29yZFxyXG4gICAgICogQGFwaVN1Y2Nlc3Mge09iamVjdH0gdXNlciBVc2VyIHByb2ZpbGVcclxuICAgICAqIEBhcGlTdWNjZXNzIHtTdHJpbmd9IHRva2VuIEFQSSB0b2tlblxyXG4gICAgICogQGFwaUVycm9yICg0MDEpIHtTdHJpbmd9IExvZ2luRmFpbGVkXHJcbiAgICAgKi9cclxuICAgIC5wb3N0KFtjaGVja1NjaGVtYShsb2dpbiBhcyBhbnkpLCBjaGVja1NjaGVtYVZhbGlkYXRpb24sIGF1dGhlbnRpY2F0ZVVzZXJdLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHVzZXI6IHJlcy5sb2NhbHMudXNlciwgdG9rZW46IHJlcy5sb2NhbHMudG9rZW4gfSlcclxuICAgIH0pXHJcblxyXG5yb3V0ZXIucm91dGUoJy9zaWdudXAnKVxyXG4gICAgLyoqXHJcbiAgICAgKiBAYXBpIHtwb3N0fSAvdXNlci9zaWdudXAgVXNlciBzaWdudXBcclxuICAgICAqIEBhcGlOYW1lIHVzZXJTaWdudXBcclxuICAgICAqIEBhcGlHcm91cCBVc2VyXHJcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gU2lnbnMgdXNlciB1cCBhbmQgbG9ncyBpbiBhdXRvbWF0aWNhbGx5XHJcbiAgICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgVXNlcm5hbWVcclxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSBwYXNzd29yZCBQYXNzd29yZCBhY2NvcmRpbmcgdG8gcG9saWN5XHJcbiAgICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gbWFpbCBWYWxpZCBlbWFpbFxyXG4gICAgICogQGFwaVBhcmFtIHtTdHJpbmd9IGRpc3BsYXlOYW1lIEZ1bGwgbmFtZVxyXG4gICAgICogQGFwaVN1Y2Nlc3Mge09iamVjdH0gdXNlciBVc2VyIHByb2ZpbGVcclxuICAgICAqIEBhcGlTdWNjZXNzIHtTdHJpbmd9IHRva2VuIEFQSSB0b2tlblxyXG4gICAgICogQGFwaUVycm9yICg1MDApIHtTdHJpbmd9IEludGVybmFsRXJyb3IgU29tZXRoaW5nIHdlbnQgd3JvbmcgZHVyaW5nIHNpZ251cC4gTW9zdCBsaWtlbHkgdG8gYmUgZHVyaW5nIHZhbGlkYXRpb24uXHJcbiAgICAgKiBAYXBpRGVwcmVjYXRlZCBVc2VycyBzaG91bGQgbm90IGJlIGFsbG93ZWQgdG8gc2lnbiB1cCBieSB0aGVtc2VsZmVzIGJ1dCByYXRoZXIgYmUgaW52aXRlZCB0byB1c2UgZG9jU3lzXHJcbiAgICAgKi9cclxuICAgIC5wb3N0KFtjaGVja1NjaGVtYShzaWdudXAgYXMgYW55KSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBhZGRVc2VyLCBhdXRoZW50aWNhdGVVc2VyXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyB1c2VyOiByZXMubG9jYWxzLnVzZXIsIHRva2VuOiByZXMubG9jYWxzLnRva2VuIH0pXHJcbiAgICB9KVxyXG5cclxucm91dGVyLnJvdXRlKCcvdW5sb2NrLzp1c2VybmFtZScpXHJcbiAgICAvKipcclxuICAgICAgICAgKiBAYXBpIHtwb3N0fSAvdXNlci91bmxvY2svOnVzZXJuYW1lIFVubG9jayBsb2NrZWQgdXNlclxyXG4gICAgICAgICAqIEBhcGlOYW1lIHVzZXJVbmxvY2tcclxuICAgICAgICAgKiBAYXBpR3JvdXAgVXNlclxyXG4gICAgICAgICAqIEBhcGlEZXNjcmlwdGlvbiBVbmxvY2tzIHVzZXIgYW5kIHNldHMgbG9naW4gYXR0ZW1wdHMgdG8gMFxyXG4gICAgICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSB1c2VybmFtZSBVc2VybmFtZVxyXG4gICAgICAgICAqIEBhcGlTdWNjZXNzIHtPYmplY3R9IHVzZXIgVXNlciBwcm9maWxlXHJcbiAgICAgICAgICogQGFwaUVycm9yICg0MDEpIHtTdHJpbmd9IEF1dGhlbnRpZmljYXRpb25FcnJvciBOb3QgYWxsb3dlZCB0byBhY2Nlc3MgcmVzc291cmNlXHJcbiAgICAgICAgICovXHJcbiAgICAucG9zdChbYXV0aGVudGljYXRlLCByZXF1aXJlQWRtaW4sIGNoZWNrU2NoZW1hKHVzZXJuYW1lIGFzIGFueSksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgdW5sb2NrVXNlcl0sIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgdXNlcjogcmVzLmxvY2Fscy51c2VyIH0pXHJcbiAgICB9KVxyXG5cclxuXHJcbnJvdXRlci5yb3V0ZSgnLzp1c2VybmFtZScpXHJcbiAgICAvKipcclxuICAgICAqIEBhcGkge2dldH0gL3VzZXIvOnVzZXJuYW1lIEdldCBzaW5nbGUgdXNlclxyXG4gICAgICogQGFwaU5hbWUgdXNlckdldFNpbmdsZVxyXG4gICAgICogQGFwaUdyb3VwIFVzZXJcclxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBSZXR1cm5zIGEgc2luZ2xlIHVzZXIgb2JqZWN0IHdpdGhvdXQgcGFzc3dvcmRcclxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSB1c2VybmFtZVxyXG4gICAgICogQGFwaVN1Y2Nlc3Mge09iamVjdH0gdXNlciBVc2VyIHByb2ZpbGVcclxuICAgICAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBBdXRoZW50aWZpY2F0aW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gYWNjZXNzIHJlc3NvdXJjZVxyXG4gICAgICovXHJcbiAgICAuZ2V0KFthdXRoZW50aWNhdGUsIGNoZWNrU2NoZW1hKHVzZXJuYW1lIGFzIGFueSksIGNoZWNrU2NoZW1hVmFsaWRhdGlvbiwgZmluZFVzZXJdLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHVzZXI6IHJlcy5sb2NhbHMudXNlciB9KVxyXG4gICAgfSlcclxuICAgIC8qKlxyXG4gICAgICogQGFwaSB7ZGVsZXRlfSAvdXNlci86dXNlcm5hbWUgRGVsZXRlIHVzZXJcclxuICAgICAqIEBhcGlOYW1lIHVzZXJEZWxldGVTaW5nbGVcclxuICAgICAqIEBhcGlHcm91cCBVc2VyXHJcbiAgICAgKiBAYXBpRGVzY3JpcHRpb24gRGVsZXRlcyBhIHNpbmdsZSB1c2VyXHJcbiAgICAgKiBAYXBpUGFyYW0ge1N0cmluZ30gdXNlcm5hbWVcclxuICAgICAqIEBhcGlTdWNjZXNzIHtPYmplY3R9IHVzZXIgVXNlcm5hbWVcclxuICAgICAqIEBhcGlFcnJvciAoNDAxKSB7U3RyaW5nfSBBdXRoZW50aWZpY2F0aW9uRXJyb3IgTm90IGFsbG93ZWQgdG8gYWNjZXNzIHJlc3NvdXJjZVxyXG4gICAgICovXHJcbiAgICAuZGVsZXRlKFthdXRoZW50aWNhdGUsIHJlcXVpcmVBZG1pbiwgY2hlY2tTY2hlbWEodXNlcm5hbWUgYXMgYW55KSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCBkZWxldGVVc2VyXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyB1c2VyOiByZXMubG9jYWxzLnVzZXIgfSlcclxuICAgIH0pXHJcbiAgICAvKipcclxuICAgICAqIEBhcGkge3Bvc3R9IC91c2VyLzp1c2VybmFtZSBVcGRhdGUgdXNlclxyXG4gICAgICogQGFwaU5hbWUgdXNlclVwZGF0ZVNpbmdsZVxyXG4gICAgICogQGFwaUdyb3VwIFVzZXJcclxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBVcGRhdGVzIGEgc2luZ2xlIHVzZXIuIENoYW5nZXMgZXZlcnkgcHJvcGVydHkgdGhhdCBpcyBzZXQgaW4gdGhlIHJlcXVlc3QgYm9keS5cclxuICAgICAqIEBhcGlQYXJhbSB7U3RyaW5nfSB1c2VybmFtZVxyXG4gICAgICogQGFwaVN1Y2Nlc3Mge09iamVjdH0gdXNlciBVcGRhdGVkIHVzZXIgb2JqZWN0XHJcbiAgICAgKiBAYXBpRXJyb3IgKDQwMSkge1N0cmluZ30gQXV0aGVudGlmaWNhdGlvbkVycm9yIE5vdCBhbGxvd2VkIHRvIGFjY2VzcyByZXNzb3VyY2VcclxuICAgICAqL1xyXG4gICAgLnBvc3QoW2F1dGhlbnRpY2F0ZSwgdXBsb2FkRmlsZUhhbmRsZXIuc2luZ2xlKCdhdmF0YXInKSwgY2hlY2tTY2hlbWEodXNlcm5hbWUgYXMgYW55KSwgY2hlY2tTY2hlbWFWYWxpZGF0aW9uLCB1cGRhdGVVc2VyXSwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyB1c2VyOiByZXMubG9jYWxzLnVzZXIgfSlcclxuICAgIH0pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlciJdfQ==