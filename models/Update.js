const mongoose = require('mongoose')

const { Schema } = mongoose;
const updateSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    chatid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        unique: true
    },
    courses: [
        {
            absent_hours: {
                type: Number,
                required: true
            },
            subject_name: {
                type: String,
                required: true
            },
            conducted_hours: {
                type: Number
            }
        }
    ],
    from: {
        type: String,
        required: true
    }
});

mongoose.models = {}
const Update = mongoose.model('Update', updateSchema)
module.exports = Update