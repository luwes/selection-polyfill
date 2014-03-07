
class Range
	@history: []

	constructor: (isSelection) ->
		if isSelection
			@range = document.selection.createRange()
		else
			@range = document.body.createTextRange()
			@collapse(true)

		@init()

	init: ->
		parent = @range.parentElement()
		@commonAncestorContainer = parent
		@collapsed = @compareBoundaryPoints('StartToEnd', @range) == 0

		temp = @range.duplicate()
		temp.moveToElementText(parent)

		# if range text length > 0 try to stay in start
		# element when the cursor is right on a boundary
		flag = if @range.text.length > 0 then 0 else 1

		temp.setEndPoint('EndToStart', @range)
		startToStart = @stripLineBreaks(temp.text)
		result = @findNodeByPos(parent, startToStart.length, flag)
		@startContainer = result.el
		@startOffset = result.offset

		temp.setEndPoint('EndToEnd', @range)
		startToEnd = @stripLineBreaks(temp.text)
		result = @findNodeByPos(parent, startToEnd.length, 1)
		@endContainer = result.el
		@endOffset = result.offset

	select: ->
		@range.select()

	stripLineBreaks: (str) ->
		str.replace(/\r\n/g, '')

	findNodeByPos: (parent, pos, end=0) ->
		obj = { length: 0, el: 0, offset: 0 }
		do fn = (parent, pos, end, obj) ->
			for node in parent.childNodes when !obj.found
				if node.nodeType == 3
					if obj.length + node.length + end > pos
						obj.found = true
						obj.el = node
						obj.offset = pos - obj.length
						break
					obj.length += node.length
				else
					fn(node, pos, end, obj)
		return obj

	getText: (el) ->
		el.innerText || el.nodeValue

	setStart: (node, offset) ->
		if @getText(node).length >= offset && offset >= 0
			temp = @range.duplicate()
			if node.nodeType == 3
				temp.moveToElementText(node.parentNode)
				temp.moveStart('character', offset)
			if @compareBoundaryPoints('StartToEnd', temp) == -1
				@range.setEndPoint('EndToStart', temp)
			@range.setEndPoint('StartToStart', temp)
			#if @collapsed then @collapse(false)
			#@init()

	setEnd: (node, offset) ->
		if @getText(node).length >= offset && offset >= 0
			temp = @range.duplicate()
			if node.nodeType == 3
				temp.moveToElementText(node.parentNode)
				temp.moveEnd('character', offset)
			@range.setEndPoint('EndToStart', temp)
			#@init()

	selectNodeContents: (node) ->
		@range.moveToElementText(node)

	collapse: (toStart) ->
		if toStart
			@range.setEndPoint('EndToStart', @range)
		else
			@range.setEndPoint('StartToEnd', @range)

	compareBoundaryPoints: (how, source) ->
		@range.compareEndPoints(how, source)

	toString: ->
		@range.text || ''
