const { model, Schema } = require('mongoose');
const reactionSchema = require('./Reactions')

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: [1, 'your brian can not  be that empty'],
        maxLength: [280, 'Sorry, you\'re hyperfixating, 280 characters max please']
    },
    createdAt: {
        type: Date,
        default: Date.now

    },
    username: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reactions: [reactionSchema]
}, {
    toJSON: {
        virtuals: true
    }
});

thoughtSchema.virtual('formCereatedAt').get(function () {
    return this.createdAt.toLocaleDateString();
});

thoughtSchema.virtual('reactioncount').get(function () {
    return this.reactions.length
})
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;