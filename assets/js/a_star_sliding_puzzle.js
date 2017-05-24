function State(goal_state, initial_state, parent)
{
	this.GOAL_STATE = goal_state;
	this.current_state = initial_state;
	this.parent = parent;

	// Check if the current state is the goal state
	this.isGoal = function(){
		var len1 = this.current_state.length;
		var len2 = this.GOAL_STATE.length;

		if (len1 !== len2)
			return false;

		for (var i=0; i<len1; i++)
			if (this.GOAL_STATE[i] !== this.current_state[i])
				return false;

		return true;
	}

	this.getNextStates = function() {

		next_states = [];

		var dim = parseInt(Math.sqrt(this.current_state.length + 1));
		var empty_block_idx = this.current_state.indexOf(0);

		if (empty_block_idx < 0)
			throw "Empty piece not found in puzzle";

		var row = parseInt(empty_block_idx/dim)
		var col = empty_block_idx % dim;

		var adj_idxs = getAdjacentIdxs(row, col, dim);

		for (var adj_idx in adj_idxs)
		{
			var temp_state = this.current_state.slice();
			var temp_val = temp_state[empty_block_idx];
			
			temp_state[empty_block_idx] = temp_state[adj_idx];
			temp_state[adj_idx] = temp_val;

			var state = new State(this.GOAL_STATE, temp_state, this);
			next_states.push(state);
		}

		return next_states;
	}

	var getAdjacentIdxs = function(row, col, dim) {
		res = []

		var adj = [ [-1, -1], [-1, 1], [1, -1], [1, 1] ]

		for (var a in adj)
		{
			var row1 = row + a[0];
			var col1 = col + a[1];

			if (row1 >= 0 && row1 < dim && col1 >= 0 && col1 < dim )
			{
				var temp = row1 * 4 + col1;
				res.push(temp);
			}
		}
		
		return res;
	}
}

function Puzzle(count)
{

	this.MAX_PIECES = 100;
	this.piece_count = count;

	// Validate if the required configuration is valid or not
	this.validate = function() {
		// https://stackoverflow.com/a/30919168
		return this.piece_count > 0 && this.piece_count < this.MAX_PIECES && Math.sqrt(this.piece_count + 1)%1 === 0;
	}

	if (!this.validate())
		throw "Invalid configuration";


	var generateSequence = function(low, high) {
		result = [];
		for (var i=low; i<high; i++)
			result.push(i);
		return result;
	};

	var shuffle = function(arr) {
		// Using Fisher-Yates algo, generate a random shuffling of the array
		
		for (var i=arr.length-1; i>=0; i--)
		{
			var rand_pos = Math.floor(Math.random() * i);
			var temp = arr[rand_pos];
			arr[rand_pos] = arr[i];
			arr[i] = temp;
		}

		return arr;
	};

	this.initPuzzle = function(){
		goal_sequence = generateSequence(0, this.piece_count+1);
		start_sequence = shuffle(seq);
		
	};

}

$(document).ready(function(){
	p = new Puzzle(15);
	p.initPuzzle();
})