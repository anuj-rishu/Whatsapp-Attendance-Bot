const mongoose = require('mongoose')

const { Schema } = mongoose;
const ChatSchema = new Schema({
    phone_number: {
        type: Number,
        required: true
    },
    phone_number_from_database: {
        type: Number,
    },
    userid:{
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
    name: {
        type: String
    },
    isVerifed:{
        type: Boolean,
        default: false
    },
    verifiedAt:{
        type: Date
    },
    hasPaid:{
        type: Boolean,
        default: false
    },
    paidAt:{
        type: Date
    },
    dueAt:{
        type: Date
    },
    hasIssue: {
        type: Boolean,
        default: false
    },
    register_number:{
        type: String
    },
    branch: {
        type: String
    },
    sem: {
        type: String
    },
    program: {
        type: String
    },
    courses: [
        {
            absent_hours: {
                type: Number,
            },
            subject_name: {
                type: String,
            },
            conducted_hours: {
                type: Number
            }
        }
    ],
    timetable: [
        {
            day_order: {
                type: Number
            },
            time_table: [
                {
                    course_name: {
                        type: String
                    },
                    time: {
                        type: String
                    }
                }
            ]
        }
    ]
}, {timestamps: true});

mongoose.models = {}
const Chat = mongoose.model('Chat', ChatSchema)
module.exports = Chat