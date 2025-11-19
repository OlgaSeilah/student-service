import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
        _id: Number,
        name: String,
        password: String,
        scores: {
            type: Map,
            key: String,
            of: Number,
            default: {}
        }
    },
    {
        versionKey: false,
        toJSON: {
            transform: function (doc, ret) {
                const responseBody = {};
                responseBody.id = ret._id;
                delete ret._id;

                for (const key in ret) {
                    if (ret.hasOwnProperty(key)) {
                        responseBody[key] = ret[key];
                    }
                }
                return responseBody;
            }
        }
    }
)

const Student = mongoose.model('Student', studentSchema, 'college');
export default Student;