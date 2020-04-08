var express = require('express')
var jwt = require('jsonwebtoken')
var router = express.Router()

var user = require('../models/user')

/* GET users listing. */
router.route('/login').post(async (req, res) => {
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
		res.status(401).json({ payload: { message: error.message } })
	}
})

router.route('/signup').post(async (req, res) => {
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

		console.log(newUser.toObject())

		const token = jwt.sign(newUser.toObject(), process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES,
		})

		await newUser.save()

		res.status(200).json({ payload: { user: newUser, token: token } })
	} catch (error) {
		console.log(error)
		res.status(500).json({ payload: { message: error.message } })
	}
})

router.route('/signup/:inviteid').post(async (req, res) => {
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
