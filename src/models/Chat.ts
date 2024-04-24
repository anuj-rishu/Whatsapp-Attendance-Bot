import mongoose from "mongoose";

const { Schema } = mongoose;

interface ChatType {
    phone_number: number;
    phone_number_from_database?: number;
    userid?: string;
    password?: string;
    token?: string;
    name?: string;
    isVerifed?: boolean;
    verifiedAt?: Date;
    hasPaid?: boolean;
    paidAt?: Date;
    dueAt?: Date;
    hasIssue?: boolean;
    register_number?: string;
    branch?: string;
    sem?: string;
    program?: string;
    courses?: Array<{
        absent_hours?: number;
        subject_name?: string;
        conducted_hours?: number;
    }>;
    timetable?: Array<{
        day_order?: number;
        time_table?: Array<{
            course_name?: string;
            time?: string;
        }>;
    }>;
}


const ChatSchema = new Schema<ChatType>({
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

export interface ChatDocument extends ChatType, Document {
    _id: mongoose.Types.ObjectId;
}

const Chat = mongoose.model<ChatDocument>('Chat', ChatSchema)
export default Chat;