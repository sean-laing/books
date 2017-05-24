const readline = require('readline');
const args = require('command-line-args');
const nlp = require('compromise');


const buildWords = (line) => {
	const adjectives = nlp(line).adjectives();
	adjectives.data()
		.forEach((adjective) => {
			adjective.text
				.trim()
				.split(' ')
				.forEach((adjective_slice) => {
					if(adjective_slice.length <= 4) return;
					const lettersOnly = adjective_slice.toString().replace(/[^\w]/g,'');
					if(lettersOnly.length <= 4) return;
					const lowercase = lettersOnly.toLowerCase();
					console.log(lowercase);
			});
		});
}

const main = () => {
	rl = readline.createInterface({input:process.stdin});
	rl.on('line', buildWords);
};

main();
