const newUser = require('./newUser');
const validateUser = require('./validateUser');
const loginUser = require('./loginUser');
const editUser = require('./editUser');
const getUserProfile = require('./getUserProfile');
const getOwnProfile = require('./getOwnProfile');
const getUser = require('./getUser');

module.exports = {
    newUser,
    getUser,
    validateUser,
    loginUser,
    editUser,
    getUserProfile,
    getOwnProfile,
};
