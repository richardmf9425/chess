/* eslint-disable prettier/prettier */
let board = null;
const game = new Chess();
$('.checkWarn').hide();
let counter = 0;
// Random move example from chessboard.js documentation
function makeRandomMove() {
	const possibleMoves = game.moves();

	// game over
	if (!possibleMoves.length) {
		return;
	}

	const randomIdx = Math.floor(Math.random() * possibleMoves.length);
	game.move(possibleMoves[randomIdx]);
	board.position(game.fen());
}

const calcBoardEval = (board, color) => {
	const pieceValueLookup = {
		// Can change to a better system, this is the most common one
		p: 1,
		n: 3,
		b: 5,
		r: 5,
		q: 9,
		k: 100
	};

	let boardTotalValue = 0;
	board.forEach(function(row) {
		row.forEach(function(piece) {
			if (piece) {
				const addOrSubtract = piece.color === color ? 1 : -1;
				boardTotalValue += pieceValueLookup[piece.type] * addOrSubtract;
			}
		});
	});

	return boardTotalValue;
};

// From chessprogramming.org
const whitePawnEvalInBoard = [
	[ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	[ 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0 ],
	[ 1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0 ],
	[ 0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5 ],
	[ 0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0 ],
	[ 0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5 ],
	[ 0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5 ],
	[ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ]
];
const blackPawnEvalInBoard = whitePawnEvalInBoard.slice().reverse();

const whiteBishopEvalInBoard = [
	[ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0 ],
	[ -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0 ],
	[ -1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0 ],
	[ -1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0 ],
	[ -1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0 ],
	[ -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0 ],
	[ -1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0 ],
	[ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0 ]
];
const blackBishopEvalInBoard = whiteBishopEvalInBoard.slice().reverse();

const knightEvalInBoard = [
	[ -5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0 ],
	[ -4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0 ],
	[ -3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0 ],
	[ -3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0 ],
	[ -3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0 ],
	[ -3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0 ],
	[ -4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0 ],
	[ -5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0 ]
];

const whiteRookEvalInBoard = [
	[ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
	[ 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5 ],
	[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5 ],
	[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5 ],
	[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5 ],
	[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5 ],
	[ -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5 ],
	[ 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0 ]
];
const blackRookEvalInBoard = whiteRookEvalInBoard.slice().reverse();

const queenEvalInBoard = [
	[ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0 ],
	[ -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0 ],
	[ -1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0 ],
	[ -0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5 ],
	[ 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5 ],
	[ -1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0 ],
	[ -1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0 ],
	[ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0 ]
];

const whiteKingEvalInBoard = [
	[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0 ],
	[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0 ],
	[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0 ],
	[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0 ],
	[ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0 ],
	[ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0 ],
	[ 2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0 ],
	[ 2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0 ]
];
const blackKingEvalInBoard = whiteKingEvalInBoard.slice().reverse();

const getPieceValueInBoard = (piece, x, y) => {
	if (piece.color === 'w') {
		switch (piece.type) {
			case 'p':
				return 10 + whitePawnEvalInBoard[y][x];
			case 'n':
				return 30 + knightEvalInBoard[y][x];
			case 'b':
				return 30 + whiteBishopEvalInBoard[y][x];
			case 'r':
				return 50 + whiteRookEvalInBoard[y][x];
			case 'q':
				return 90 + queenEvalInBoard[y][x];
			case 'k':
				return 900 + whiteKingEvalInBoard[y][x];
			default:
				break;
		}
	} else {
		switch (piece.type) {
			case 'p':
				return 10 + blackPawnEvalInBoard[y][x];
			case 'n':
				return 30 + knightEvalInBoard[y][x];
			case 'b':
				return 30 + blackBishopEvalInBoard[y][x];
			case 'r':
				return 50 + blackRookEvalInBoard[y][x];
			case 'q':
				return 90 + queenEvalInBoard[y][x];
			case 'k':
				return 900 + blackKingEvalInBoard[y][x];
			default:
				break;
		}
	}
};

const evaluatePieceAtPos = (piece, x, y) => {
	if (piece === null) return 0;
	const value = getPieceValueInBoard(piece, x, y);
	if (piece.color === 'w') {
		return value;
	}
	return -value;
};

const calcBetterBoardEval = (board) => {
	let boardTotalValue = 0;
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			boardTotalValue += evaluatePieceAtPos(board[i][j], i, j);
		}
	}
	return boardTotalValue;
};

// look one move ahead for all pieces and find the best one(will capture piece with highest value if possible)
const findBestMoveAhead = (color) => {
	const availableMoves = game.moves();

	availableMoves.sort((a, b) => a * Math.random() - 4 * b);

	if (game.game_over() || !availableMoves.length) {
		return;
	}

	let bestMoveAhead;
	let bestMove = Number.NEGATIVE_INFINITY;
	availableMoves.forEach(function(move) {
		game.move(move);
		counter++;
		const moveValue = calcBoardEval(game.board(), color);
		if (moveValue > bestMove) {
			bestMoveAhead = move;
			bestMove = moveValue;
		}
		game.undo();
	});

	return bestMoveAhead;
};

