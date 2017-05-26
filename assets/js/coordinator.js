$(document).ready(function(){
	puzzle = new Puzzle(8);
	render = new renderPuzzle(3);
	render.renderPuzzleFrame();
})

$('#rand_conf').on('click', function(){
	puzzle.initPuzzle();
	render.renderSlideValues(puzzle.init_state);
})

$('#load_conf').on('click', function(){
	var conf = $('#conf').val();
	conf = conf.split(',');

	for (var i in conf)
		conf[i] = parseInt(conf[i], 10);

	puzzle.initPuzzle(conf);
	render.renderSlideValues(puzzle.init_state);
})


$('#solve').on('click', function(){
	
	$('#log').html('Solving the puzzle<br>');

	res = A_star(puzzle.init_state, 10000);

	final_state = res[0];
	nodes_expanded = res[1];

	seq = getMovesSequence(final_state)

	$('#log').prepend('=========== Solution sequence ==================<br>');
	animate(0, seq);
})


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

function animate(i, seq)
{
	if (i >= seq.length)
	{
		$('#log').prepend('=========== Solution sequence ==================<br>');
		$('#log').prepend(seq.length.toString() + ' steps required to solve the problem.<br>');
		return
	}

	render.renderSlideValues(seq[i]);
	$('#log').prepend(seq[i].key + '<br>');

	setTimeout(
		animate, 1000, i+1, seq
	);
}