const { Schema } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: [280, 'I wanted passion but now this is too much, only 280 characters please']
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reactionSchema.virtual('formattedCreadtedAt').get(function () {
    return this.createdAt.toLocaleDateString();
});


module.exports = reactionSchema;