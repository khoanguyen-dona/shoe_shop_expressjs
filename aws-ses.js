const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION || 'ap-southeast-1',
  });
// Nodemailer SES Transporter
const transporter = nodemailer.createTransport({
    SES: new AWS.SES({ apiVersion: '2010-12-01' }),
  });

module.exports = transporter
