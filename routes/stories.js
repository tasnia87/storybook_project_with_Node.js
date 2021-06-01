const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')
const sequilizer = require('sequelize')
const op = sequilizer.Op



router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
        
    })
router.post('/', async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)

    }
})
//edit stories
router.get('/edit/:id', async (req, res) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()// send to template

    if (!story) {
        res.render('errors/404')
    }

    if (story.user != req.user.id) {
        res.redirect('/stories')
    }
    else {
        res.render('stories/edit', {
            story,

        })
    }
})
//update
router.put('/:id',async (req, res) => {
    
        let story = await Story.findById(req.params.id).lean()


        if (story.user != req.user.id) {
            return res.render('errors/404')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    } )
    
    router.get('/', async (req, res) => {
        try {
            const stories = await Story.find({ status: 'public' })
                .populate('user') // get data from user model like id,name
                .sort({ createdAt: 'desc' })
                .lean()
            res.render('stories/index', {
                stories,
            }
            )
        } catch (err) {
            console.error(err)

        }
    })
//delete

router.delete('/:id', async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.remove({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})
//show user story
router.get('/:id', async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user._id != req.user.id && story.status == 'private') {
            res.render('error/404')
        } else {
            res.render('stories/show', {
                story,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})







    module.exports = router;