const Post = require('./db-helpers')

const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
    const postInserted = req.body
    if (!postInserted.title || !postInserted.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Post.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
})

router.post('/:id/comments', (req, res) => {
    const postInserted = req.body
    if (!postInserted.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Post.insertComment(postInserted)
        .then(comment => {
            if(!comment) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(201).json(comment)
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
})

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {
    // console.log(req)
    const id = req.params.id
    Post.findById(id)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    Post.findPostComments(id)
        .then(comments => {
            if (!comments) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(comments)
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Post.remove(id)
        .then(deleted => {
            if (!deleted) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(deleted)
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post could not be removed" })
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const updatedPost = req.body
    if (!updatedPost.title || !updatedPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Post.update(req.params.id, req.body)
        .then(updated => {
            if (!updated) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(updated)
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
    }
})

module.exports = router