
class window.Range
	@END_TO_END: 'EndToEnd'
	@END_TO_START: 'EndToStart'
	@START_TO_END: 'StartToEnd'
	@START_TO_START: 'StartToStart'

	constructor: (isSelection) ->
		if isSelection
			@range = document.selection.createRange()
		else
			@range = document.body.createTextRange()
			#Range(w3c) starts with both boundaries at start of document
			@collapse(true) 

		@init()

	init: ->
		parent = @range.parentElement()
		@commonAncestorContainer = parent
		@collapsed = @compareBoundaryPoints('StartToEnd', @) == 0

		temp = @range.duplicate()
		temp.moveToElementText(parent)

		# if range text length > 0 try to stay in start
		# element when the cursor is right on a boundary
		flag = if @range.text.length > 0 then 0 else 1

		temp.setEndPoint('EndToStart', @range)
		startToStart = _.stripLineBreaks(temp.text)
		result = _.findNodeByPos(parent, startToStart.length, flag)
		@startContainer = result.el
		@startOffset = result.offset

		temp.setEndPoint('EndToEnd', @range)
		startToEnd = _.stripLineBreaks(temp.text)
		result = _.findNodeByPos(parent, startToEnd.length, 1)
		@endContainer = result.el
		@endOffset = result.offset

	select: ->
		@range.select()

	setStart: (node, offset) ->
		if _.getText(node).length >= offset && offset >= 0
			if node.nodeType == 3
				temp = @range.duplicate()
				temp.moveToElementText(node.parentNode)
				temp.moveStart('character', offset)

			if @range.compareEndPoints('StartToEnd', temp) == -1
				@range.setEndPoint('EndToStart', temp)
			@range.setEndPoint('StartToStart', temp)

	setEnd: (node, offset) ->
		if _.getText(node).length >= offset && offset >= 0
			if node.nodeType == 3
				temp = @range.duplicate()
				temp.moveToElementText(node.parentNode)
				temp.moveStart('character', offset)

			if @range.compareEndPoints('EndToStart', temp) == 1
				@range.setEndPoint('StartToStart', temp)
			@range.setEndPoint('EndToStart', temp)

	selectNodeContents: (node) ->
		@range.moveToElementText(node)

	collapse: (toStart) ->
		if toStart
			@range.setEndPoint('EndToStart', @range)
		else
			@range.setEndPoint('StartToEnd', @range)

	compareBoundaryPoints: (how, source) ->
		@range.compareEndPoints(how, source.range)

	cloneRange: ->
		clone = new Range
		clone.range = @range.duplicate()
		clone.init()
		clone

	detach: ->
		delete @range

	getBoundingClientRect: ->
		rect = @range.getBoundingClientRect()
		obj =
			width: rect.right - rect.left
			height: rect.bottom - rect.top
			left: rect.left
			right: rect.right
			bottom: rect.bottom
			top: rect.top

	toString: ->
		@range.text || ''
