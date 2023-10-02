const mongoose = require('mongoose')

const { Schema } = mongoose;
const messSchema = new Schema({
    monday:{
        Breakfast: [{
            type: String
        }],
        Lunch: [{
            type: String
        }],
        Snacks: [{
            type: String
        }],
        Dinner: [{
            type: String
        }]
    },
    tuesday:{
        Breakfast: [{
            type: String
        }],
        Lunch: [{
            type: String
        }],
        Snacks: [{
            type: String
        }],
        Dinner: [{
            type: String
        }]
    },
    wednesday:{
        Breakfast: [{
            type: String
        }],
        Lunch: [{
            type: String
        }],
        Snacks: [{
            type: String
        }],
        Dinner: [{
            type: String
        }]
    },
    thursday:{
        Breakfast: [{
            type: String
        }],
        Lunch: [{
            type: String
        }],
        Snacks: [{
            type: String
        }],
        Dinner: [{
            type: String
        }]
    },
    friday:{
        Breakfast: [{
            type: String
        }],
        Lunch: [{
            type: String
        }],
        Snacks: [{
            type: String
        }],
        Dinner: [{
            type: String
        }]
    },
    saturday:{
        Breakfast: [{
            type: String
        }],
        Lunch: [{
            type: String
        }],
        Snacks: [{
            type: String
        }],
        Dinner: [{
            type: String
        }]
    },
    sunday:{
        Breakfast: [{
            type: String
        }],
        Lunch: [{
            type: String
        }],
        Snacks: [{
            type: String
        }],
        Dinner: [{
            type: String
        }]
    },
    updatedAt: {
        type: Date
    }
}, { collection: 'Mess' });

mongoose.models = {}
const Mess = mongoose.model('Mess', messSchema)
module.exports = Mess