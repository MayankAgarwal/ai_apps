function State(goal_state, initial_state, parent_state)
{
	this.GOAL_STATE = goal_state;
	this.current_state = initial_state;
	this.key = this.current_state.toString();
	this.parent_state = parent_state;
	this.dim = parseInt(Math.sqrt(this.current_state.length + 1));

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
	};

	this.getNextStates = function() {

		next_states = [];

		var empty_block_idx = this.current_state.indexOf(0);

		if (empty_block_idx < 0)
			throw "Empty piece not found in puzzle";

		var row = parseInt(empty_block_idx/this.dim)
		var col = empty_block_idx % this.dim;

		var adj_idxs = getAdjacentIdxs(row, col, this.dim);

		for (var i in adj_idxs)
		{
			var temp_state = this.current_state.slice();

			var temp_val = temp_state[empty_block_idx];
			temp_state[empty_block_idx] = temp_state[adj_idxs[i]];
			temp_state[adj_idxs[i]] = temp_val;

			var state = new State(this.GOAL_STATE, temp_state, this);
			next_states.push(state);
		}

		return next_states;
	};

	var getAdjacentIdxs = function(row, col, dim) {
		res = []

		var adj = [ [-1, 0], [0, -1], [1, 0], [0, 1] ]

		for (var i in adj)
		{
			var row1 = row + adj[i][0];
			var col1 = col + adj[i][1];

			if (row1 >= 0 && row1 < dim && col1 >= 0 && col1 < dim )
			{
				var temp = row1 * dim + col1;
				res.push(temp);
			}
		}
		
		return res;
	};

	this.get_G_value = function() {
		
		if (typeof this.parent_state !== 'undefined')
			return this.parent_state.g_val + 1;

		return 0;
	};

	this.get_H_value = function() {

		var h_val = 0;

		for(var i=0; i < this.current_state.length; i++)
		{
			var curr_val = this.current_state[i]

			if (curr_val === 0)
				continue;

			var goal_idx = this.GOAL_STATE.indexOf(curr_val);

			var row1 = parseInt(i/this.dim);
			var col1 = i % this.dim;

			var row2 = parseInt(goal_idx/this.dim);
			var col2 = goal_idx % this.dim;

			h_val += Math.abs(row1 - row2) + Math.abs(col1 - col2)
		}

		return h_val;
	};

	this.g_val = this.get_G_value();
	this.h_val = this.get_H_value();
	this.f_val = this.g_val + this.h_val;
}

function A_star(initial_state, max_nodes)
{	
	var goal = undefined;
	fringe = new Heap('f_val');
	visited = []
	var nodes_expanded = 0;

	fringe.add(initial_state);

	while (fringe.heap_size > 0)
	{
		curr_node = fringe.get_min();
		nodes_expanded += 1;
		visited.push(curr_node.key)

		if (nodes_expanded%100 == 0)
			console.log(nodes_expanded);

		if (nodes_expanded > max_nodes)
			break;

		if (curr_node.isGoal())
		{
			goal = curr_node;
			break;
		}

		next_nodes = curr_node.getNextStates();

		for (var i in next_nodes)
		{
			if (visited.indexOf(next_nodes[i].key) < 0)
				fringe.add(next_nodes[i]);
		}
	}

	return [goal, nodes_expanded]
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
		// Using Fisher-Yates algo, generate a randomly shuffled order of the array
		
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
		goal_sequence = generateSequence(1, this.piece_count+1);
		goal_sequence.push(0);

		start_sequence = shuffle(goal_sequence.slice());
		this.init_state = new State(goal_sequence, start_sequence);
	};

}

function getMovesSequence(final_state)
{
	res = []

	while (typeof final_state !== 'undefined')
	{
		res.unshift(final_state);
		final_state = final_state.parent_state;
	}

	return res;
}

function test(i, seq)
{
	if (i >= seq.length)
		return

	r.renderSlideValues(seq[i]);
	setTimeout(
		test, 1000, i+1, seq
	);
}


$(document).ready(function(){
	p = new Puzzle(8);
	p.initPuzzle();

	r = new renderPuzzle(3);
	r.renderPuzzleFrame();
	r.renderSlideValues(p.init_state);

	res = A_star(p.init_state, 10000);
	goal = res[0];
	nodes_expanded = res[1];

	console.log(nodes_expanded);

	seq = getMovesSequence(goal);
	console.log(seq, seq.length);

	test(0, seq);
})