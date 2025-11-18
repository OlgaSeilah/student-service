import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
        _id: {type: Number, required: true},
        name: {type: String, required: true},
        password: {type: String, required: true},
        scores: {
            type: Map,
            key: String,
            of: Number,
            default: {}
        }
    }, {
    versionKey: false,
    toJSON: {
        transform: function (doc, ret) {
            const responseBody = {};
            responseBody.id = ret._id;
            for (const key in ret) {
                if (key !== '_id') {
                    responseBody[key] = ret[key];
                }
            }
            delete ret._id;
            return responseBody;
        }

    }
    }
)

const Student = mongoose.model('Student', studentSchema, 'college');
export default Student;