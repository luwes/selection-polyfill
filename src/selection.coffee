
class Selection
	constructor: ->
		@rangeCount = 1
		@selection = document.selection
		@range = new Range(@selection)

	getRangeAt: ->
		@range

