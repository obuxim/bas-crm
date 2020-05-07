const express = require('express')
const fs = require('fs')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const Request = require('../models/Request')
const {v4 : uuid} = require('uuid')
const mailer = require('../config/mail')
const { ensureAuthenticated } = require('../middlewares/auth')

// Get all requests
router.get('/', ensureAuthenticated, async (req, res) => {
    let requests = await Request.find({})
    return res.render('requests/index', {requests})
})

// Get single request
router.get('/show/:id', ensureAuthenticated, async (req, res) => {
    let id = req.params.id
    try{
        let request = await Request.findById(id)
        if(request){
            return res.render('requests/show', {request})
        }
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('/requests')
    }
})

// Fill up a request
router.get('/fillup/:url', async (req, res) => {
    const url = req.params.url
    try{
        let request = await Request.findOne({url})
        if(request.valid){
            if(request.status == 'Completed'){
                return res.render('requests/completed')
            } else {
                request.status = 'Visited'
                await request.save()
                return res.render('requests/fillup', {request})
            }
        } else {
            return res.render('requests/expired')
        }
    } catch (error) {
        return res.send(error.message)
    }
})

// Handle fill up request
router.post('/fillup/:url', async (req, res) => {
    const url = req.params.url
    try{
        let request = await Request.findOne({url})
        if(request.valid){
            let photos = []
            let files = []
            let {subimission_note} = req.body
            for (const photo of request.photos) {
                if(typeof req.files[photo.slug] != 'undefined') {
                    let fileNameWithExt = req.files[photo.slug].name
                    let ext = fileNameWithExt.substring(fileNameWithExt.lastIndexOf('.')+1)
                    let dirName = __dirname + '/../public/requests/photos/'+request.url
                    let fileName = photo.slug+'.'+ext
                    let fileURL = dirName + '/' + fileName
                    try{
                        fs.mkdirSync(dirName)
                    } catch (error) {
                        if(error.code != 'EEXIST'){
                            console.error(error.message)
                        }
                    }
                    req.files[photo.slug].mv(fileURL, (error) => {
                        console.error(error)
                    })
                    photo.url = '/requests/photos/'+request.url+'/'+fileName
                    photos.push(photo)
                }
            }
            for (const file of request.files) {
                if(typeof req.files[file.slug] !="undefined"){
                    let fileNameWithExt = req.files[file.slug].name
                    let ext = fileNameWithExt.substring(fileNameWithExt.lastIndexOf('.')+1)
                    let dirName = __dirname + '/../public/requests/files/'+request.url
                    let fileName = file.slug+'.'+ext
                    let fileURL = dirName + '/' + fileName
                    try{
                        fs.mkdirSync(dirName)
                    } catch (error) {
                        if(error.code != 'EEXIST'){
                            console.error(error.message)
                        }
                    }
                    req.files[file.slug].mv(fileURL, (error) => {
                        console.error(error)
                    })
                    file.url = '/requests/files/'+request.url+'/'+fileName
                    files.push(file)
                }
            }
            request.photos = photos
            request.files = files
            request.status = 'Completed'
            request.submission_note = subimission_note
            await request.save()
            return res.render('requests/thanks')
        } else {
            return res.render('requests/expired')
        }
    } catch (error) {
        return res.send(error.message)
    }
})

// Delete a request
router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        let request = await Request.findById(req.params.id)
        await request.delete()
        req.flash('success', 'Successfully deleted!')
        return res.redirect('/requests')
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('/requests')
    }
})

// Create a new request
router.get('/new', ensureAuthenticated, (req, res) => {
    return res.render('requests/create')
})

// Handle creating new request
router.post('/new',[
    ensureAuthenticated,
    check('contact_name', 'Please enter the contact person name').not().isEmpty(),
    check('street', 'Please enter the property street address').not().isEmpty(),
    check('city', 'Please enter the property city').not().isEmpty(),
    check('state', 'Please enter the property state').not().isEmpty(),
    check('zip', 'Please enter the property zip').not().isEmpty(),
    check('contact_email', 'Please enter valid contact email').isEmail(),
    check('contact_phone', 'Please enter valid contact mobile').isMobilePhone(),
    check('contact_note', 'Please enter a note to send to the contact person').not().isEmpty()
], async (req, res) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('errors', errors.array())
        return res.redirect('/requests/new')
    }
    const {contact_name, street, street1, city, state, zip, contact_email, contact_phone, contact_note, expiration_day, expiration_hour, expiration_minute} = req.body
    let input_names = Object.keys(req.body)
    let input_values = Object.values(req.body)
    let inputs = []
    for(i=0; i<input_names.length; i++){
        let key = input_names[i]
        let value = input_values[i]
        inputs[key] = value
    }
    let hasPhoto = true
    let photoIndex = 0
    let photos = []
    while(hasPhoto){
        if(typeof inputs['photo'+photoIndex] == 'undefined'){
            hasPhoto = false
            break
        } else {
            let ititle = inputs['photo'+photoIndex]
            let iisRequired = inputs['photoRequired'+photoIndex] == 'on' ? true : false
            let islug = ititle.toLowerCase().replace(/ +(?= )/g,'').replace(/\s/g , "-")
            let photo = {
                title: ititle,
                slug: islug,
                url: '/requests/photos/noimage.png',
                isRequired: iisRequired
            }
            photos.push(photo)
            photoIndex++
        }
    }
    let hasFile = true
    let fileIndex = 0
    let files = []
    while(hasFile){
        if(typeof inputs['file'+fileIndex] == 'undefined'){
            hasFile = false
            break
        } else {
            let ititle = inputs['file'+fileIndex]
            let iisRequired = inputs['fileRequired'+fileIndex] == 'on' ? true : false
            let islug = ititle.toLowerCase().replace(/ +(?= )/g,'').replace(/\s/g , "-")
            let file = {
                title: ititle,
                slug: islug,
                isRequired: iisRequired
            }
            files.push(file)
            fileIndex++
        }
    }
    const property_address = {
        'street': street,
        'street1': street1,
        'city': city,
        'state': state,
        'zip': zip
    }
    const contact = {
        'name': contact_name,
        'email': contact_email,
        'mobile': contact_phone,
        'note': contact_note
    }
    const url = uuid()
    const validity = ((expiration_day * 86400000) + (expiration_hour * 3600000) + (expiration_minute * 60000))

    try {
        let request = new Request({
            property_address,
            contact,
            photos,
            files,
            url,
            validity
        })
        await request.save()
        req.flash('success', 'Successfully Created!')
        // res.redirect(`/requests/${request.id}`)
        try {
            let mail = await mailer.sendMail({
                from: '"Boston Appraisal Services" <orders@boston-appraisal.com>',
                to: request.contact.email,
                subject: "Please complete your appraisal! - Boston Appraisal Services",
                html: request.contact.note
            })
            console.log(mail.messageId)
        } catch (e) {
            console.error('Error sending email: ', e)
        }
        return res.redirect('/requests')
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('/requests/new')
    }
})

module.exports = router