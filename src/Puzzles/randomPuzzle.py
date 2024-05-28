import random

# Read the entire file into a list of lines
with open('src/Puzzles/lichess_top_100K_puzzles.pgn') as pgn_file:
    lines = pgn_file.readlines()

# Group the lines into puzzles
puzzles = [lines[i:i+12] for i in range(0, len(lines), 15)]

# Select a puzzle at random
random_puzzle = random.choice(puzzles)

# Print the entire information of the random puzzle
print(''.join(random_puzzle))