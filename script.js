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

	if (!move) return 'snapback';
	if (game.in_check()) {
		$('.checkWarn').show();
	}
	const moveCallback = () => {
		const nextMove = findBestMoveAhead('b');
		makeMoveAndUpdateBoard(nextMove);
	};
	window.setTimeout(moveCallback, 250);
};

const onSnapEnd = function() {
	board.position(game.fen());
};

const settings = {
	draggable: true,
	position: 'start',
	onDragStart,
	onDrop,
	onSnapEnd
};

board = ChessBoard('board', settings);
