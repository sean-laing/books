const readline = require('readline');
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'filename', type: String }
]
const options = commandLineArgs(optionDefinitions)

const main = () => {
	rl = readline.createInterface({input:process.stdin});
	rl.on('line', (line) => {
		console.log([line,options.filename].join('\t'));
	});
};

main();