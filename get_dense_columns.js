const commandLineArgs = require('command-line-args')
const fs = require('fs');
const readline = require('readline');
var stats = require("stats-lite");

const columnAggergates = {};
const allValues = [];
let denseColumns = {};
const allLines = [];

const processLine = (line) => {
	const lineValues = line.split('\t');
	const columnHeader = lineValues[0];
	const columnValue = lineValues[1];
	if(columnAggergates[columnHeader] === undefined) {
		columnAggergates[columnHeader] = 0;
	} 
	columnAggergates[columnHeader] += parseInt(columnValue,10);
	allValues.push(parseInt(columnValue,10));
	//avoids loading the files again
	//might create memory pressures for large files
	//but the input data set shouldn't be too large
	allLines.push(lineValues);
};

let currentBook = '';
let headers = false;

const checkHeaders = () => {
	if(headers) {
		return;
	}
	headers = true;
	let headerLine = 'bookname';
	for(columnName in denseColumns) {
		headerLine += '\t' + columnName;
	}
	headerLine += '\t' + 'booktype'
	console.log(headerLine);
}

const outputBookAggergates = (currentBookFields, bookType, currentBook) => {
	checkHeaders();
	let line = currentBook;
	for(let columnName in denseColumns) {
		let columnValue = currentBookFields[columnName];
		if(columnValue === undefined) {
			columnValue = ""
		}
		line += '\t' + columnValue;
	}
	line += '\t' + bookType
	console.log(line);
}

const outputDenseAggergates = () => {
	const percentile = stats.percentile(allValues, .99);
	//TODO, use stddev to remove outliers
	denseColumns = {};
	for(columnName in columnAggergates) {
		if(columnAggergates[columnName] >= percentile)
			denseColumns[columnName] = 1;
	}
	let currentBookFields = {};
	for(let i = 0; i < allLines.length; i++) {
		const lineValues = allLines[i];
		const outputBook = lineValues[2];
		const bookType = lineValues[3]
		if(outputBook !== currentBook && currentBook !== '') {
			outputBookAggergates(currentBookFields, bookType, currentBook);
		}
		const columnHeader = lineValues[0];
		currentBook = outputBook;
		if(denseColumns[columnHeader] === 1) {
			currentBookFields[columnHeader] = lineValues[1];
		}
	}

}

const readFile = () => {
	const rl = readline.createInterface({input: process.stdin});
	rl.on('line', processLine);
	rl.on('close', () => {
		outputDenseAggergates();
	});
}


const main = () => {
	readFile();
}

main();