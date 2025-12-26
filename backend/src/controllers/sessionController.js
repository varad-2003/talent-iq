import { ChatClient, streamClient } from "../lib/stream.js"
import Session from "../models/Session.js"

export async function createSession (req, res) {
    try {
        const {problem, difficulty} = req.body
        const userId = req.user._id
        const clerkId = req.user.clerkId

        if(!problem || !difficulty){
            return res.status(400).json({message: "Problem and difficulties are required"})
        }

        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            callId
        })

        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by: clerkId,
                custom: {problem, difficulty, sessionId: session._id.toString()}
            }
        })

        const channel = ChatClient.channel("messaging",callId,{
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId]
        })

        await channel.create()

        res.status(201).json({session})
    } catch (error) {
        console.log("error in createSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export async function getActiveSession (req, res) {
    try {
        const sessions = await Session.find({ status: "active"})
        .populate("host", "name profileImage email clerkId")
        .sort({ createdAt: -1})
        .limit(20)

        res.status(200).json({ sessions})
    } catch (error) {
        console.log("error in getActiveSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export async function getSessionById(req, res) {
    try {
        const {id} = req.params

        const session = await Session.find(id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId")

        if(!session) return res.status(404).json({message: "Session not found"})
        
        res.status(200).json({ session })
    } catch (error) {
        console.log("error in getSessionById controller", error.message);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export async function getPastSession(req, res) {
    try {
        const userId = req.user._id;
        const sessions = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }]
        }).sort({ createdAt: -1 }).limit(20)

        res.status(200).json({ sessions })
    } catch (error) {
        console.log("error in getPastSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export async function joinSession(req, res) {
    try {
        const {id} = req.params
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const session = await Session.findById(id)

        if(!session) return res.status(404).json({ message: "session not found"})

        if(session.participant) return res.status(404).json({ message: "session is full"})
        
        session.participant = userId
        await session.save()

        const channel = ChatClient.channel("messaging", session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({ session })
    } catch (error) {
        console.log("error in getActiveSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export async function endSession(req, res) {
    try {
        const {id} = req.params
        const userId = req.user._id

        const session = await Session.findById(id)

        if(!session) return res.status(404).json({message: "session not found" })

        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({ message: "Only the host can end the session"})
        }
        
        if(session.status === "completed"){
            return res.status(403).json({ message: "session already completed"})
        }

        session.status = "completed";
        await session.save()

        const  call = streamClient.video.call("default", session.callId)
        await call.delete({hard: true})

        const channel = ChatClient.channel("messaging", session.callId)
        await channel.delete()

    } catch (error) {
        console.log("error in endSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error"})
    }
}