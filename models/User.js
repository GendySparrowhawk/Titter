const { model, Schema } = require('mongoose');
const { hash, compare } = require('bcrypt');

// user model
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: [2, 'Username must be at least 2 characters'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator(val) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi.test(val);
            },
            message() {
                return 'You must eneter a valid email address'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    // self refrencing user id
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    methods: {
        async validatePass(formPassword) {
            const is_valid = await compare(formPassword, this.password);

            return is_valid;
        }
    },
    virtuals: {
        userData: {
            get() {
                return this.username + ' - ' + this.email;
            }
        },
    },
    toJSON: {
        virtuals: true
    }
});
// salt the password before creating user
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.password = await hash(this.password, 10);
    }

    next();
});
// removes user password from json
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;

    return user;
}
// friends count virtuial 
userSchema.virtual('friendcount').get(function () {
    return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;