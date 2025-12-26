import { requireAuth } from '@clerk/express'
import User from "../models/User.js"

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId
            if(!clerkId) return res.status(401).json({msg: "unauthorized - invalid token"})

            const user = await User.findOne({clerkId})

            if(!User) return res.status(404).json({msg: "User not found"})

            req.user = user    

            next()
        } catch (error) {
            console.error("Error is protetRoute middleware", error);
            res.status(500).json({ message: "Internal server error"})
        }
    }
]