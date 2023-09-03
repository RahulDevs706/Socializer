const express = require('express');
const { createPost, getPostsForHome, likePost, commentPost, getAPost, getCommentForAPost, deleteComment, deleteAPost, updatePost, getPostsForProPage } = require('../controller/postController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router()

router.route('/create').post(isAuthenticated, createPost);
router.route('/getPost/home').get(isAuthenticated, getPostsForHome);
router.route('/getPost/profile/:id').get(isAuthenticated, getPostsForProPage);

router.route('/like/:id').put(isAuthenticated, likePost);
router.route('/comment/:id').put(isAuthenticated, commentPost).get(isAuthenticated, getCommentForAPost);
router.route('/comment/:id/:commentId').delete(isAuthenticated, deleteComment)

router.route('/:id').get(isAuthenticated, getAPost).delete(isAuthenticated, deleteAPost).put(isAuthenticated, updatePost);



module.exports = router;