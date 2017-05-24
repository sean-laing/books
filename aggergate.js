const readline = require('readline');
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'filename', type: String },
  { name: 'booktype', type: String }
]
const options = commandLineArgs(optionDefinitions)

const aggergates = {};

const buildAggergates = (word) => {
	if(aggergates[word] === undefined) {
		aggergates[word] = 1;
	} else {
		aggergates[word] = aggergates[word] + 1;
	}
}

const outputAggergate = () => {
	for(word in aggergates) {
		let valueLine = [word, aggergates[word], options.filename, options.booktype].join("\t");
		console.log(valueLine);
	}
	
}

const main = () => {
	rl = readline.createInterface({input:process.stdin});
	rl.on('line', buildAggergates);
	rl.on('close', outputAggergate)
};

options.filename = options.filename.replace('\n','');
options.booktype = options.booktype.replace('\n','');
main();