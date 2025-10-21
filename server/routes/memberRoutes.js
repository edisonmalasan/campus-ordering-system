const express = require('express');

const {validateToken} = require(/* TODO: authMiddleware */);

const {handleGetMembers, handlePostMembers, handlePutMembers, handleDeleteMembers} = require(/* TODO: memberController */);

const memberRoutes = express.Router();

memberRoutes("/", handleGetMembers);
// TODO: other routes

module.exports = [
    handleGetMembers,
    handlePostMembers,
    handlePutMembers,
    handleDeleteMembers
]