const findBestMoveWithMiniMax = (game, depth, color, maximizingPlayer) => {
	counter++;
	if (!depth) {
		const value = calcBoardEval(game.board(), color);
		return {
			value,
			bestMove: null
		};
	}

	const availableMoves = game.moves().sort((a, b) => a * Math.random() - 4 * b);
	let bestMove = null;
	if (maximizingPlayer) {
		let maxValue = Number.NEGATIVE_INFINITY;
		availableMoves.forEach((move) => {
			game.move(move);
			const { value } = findBestMoveWithMiniMax(game, depth - 1, color, false);
			if (value > maxValue) {
				maxValue = value;
				bestMove = move;
			}
			game.undo();
		});

		return {
			value: maxValue,
			bestMove: bestMove || availableMoves[0]
		};
	}

	let minValue = Number.POSITIVE_INFINITY;
	availableMoves.forEach((move) => {
		game.move(move);
		const { value } = findBestMoveWithMiniMax(game, depth - 1, color, true);
		if (value < minValue) {
			minValue = value;
			bestMove = move;
		}
		game.undo();
	});

	return {
		value: minValue,
		bestMove: bestMove || availableMoves[0]
	};
};

const findBestMoveWithMiniMaxAndABPruning = (
	game,
	depth,
	color,
	accountForPiecePosition = false,
	alphaVal = Number.NEGATIVE_INFINITY,
	betaVal = Number.POSITIVE_INFINITY,
	maximizingPlayer = true
) => {
	counter++;
	if (!depth) {
		const value = accountForPiecePosition ? -calcBetterBoardEval(game.board()) : calcBoardEval(game.board(), color);
		return {
			value,
			bestMove: null
		};
	}

	const availableMoves = game.moves().sort((a, b) => a * Math.random() - 4 * b);
	let bestMove = null;
	if (maximizingPlayer) {
		let maxValue = Number.NEGATIVE_INFINITY;
		for (const move of availableMoves) {
			game.move(move);
			const { value } = findBestMoveWithMiniMaxAndABPruning(
				game,
				depth - 1,
				color,
				accountForPiecePosition,
				alphaVal,
				betaVal,
				false
			);
			if (value > maxValue) {
				maxValue = value;
				bestMove = move;
			}
			alphaVal = Math.max(alphaVal, value);
			game.undo();
			if (betaVal <= alphaVal) {
				break;
			}
		}

		return {
			value: maxValue,
			bestMove: bestMove || availableMoves[0]
		};
	}

	let minValue = Number.POSITIVE_INFINITY;
	for (const move of availableMoves) {
		game.move(move);
		const { value } = findBestMoveWithMiniMaxAndABPruning(
			game,
			depth - 1,
			color,
			accountForPiecePosition,
			alphaVal,
			betaVal,
			true
		);
		if (value < minValue) {
			minValue = value;
			bestMove = move;
		}
		betaVal = Math.min(betaVal, value);
		game.undo();
		if (betaVal <= alphaVal) {
			break;
		}
	}

	return {
		value: minValue,
		bestMove: bestMove || availableMoves[0]
	};
};

const onDragStart = (source, piece, position, orientation) => {
	if (piece.search(/^b/) !== -1 || game.game_over()) {
		return false;
	}
};

const makeMoveAndUpdateBoard = (move) => {
	if (game.game_over()) {
		return;
	}
	game.move(move);
	board.position(game.fen());
	$('.checkWarn').hide();
};

const onDrop = (source, target) => {
	const move = game.move({
		from: source,
		to: target,
		promotion: 'q'
	});
	counter = 0;
	if (game.in_check() && !game.game_over()) {
		$('.checkWarn').show();
	}
	if (game.game_over()) {
		$('.checkWarn').html('Game Over You Win!').css({ backgroundColor: '#13f04e', color: 'white' }).show();
	} else {
		$('.checkWarn').hide();
	}

	if (!move) return 'snapback';
	const moveCallback = () => {
		const algorithmSelected = $('#algorithm').val();
		const depth = $('#treeDepth').val() || 3;
		let move;
		const startTime = new Date().getTime();

		switch (algorithmSelected) {
			case 'moveAhead':
				move = findBestMoveAhead('b');
				break;
			case 'minimax':
				move = findBestMoveWithMiniMax(game, Number(depth), 'b', true).bestMove;
				break;
			case 'minimaxPruning':
				move = findBestMoveWithMiniMaxAndABPruning(game, Number(depth), 'b').bestMove;
				break;
			case 'minimaxPruningAndPosition':
				move = findBestMoveWithMiniMaxAndABPruning(game, Number(depth), 'b', true).bestMove;
				break;
			default:
				move = findBestMoveWithMiniMax(game, Number(depth), 'b', true).bestMove;
				break;
		}

		makeMoveAndUpdateBoard(move);
		const endTime = new Date().getTime();

		$('#time').html(`${(endTime - startTime) / 1000} secs`);
		$('#counter').html(counter);
	};
	window.setTimeout(moveCallback, 250);
};

const onSnapEnd = () => {
	board.position(game.fen());
};

const onMoveEnd = () => {
	if (game.game_over()) {
		$('.checkWarn').html('Game Over You lost').css({ backgroundColor: '#ff0d0d', color: 'white' }).show();
	}
	if (game.in_check()) {
		$('.checkWarn').show();
	}
};
const settings = {
	draggable: true,
	position: 'start',
	onDragStart,
	onDrop,
	onSnapEnd,
	onMoveEnd
};

$('#treeDepth').on('input change', () => {
	const depth = $('#treeDepth').val();
	$('#depthValue').html(depth);
});
$('#algorithm').change(() => {
	if ($('#algorithm').val() !== 'moveAhead') {
		$('.depthRange').show();
	} else {
		$('.depthRange').hide();
	}
});

board = ChessBoard('board', settings);
