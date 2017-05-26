function renderPuzzle(dim)
{
	this.dim = dim;
	this.div_width = 100.0/this.dim;

	this.getDivHTML = function(id)
	{
		width = this.div_width.toString();
		id = id.toString();

		var html = '<div class="square" style="width: ' + width + '%; padding-bottom: ' + width + '%">' +
					    '<div class="content">' + 
					        '<div class="table">' +
					            '<div class="table-cell" id="' + id + '">' +
					                
					            '</div>' +
					        '</div>' +
					    '</div>' +
					'</div>';

		return html;
	}

	this.renderPuzzleFrame = function(){

		$('#puzzle').html('');

		for (var i=0; i<this.dim; i++)
		{
			for (var j=0; j<this.dim; j++)
			{
				id = this.getDivID(i, j);
				html = this.getDivHTML(id);
				$('#puzzle').append(html);
			}
		}
	}

	this.getDivID = function(r, c)
	{
		return r.toString() + "-" + c.toString();
	}

	this.renderSlideValues = function(state) {

		var len = state.current_state.length;

		for (var i=0; i<len; i++)
		{
			row = Math.floor(i/this.dim);
			col = i%this.dim;
			id = this.getDivID(row, col);

			if (state.current_state[i] === 0)
			{
				$('#' + id).text('');
				$('#' + id).closest('.square').addClass('zero');
			}
			else
			{
				$('#' + id).text(state.current_state[i]);
				$('#' + id).closest('.square').removeClass('zero');
			}
		}
	}

}