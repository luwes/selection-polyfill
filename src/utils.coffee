
_ =
	stripLineBreaks: (str) ->
		str.replace(/\r\n/g, '')

	getText: (el) ->
		el.innerText || el.nodeValue

	findNodeByPos: (parent, pos, end=0) ->
		obj = { length: 0, el: parent, offset: 0 }
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
		