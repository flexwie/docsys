import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from '../lib/helpers/error';
import { user } from '../models/user'
import * as jwt from 'jsonwebtoken'

//CheckPropertyHandler
export const checkPropertyUsername = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('username') || req.params.hasOwnProperty('username') ? next() : next(new ErrorHandler(400, 'Please provide a username'))
}

export const checkPropertyPassword = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('password') || req.params.hasOwnProperty('password') ? next() : next(new ErrorHandler(400, 'Please provide a password'))
}

export const checkPropertyMail = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('mail') || req.params.hasOwnProperty('mail') ? next() : next(new ErrorHandler(400, 'Please provide a mail address'))
}

export const checkPropertyName = (req: Request, res: Response, next: NextFunction): void => {
    req.body.hasOwnProperty('displayName') || req.params.hasOwnProperty('displayname') ? next() : next(new ErrorHandler(400, 'Please provide a display name'))
}

//ModelOperations
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    let username = req.body.username || req.params.username || res.locals.user.username
    let password = req.body.password || req.params.password || res.locals.user.password

    if (username === undefined) return next(new ErrorHandler(400, 'Please provide a username'))
    if (password === undefined) return next(new ErrorHandler(400, 'Please provide a password'))

    try {
        var result = await user.getAuthenticated(
            username,
            password
        )
    } catch (error) {
        return next(new ErrorHandler(501, `Error authenticating user: ${(error as Error).message}`))
    }

    try {
        var token = await jwt.sign(result.toJSON(), process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
        })
    } catch (error) {
        return next(new ErrorHandler(501, `Error token signing: ${error.message}`))
    }

    res.locals.user = result
    res.locals.token = token

    next()
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var newUser = new user({
            username: req.body.username,
            password: req.body.password,
            mail: req.body.mail,
            settings: {
                language: 'en',
                displayName: req.body.displayName,
            },
        })

        await newUser.save()

        res.locals.user = newUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error creating user: ${error.message}`))
    }

    next()
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        delete req.body.lockUntil, req.body.loginAttempts, req.body.admin
        let updatedUser = await user.findOneAndUpdate({ username: req.body.username || req.params.username }, req.body, { new: true })
        res.locals.user = updatedUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error updating user: ${(error as Error).message}`))
    }
}

// FindOperations
export const findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let thisUser = await user.findOne({ username: req.body.username || req.params.username }).select('username avatar settings loginAttempts mail lockUntil isLocked')
        res.locals.user = thisUser
    } catch (error) {
        return next(new ErrorHandler(401, 'User not found'))
    }

    next()
}

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let allUser = await user.find({}).select('username avatar settings loginAttempts mail lockUntil isLocked')
        res.locals.user = allUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error finding user: ${(error as Error).message}`))
    }

    next()
}

// Model Admin Functions
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let deletedUser = await user.findOneAndDelete({ username: req.body.username || req.params.username }, { select: 'username' })
        res.locals.user = deletedUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error deleting user: ${(error as Error).message}`))
    }

    next()
}

export const unlockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let unlockedUser = await user.updateOne({ username: req.body.username || req.params.username }, { $set: { loginAttempts: 0, lockUntil: null } }).select('username avatar settings loginAttempts mail lockUntil')
        res.locals.user = unlockedUser
    } catch (error) {
        return next(new ErrorHandler(500, `Error unlocking user: ${(error as Error).message}`))
    }
}