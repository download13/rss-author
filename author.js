var parseOneAddress = require('email-addresses').parseOneAddress;

var separators = /[\<\>\(\)]+/g;
var separated = /<(.+)>|\((.+)\)/;


function parseAuthor(str) {
	var email = null, name = null;
	str = (str || '').trim();

	// Stuff comes in looking like this sometimes: email@domain.tld (Person Surname)
	// We should account for variations though (<> instead of (), switched order)
	var segments = separated.exec(str);

	// If there's something inside markers
	if(segments) {
		var inside = segments[1] || segments[2];
		var outside = str
			.replace(inside, '') // Remove the marker contents
			.replace(separators, '') // Remove the markers
			.trim();

		email = parseOneAddress(inside); // See if inside is email

		if(email) { // Turns out it was
			email = email.address; // get address, and
			name = outside; // assume outside is name
		} else {
			name = inside; // Assume inside is name
			email = parseOneAddress(outside); // and outside is address

			if(email) {
				email = email.address;
			} else { // Neither are email
				email = null; // Maybe this one doesn't contain an email
				name = str; // Just a name
			}
		}
	} else { // Otherwise, just parse it as email
		email = parseOneAddress(str);

		if(email) {
			email = email.address;
		} else { // Not an email, maybe just a name
			email = null;
			name = str;
		}
	}

	if(!name) name = null;
	if(!email) email = null;

	return {
		name: name,
		email: email
	};
}


module.exports = parseAuthor;
