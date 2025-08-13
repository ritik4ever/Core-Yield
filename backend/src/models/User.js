const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    totalDeposited: {
        type: Number,
        default: 0
    },
    totalRewards: {
        type: Number,
        default: 0
    },
    preferredRiskLevel: {
        type: Number,
        default: 3,
        min: 1,
        max: 5
    },
    autoCompoundEnabled: {
        type: Boolean,
        default: true
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.updateLastActive = function () {
    this.lastActive = new Date();
    return this.save();
};

module.exports = mongoose.model('User', userSchema);