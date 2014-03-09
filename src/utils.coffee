
_ =
	stripLineBreaks: (str) ->
		str.replace(/\r\n/g, '')

	getText: (el) ->
		el.innerText || el.nodeValue

	findLength: (how, r1, r2) ->
		temp = r1.duplicate()	
		switch how
			when 'StartToStart'
				temp.setEndPoint('EndToStart', r2)
			when 'StartToEnd'
				temp.setEndPoint('EndToEnd', r2)
		_.stripLineBreaks(temp.text).length

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

	findPosFromNode: (n) ->
		obj = { pos: 0 }
		parent = n.parentNode
		do fn = (parent, n, obj) ->
			for node in parent.childNodes when !obj.found
				if node == n
					obj.found = true
					break
				else if node.nodeType == 3
					obj.pos += node.length
				else if node.hasChildNodes()
					fn(node, n, obj)
		return obj.pos
