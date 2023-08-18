const express = require('express');
const { registerUser, loginUser, getUser, logoutUser, completeUser, searchUser, friendReq, freindAcc_Rem, viewProfile, updateProfile, verifyPass, suggestFriends, getNotificationsForUser, readNotification, clearAllNotifications } = require('../controller/userController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router()

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(isAuthenticated, getUser);
router.route('/profile/update').put(isAuthenticated, updateProfile);
router.route('/profile/update/password/verify').post(isAuthenticated, verifyPass);
router.route('/notification/get_all').get(isAuthenticated, getNotificationsForUser);
router.route('/notification/read').put(isAuthenticated, readNotification);
router.route('/notification/read').put(isAuthenticated, readNotification);
router.route('/notification/clearAll').put(isAuthenticated, clearAllNotifications);

router.route('/profile/view/:id').get(isAuthenticated, viewProfile);
router.route("/logout").get(logoutUser);
router.route("/search").get(isAuthenticated, searchUser);
router.route("/profile/complete").put(isAuthenticated, completeUser);
router.route("/friend/request").put(isAuthenticated, friendReq)
router.route("/friend/suggest").post(isAuthenticated, suggestFriends)

router.route("/friend/request/action").put(isAuthenticated, freindAcc_Rem);


module.exports = router;