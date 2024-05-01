import mongoose from "mongoose";

const { Schema } = mongoose;

interface IMess extends Document {
    monday: {
        Breakfast: string[];
        Lunch: string[];
        Snacks: string[];
        Dinner: string[];
    };
    tuesday: {
        Breakfast: string[];
        Lunch: string[];
        Snacks: string[];
        Dinner: string[];
    };
    wednesday: {
        Breakfast: string[];
        Lunch: string[];
        Snacks: string[];
        Dinner: string[];
    };
    thursday: {
        Breakfast: string[];
        Lunch: string[];
        Snacks: string[];
        Dinner: string[];
    };
    friday: {
        Breakfast: string[];
        Lunch: string[];
        Snacks: string[];
        Dinner: string[];
    };
    saturday: {
        Breakfast: string[];
        Lunch: string[];
        Snacks: string[];
        Dinner: string[];
    };
    sunday: {
        Breakfast: string[];
        Lunch: string[];
        Snacks: string[];
        Dinner: string[];
    };
    updatedAt: Date;
}

const messSchema = new Schema<IMess>({
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
}, { collection: 'Mess', timestamps: true });

const Mess = mongoose.model<IMess>('Mess', messSchema)
export default Mess