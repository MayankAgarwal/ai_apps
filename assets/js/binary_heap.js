function Heap(compare_key)
{
	this.heap_size = 0;
	this.CMPKEY = compare_key;
	this.heap = [];
	this.keys = {};

	this.min_heapify = function(idx) {
		var left = 2*idx + 1;
		var right = 2*idx + 2;
		var smallest = idx;

		if (left < this.heap_size && this.heap[left][this.CMPKEY] < this.heap[smallest][this.CMPKEY])
			smallest = left;
		if (right < this.heap_size && this.heap[right][this.CMPKEY] < this.heap[smallest][this.CMPKEY])
			smallest = right;

		if (smallest == idx)
			return

		var temp = this.heap[idx];
		this.heap[idx] = this.heap[smallest];
		this.heap[smallest] = temp;

		this.min_heapify(smallest);
	}

	this.add = function(data){

		this.heap.push(data);
		this.heap_size += 1;
		this.heapify_up(this.heap_size-1);
	}

	this.heapify_up = function(idx) {
		var parent = Math.floor((idx-1)/2.0);

		if (parent < 0 || parent >= self.heap_size)
			return

		if (this.heap[idx][this.CMPKEY] < this.heap[parent][this.CMPKEY])
		{
			var temp = this.heap[idx];
			this.heap[idx] = this.heap[parent];
			this.heap[parent] = temp;
			this.heapify_up(parent);
		}
	}

	this.get_min = function() {
		
		var result = this.heap[0];
		var last_elem = this.heap.pop(this.heap_size - 1);

		this.heap[0] = last_elem;
		this.heap_size -= 1;
		this.min_heapify(0);
		return result;
	}
}