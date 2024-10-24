const express = require('express');
const bodyParse = require('body-parse');

const db = require('./config/db');

const app = express();

app.use(bodyParse.json());