import random

with open('src/Puzzles/formatted_pgn_output.txt') as txt_file:
    lines = txt_file.readlines()

# Group the lines into puzzles
puzzles = []
puzzle = {}
for line in lines:
    stripped_line = line.strip()
    if stripped_line:  # Check if line is not empty
        if stripped_line.startswith('FEN'):
            puzzle['FEN'] = stripped_line.split(':')[1].strip()
        elif stripped_line.startswith('WhiteElo'):
            puzzle['WhiteElo'] = stripped_line.split(':')[1].strip()
        elif stripped_line[0].isdigit():  # Check if the line starts with a number
            puzzle['Move sequence'] = stripped_line
            puzzles.append(puzzle)
            puzzle = {}

# Select a random puzzle
random_puzzle = random.choice(puzzles)

# Print the details of the random puzzle
print("FEN:", random_puzzle['FEN'])
print("WhiteElo:", random_puzzle['WhiteElo'])
print("Move sequence:", random_puzzle['Move sequence'])