const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'Sent',
    },
    property_address: {
        street: {
            type: String,
            required: true,
        },
        street1: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
    },
    contact: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            required: true
        }
    },
    photos: {
        type: {
            title: {
                type: String,
                required: true,
            },
            photoURL: {
                type: String,
                required: false,
            },
            slug: {
                type: String,
                required: true,
            },
            isRequired: {
                type: Boolean,
                default: false
            }
        }
    },
    files: {
        type: {
            title: {
                type: String,
                required: true,
            },
            fileURL: {
                type: String,
                required: false,
            },
            slug: {
                type: String,
                required: true
            },
            isRequired: {
                type: Boolean,
                default: false
            }
        }
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    validity: {
        type: Number,
        required: true,
    },
    expires_at: {
        type: Date,
        default: function(){
            if(this.validity == 0){
                return 0;
            } else {
                return Date.now() + this.validity
            }
        },
    },
    submission_note: {
        type: String,
        required: false
    }
}, {timestamps: true})

RequestSchema.virtual('valid').get(function(){
    if(this.validity != 0){
        if(this.expires_at - Date.now() < 0){
            return false
        } else {
            return true
        }
    } else {
        return true
    }
})

const Request = mongoose.model('Request', RequestSchema)

module.exports = Request