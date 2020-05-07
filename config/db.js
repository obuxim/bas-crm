const mongoose = require('mongoose')
const config = require('config')
const url = config.get('mongoURI')
const connectDB = async function(){
    try{
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        console.log('MongoDB Connected!')
    } catch(error){
        if(error) throw error.message
    }
}

module.exports = connectDB