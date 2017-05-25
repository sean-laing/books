# books
This is a collection of script that extracts adjectives, and uses them to predicit the mood of a book. 

# How to run
./process_books.bash source_data/romance/* source_data/horror/* source_data/war/* source_data/fantasy/*

# How to add more moods
Add another folder with the mood label, and put plain text file in new folder

# Output
Probability of a book being in a mood label.

#Problems
Has issues with classifing horror vs. fantasy -- which on the surface makes sense.