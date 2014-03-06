
class Range
	constructor: (@selection) ->
		@range = @selection.createRange()

		parent = @range.parentElement()
		@commonAncestorContainer = parent

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
			temp = document.body.createTextRange()
			if node.nodeType == 3
				temp.moveToElementText(node.parentNode)
				temp.moveStart('character', offset)
			@range.setEndPoint('StartToStart', temp)

	setEnd: (node, offset) ->
		if @getText(node).length >= offset && offset >= 0
			temp = document.body.createTextRange()
			if node.nodeType == 3
				temp.moveToElementText(node.parentNode)
				temp.moveStart('character', offset)
			@range.setEndPoint('EndToStart', temp)
