#!/bin/bash

echo $@
booktypes=()
rm intermediate_data/raw_word_counts.tsv

for var in "$@"
do
	echo $var
	base=`dirname $var`
	bookname=`head -n 1 $var | tr ' ' '_' |  tr -d '\n'` #|  sed 's/The Project Gutenberg EBook of //g' 
	mv $var base/$bookname
done
