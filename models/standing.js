const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const standingSchema = new Schema(
{
    contest: {
        type: Schema.Types.ObjectId,
        ref: 'Contest',
    },
    rows:{
        type: [
            {
                members: {
                    type: [
                        {
                            handle: {
                                type: String,
                                required: true
                            }
                        }
                    ]
                },
                rank: {
                    type: Number,
                    required: true,
                },
                teamId: {
                    type: Number,
                    required: true
                },
                teamName: {
                    type: String,
                    required: true
                },
                points: {
                    type: Number,
                    required:true
                }
            }
        ],
        required: true
    }
},
{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            ret.rows = ret.rows.map((field) => {
                delete field._id;
                return field;
            });
        },
    },
}
);

module.exports = mongoose.model('Standing', standingSchema);
