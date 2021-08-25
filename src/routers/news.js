const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middleware/auth')
    // post 

router.post('/news', auth, async(req, res) => {

    const news = new News({...req.body, owner: req.user._id })
    try {
        await news.save()
        res.status(200).send(news)
    } catch (e) {
        res.status(400).send(e)
    }
})

// get all( relation)

router.get('/news', auth, async(req, res) => {
    try {
        await req.reporter.populate('reporterNews').execPopulate()
        res.send(req.reporter.reporterNews)
    } catch (e) {
        res.status(500).send(e)
    }
})

// get by id

router.get('/news/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {

        const news = await News.findOne({ _id, owner: req.user._id })
        if (!news) {
            return res.status(404).send('news not found')
        }
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send(e)
    }
})

// patch
router.patch('/news/:id', auth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    try {

        const news = await News.findOne({ _id, owner: req.user._id })
        if (!news) {
            return res.status(404).send('news is not found')
        }
        updates.forEach((update) => news[update] = req.body[update])
        await news.save()
        res.send(news)
    } catch (e) {
        res.status(400).send(e)
    }

})

// Delete
router.delete('/news/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOneAndDelete({ _id, owner: req.user._id })
        if (!news) {
            return res.status(404).send('news is not found')
        }
        res.send(news)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router