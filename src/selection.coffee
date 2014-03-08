
class Selection
	constructor: ->
		@selection = document.selection
		@ranges = []
		@init()

	init: ->
		@rangeCount = @ranges.length
		if @rangeCount
			current = @ranges[0]
			@prev = current if !@prev?
			
			#assuming end == end, selection is going from right to left
			if (current.compareBoundaryPoints(Range.END_TO_END, @prev) == 0)
				[anchor, focus] = ['end', 'start']
			else
				[anchor, focus] = ['start', 'end']
				
			@anchorNode = current["#{anchor}Container"]
			@anchorOffset = current["#{anchor}Offset"]
			@focusNode = current["#{focus}Container"]
			@focusOffset = current["#{focus}Offset"]

	getRangeAt: (index) ->
		@ranges[index]

	setRangeAt: (index, r) ->
		@prev = @ranges[index]
		@ranges[index] = r
		@init()

	removeAllRanges: ->
		#@selection.empty()
		@ranges = []
		@init()

	addRange: (r) ->
		@ranges.push(r)
		@init()
		for range in @ranges
			range.select()
