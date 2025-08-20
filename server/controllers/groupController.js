const expess = require('express')
const User = require('../models/User')
const Group = require('../models/Group')
const requireAuth = require('../middlewares/authmiddleware')
const sendInviteEmail = require('../utils/sendInviteEmail')
const mongoose= require('mongoose')


//post the created group to DB
exports.create_group = async (req, res) => {
    // take the groupname, current user who creted group ,
    const { groupname, description, members } = req.body;
    const userId = req.user.id; //extracting userId from decoded token(requireAuth)
    try {
        const memberIds = [userId]
        const invited = [];
        //for each added member from the frontend sep them in invitation or existing
        for (const member of members) {
            const existingUser = await User.findOne({ email: member.email });
            if (existingUser) {
                memberIds.push(existingUser._id)
            }
            else {
                invited.push({ name: member.name, email: member.email })
            }
        }
        //create new group 
        const newgroup = new Group({
            name: groupname,
            description,
            createdBy: userId,
            members: memberIds,
            invitedMembers: invited
        });
        const savedGroup = await newgroup.save();

        for (const invite of invited) {
            try {
                const inviter = await User.findById(userId);
                await sendInviteEmail({
                    to: invite.email,
                    name: invite.name,
                    inviter: inviter.email,
                    groupName: groupname
                })
            }
            catch (emailErr) {
                console.error(`Failed to send invite to ${invite.email}:`, emailErr.message);
            }
        }
        //Add group to the user's group field
        await User.findByIdAndUpdate(userId, {
            $push: {
                groups: savedGroup._id
            }
        })

        res.status(201).json({
            message: "Group created successfully",
            group: savedGroup,
            invited
        });
    } catch (err) {
        console.error("Error creating group:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.get_groups = async(req,res) => {
    const userId = req.user.id;
    try{
        const groups = await Group.find({members : userId})
        .populate('members','name email')
        .populate('createdBy','name email');
        // populate() helps you access full referenced data without making a separate query.
        console.log("Fetched groups:", groups);
        res.status(200).json(groups);
    }catch(err){
        console.error("Error fetchng groups:",err.message)
        res.status(500).json({ message: "Internal server error" });
    }
}

