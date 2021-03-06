'use strict';

const nodemailer = require('nodemailer');
const jade       = require('jade');
const fs         = require('fs');
const config     = require('./../../config.json');

var path = process.cwd() + '/lol-server-nodejs/';

module.exports.send = function(type, subject, recipients, args) {

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: config.mail.smtp,
		port: config.mail.port,
		secure: true, // true for 465, false for other ports
		auth: {
			user: config.mail.user, // generated ethereal user
			pass: config.mail.password // generated ethereal password
		},
		dkim: {
			domainName: config.mail.dkim.domainName,
			keySelector: config.mail.dkim.keySelector,
			privateKey: config.mail.dkim.privateKey
		}
	});

	fs.readFile(path + '/components/mail/email-templates/' + type + '/html.jade', 'utf8', function (err, data) {

		if (err) throw err;

		var fn = jade.compile(data);
		var html = fn(args);

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"Guides LoL" <' + config.mail.user + '>', // sender address
			to: recipients,
			subject: subject,
			text: html,
			html: html
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	});
};
