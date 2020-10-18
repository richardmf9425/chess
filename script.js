/* eslint-disable prettier/prettier */
let board = null;
const game = new Chess();
$('.checkWarn').hide();

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
	if (!depth) {
		const value = calcBoardEval(game.board(), color);
		return {
			value,
			bestMove: null
		};
	}

	const availableMoves = game.moves().sort((a, b) => a * Math.random() - 4 * b);
	let bestMove = null;
	// const moveValue = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

	// availableMoves.forEach(move => {
	// 	game.move(move);
	// 	const {value} = findBestMoveWithMiniMax(game, depth - 1, color, !maximizingPlayer);
	// });

	// if(maximizingPlayer) {
	// 	if(value > )
	// }
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
		// const bestMove = findBestMoveAhead('b');
		const depth = $('#treeDepth').val() || 3;
		const { bestMove } = findBestMoveWithMiniMax(game, Number(depth), 'b', true);
		makeMoveAndUpdateBoard(bestMove);
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

board = ChessBoard('board', settings);
