var express = require('express')
var jwt = require('jsonwebtoken')
var router = express.Router()

var user = require('../models/user')


router
	.route('/login')
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
	.post(async (req, res) => {
		try {
			let result = await user.getAuthenticated(
				req.body.username,
				req.body.password
			)

			const token = await jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES,
			})

			res.status(200).json({ payload: { user: result, token: token } })
		} catch (error) {
			res.status(401).json({ payload: { message: 'Login failed' } })
		}
	})

router
	.route('/signup')
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
	.post(async (req, res) => {
		try {
			let newUser = new user({
				username: req.body.username,
				password: req.body.password,
				mail: req.body.mail,
				settings: {
					language: 'en',
					displayName: req.body.displayName,
				},
			})

			const token = jwt.sign(newUser.toObject(), process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES,
			})

			await newUser.save()

			res.status(200).json({ payload: { user: newUser, token: token } })
		} catch (error) {
			res.status(500).json({ payload: { message: error.message } })
		}
	})

router
	.route('/signup/:inviteid')
	/**
	 * @api {post} /user/signup/:inviteid
	 * @apiName userInvite
	 * @apiGroup User
	 * @apiDescription New alternative for userSignup. Potential user should recieve a token per mail with that he can join the organistaion.
	 * @apiParam {String} inviteid The invitatation ID as part of the POST URL
	 * @apiSuccess {Object} user User profile
	 * @apiSuccess {String} token API token
	 * @apiError (500) {String} InternalError Something went wrong during signup. Most likely to be during validation.
	 * @apiError (401) {String} InvalidInvite User didn't provide a valid ID
	 */
	.post(async (req, res) => {
		res.status(200).json()
	})

router.route('/autocomplete').get(async (req, res) => {
	try {
		let userList = await user
			.find()
			.select('username settings.displayName avatar')

		res.status(200).json({ payload: userList })
	} catch (error) {
		res.status(500).json({ payload: { message: error.message } })
	}
})

module.exports = router