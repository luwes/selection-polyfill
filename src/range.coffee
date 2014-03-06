
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
		result = @findNodeByPos(parent, temp.text.length, flag)
		@startContainer = result.el
		@startOffset = result.offset

		temp.setEndPoint('EndToEnd', @range)
		result = @findNodeByPos(parent, temp.text.length, 1)
		@endContainer = result.el
		@endOffset = result.offset

	findNodeByPos: (parent, pos, end=0) ->
		obj = { length: 0, el: 0, offset: 0 }
		do fn = (parent, pos, end, obj) ->
			for node in parent.childNodes
				if node.nodeType == 3
					if obj.length + node.nodeValue.length + end > pos
						obj.el = node
						obj.offset = pos - obj.length
						break
					obj.length += node.nodeValue.length
				else
					fn(node, pos, end, obj)
		return obj
