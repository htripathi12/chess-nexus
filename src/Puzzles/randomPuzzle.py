import random

def load_and_select_puzzle(filename):
    with open(filename) as txt_file:
        lines = txt_file.readlines()

    # Group the lines into puzzles
    puzzles = []
    puzzle = {}

    for line in lines:
        if 'FEN:' in line:
            if puzzle:
                # Append the previous puzzle if there's one being built
                puzzles.append(puzzle)
                puzzle = {}
            puzzle['FEN'] = line.split(':')[1].strip()
        elif 'WhiteElo:' in line:
            puzzle['WhiteElo'] = line.split(':')[1].strip()
        elif line.startswith('Move Sequence:'):  # Assuming your format includes 'Move Sequence:'
            puzzle['Move Sequence'] = line.split(':', 1)[1].strip()

    # Append the last puzzle if it's not empty
    if puzzle:
        puzzles.append(puzzle)

    # Select a random puzzle
    random_puzzle = random.choice(puzzles)

    # Print the details of the random puzzle
    print("FEN:", random_puzzle['FEN'])
    print("WhiteElo:", random_puzzle['WhiteElo'])
    print("Move Sequence:", random_puzzle['Move Sequence'])

# Usage
filename = 'src/Puzzles/formatted_pgn_output.txt'
load_and_select_puzzle(filename)
