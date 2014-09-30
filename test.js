require('blanket')({
	pattern: function(filename) {
		console.log(filename);
		return filename.indexOf('author.js') !== -1;
	}
});

var assert = require('assert');
var parseAuthor = require('./author');


describe('rss-author', function() {
	it('should find an address and name: email (name)', function() {
		var r = parseAuthor('test@example.com (Testy McTesterson)');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find an address and name: email <name>', function() {
		var r = parseAuthor('test@example.com <Testy McTesterson>');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find an address and name: (name) email', function() {
		var r = parseAuthor('(Testy McTesterson) test@example.com');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find an address and name: <name> email', function() {
		var r = parseAuthor('<Testy McTesterson> test@example.com');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find an address and name: name <email>', function() {
		var r = parseAuthor('Testy McTesterson <test@example.com>');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find an address and name: <email> name', function() {
		var r = parseAuthor('<test@example.com> Testy McTesterson');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find an address and name: name (email)', function() {
		var r = parseAuthor('Testy McTesterson (test@example.com)');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find an address and name: (email) name', function() {
		var r = parseAuthor('(test@example.com) Testy McTesterson');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, 'test@example.com');
	});

	it('should find a raw name stripping whitespace', function() {
		var r = parseAuthor('  Testy McTesterson   ');

		assert.equal(r.name, 'Testy McTesterson');
		assert.equal(r.email, null);
	});

	it('should find a name in gibberish', function() {
		var r = parseAuthor('ajdfdausifyiua89fd89fa89dfhjadfjk');

		assert.equal(r.name, 'ajdfdausifyiua89fd89fa89dfhjadfjk');
		assert.equal(r.email, null);
	});

	it('should find a name with () in it', function() {
		var r = parseAuthor('Testy (mr wut) McTesterson');

		assert.equal(r.name, 'Testy (mr wut) McTesterson');
		assert.equal(r.email, null);
	});

	it('should find a raw address', function() {
		var r = parseAuthor('an@address.net');

		assert.equal(r.email, 'an@address.net');
		assert.equal(r.name, null);
	});

	it('should find an address with ()', function() {
		var r = parseAuthor('(an@address.net)');

		assert.equal(r.email, 'an@address.net');
		assert.equal(r.name, null);
	});

	it('should find an address with <>', function() {
		var r = parseAuthor('<an@address.net>');

		assert.equal(r.email, 'an@address.net');
		assert.equal(r.name, null);
	});

	it('should handle unicode names', function() {
		var r = parseAuthor('האץ <randomcharacters@gmail.com>');

		assert.equal(r.email, 'randomcharacters@gmail.com');
		assert.equal(r.name, 'האץ');
	});
});
