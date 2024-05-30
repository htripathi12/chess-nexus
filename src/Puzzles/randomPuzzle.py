import random

with open('src/Puzzles/lichess_top_100K_puzzles.pgn') as pgn_file:
    lines = pgn_file.readlines()

# Group the lines into puzzles
puzzles = [lines[i:i+12] for i in range(0, len(lines), 15)]

# Select a puzzle at random
random_puzzle_index = random.randint(0, len(puzzles) - 1)
random_puzzle = puzzles[random_puzzle_index]

# Initialize variables
ELO = None
fen = None
move_sequence = None

# Extract WhiteElo, FEN, and move sequence
for line_number, line in enumerate(random_puzzle, start=1):
    if "WhiteElo" in line:
        ELO = line.strip().split('"')[1]
        print(f"WhiteElo on line {random_puzzle_index * 15 + line_number}: {ELO}")
    elif "FEN" in line:
        fen = line.strip().split('"')[1]
        print(f"FEN on line {random_puzzle_index * 15 + line_number}: {fen}")
    elif line.strip().startswith('1.'):
        move_sequence = line.strip()
        print(f"Move sequence on line {random_puzzle_index * 15 + line_number}: {move_sequence}")

# Print the variables
print("WhiteElo:", ELO)
print("FEN:", fen)
print("Move sequence:", move_sequence)