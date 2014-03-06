
class Selection
	constructor: ->
		@selection = document.selection
		@ranges = [new Range(@selection)]
		@init()

	init: ->
		@rangeCount = @ranges.length
		@anchorNode = @range?.startContainer
		@anchorOffset = @range?.startOffset

	getRangeAt: (index) ->
		@ranges[index]

	removeAllRanges: ->
		@ranges = []
		@init()

	addRange: (r) ->
		@ranges.push(r)
		for range in @ranges
			range.select()
			