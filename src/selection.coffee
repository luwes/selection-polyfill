
class Selection
	constructor: ->
		@selection = document.selection
		@ranges = []
		@init()

	init: ->
		@rangeCount = @ranges.length
		@anchorNode = @ranges[0]?.startContainer
		@anchorOffset = @ranges[0]?.startOffset

	getRangeAt: (index) ->
		@ranges[index]

	setRangeAt: (index, r) ->
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
