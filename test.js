'use strict'

const assert = require('assert')
const autoterm = require('./')
const co = require('co')

co(function * main() {
	const t = autoterm({shell: 'sh'})
	assert.equal(yield t.run('echo Hello World'), 'Hello World')

	yield t.push(/new-prompt> $/).run('PS1="new-prompt> "')
	yield t.pop().run('PS1="\$ "')

	console.log('All tests completed successfully') // eslint-disable-line no-console
	process.exit(0)
}).catch(e => {
	console.error(e && e.stack ? e.stack : e) // eslint-disable-line no-console
	process.exit(1)
})
