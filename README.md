# autoterm

Automate interactive terminal sessions with JavaScript

## Installation

```js
npm install autoterm
```

## Usage

Create a script:

```js
// task-runner.js
#!/usr/bin/env node
'use strict'
const autoterm = require('autoterm')
const t = autoterm({shell: 'sh', prompt: /\$\s+$/, echo: true})

async function runner() {
	await t.run('ls')
	await t.run('exit')
}
runner()
```

Then run your script:

```sh
$ node ./task-runner.js
```

It's that easy!

If you need to change the prompt recognition regular expression temporarily, use:

```js
await t.push(/new-prompt-recoginzer-regex> $/).run('ssh ...')
// ...
await t.pop().run('exit') // go back to old prompt recognizer
```

This is useful for if you SSH into a server that has a different prompt than the computer `autoterm` starts executing commands on.

## License
ISC License (ISC)
Copyright (c) 2016, Jonathan Apodaca <jrapodaca@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
