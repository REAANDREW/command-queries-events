var uuid = require('node-uuid');
var bodyParser = require('body-parser');
var unirest = require('unirest');
var express = require('express');
require('should');

var DomainRepository = require('./lib/DomainRepository');

