'use strict'

const ansifilter = require('ansifilter')
const EventEmitter = require('events')
const pty = require('pty.js')

// http://stackoverflow.com/a/9310752/263986
function regex(text) {
	const r =  text instanceof RegExp ? text : new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g')
	r.lastIndex = 0
	return r
}

function autoterm(opts = {}) {
	let {shell} = opts
	shell = shell || process.env.SHELL || 'sh'
	const prompts = [regex(opts.prompt || /\$\s+$/gm)]
	const prompt = () => prompts[prompts.length - 1]

	const EVENTS = new EventEmitter()

	// Setup pty {{
	const term = pty.spawn(shell || process.env.SHELL || 'sh', [], {
		cwd: process.cwd(),
		env: Object.assign({TMUX: 'false'}, process.env),
		rows: process.stdout.rows,
		cols: process.stdout.columns,
	})
	process.stdout.on('resize', () => term.resize(process.stdout.columns, process.stdout.rows))
	// }}

	// Cleanup {{
	term.on('exit', code => process.exit(code))
	// }}

	// wire I/O {{
	term.on('data', d => {
		EVENTS.emit('data', d)
		if (opts.echo)
			process.stdout.write(d)
	})
	if (opts.echo) {
		process.stdin.setRawMode(true)
		process.stdin.on('data', d => term.write(d))
	}
	// }}

	return {
		run: (cmd, prmpt = prompt()) => new Promise(yes => {
			let capturedOutput = ''
			function processData(d) {
				capturedOutput += d.toString('utf-8')
				if (!regex(prmpt).test(ansifilter(capturedOutput))) return

				EVENTS.removeListener('data', processData)
				const lines = capturedOutput.split(/\r|\n/)
					.filter(s => s !='')
					.map(s => ansifilter(s))
				yes(lines.slice(1, lines.length - 1).join('\n'))
			} // processData
			EVENTS.on('data', processData)

			cmd = cmd.trim() + '\n'
			term.write(cmd)
		}),

		push(prompt) {
			prompts.push(prompt)
			return this
		},

		pop() {
			prompts.pop()
			return this
		}
	}
}

module.exports = autoterm
