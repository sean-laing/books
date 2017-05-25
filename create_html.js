const commandLineArgs = require('command-line-args')
const fs = require('fs');
const readline = require('readline');
const ms = require('mustache');

const optionDefinitions = [
  { name: 'booktypes', type: String, multiple: true }
]
const options = commandLineArgs(optionDefinitions)

const list = [];


const createHtml = () => {
	//call mustache
	const template = fs.readFileSync("./create_html.mustache", {encoding : "UTF8" });
	console.log(ms.render(template, { list : list}));
}

const processLine = (line) => {
	const lineFields = line.split('\t');
	const bookname = lineFields[0];
	const bookdata = {
		name : bookname,
		booktypes : []
	}
	list.push(bookdata);
	for(let i = 0; i < options.booktypes.length; i++) {
		const fieldType = options.booktypes[i];
		//scores are offset into the tsv by 2
		const fieldValue = lineFields[i+2];
		//rount to lowest 10 and scale (/2) the field to em's
		const roundedFieldValue = Math.floor(fieldValue*10) * 10; 
		if(roundedFieldValue == 0) {
			continue;
		}
		bookdata.booktypes.push({
			scaledScore : roundedFieldValue/2,
			booktype : fieldType
		});
	}
}

const main = () => {
	const rl = readline.createInterface({input: process.stdin});
	rl.on('line', processLine);
	rl.on('close', createHtml);
}

main();