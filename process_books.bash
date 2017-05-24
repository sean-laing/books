#!/bin/bash

echo $@
booktypes=()
rm intermediate_data/raw_word_counts.tsv

for var in "$@"
do
	echo $var
	base=`dirname $var`
	booktype=`basename $base | tr -d '\n'`
	bookname=`basename $var`
	#bookname=`head -n 1 $var | tr ' ' '_' |  tr -d '\n'` #|  sed 's/The Project Gutenberg EBook of //g' 
	cat $var | node gather_words.js | node aggergate.js --filename $bookname --booktype $booktype >> intermediate_data/raw_word_counts.tsv
	booktypes+="$booktype "
done

unique_booktype=`echo ${booktypes[@]} | tr ' ' '\n' | sort -u | tr '\n' ' '`
echo $unique_booktype
cat intermediate_data/raw_word_counts.tsv | node get_dense_columns.js  > intermediate_data/features.tsv
cat intermediate_data/raw_word_counts.tsv | node get_dense_columns.js | ./rf_train_validate.R $unique_booktype > prediction/war_romance.tsv 2> prediction/accuracy.tsv
