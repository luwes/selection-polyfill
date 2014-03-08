# Selection Polyfill

Text selection polyfill for IE8  
Implements the following (so far)

- window.getSelection()
- document.createRange()
- Selection (Class) ----
- selection.rangeCount
- selection.anchorNode
- selection.anchorOffset
- selection.focusNode
- selection.focusOffset
- selection.getRangeAt(index)
- selection.removeAllRanges()
- selection.addRange(range)
- selection.deleteFromDocument()
- Range (Class) ----
- range.commonAncestorContainer
- range.collapsed
- range.startContainer
- range.startOffset
- range.endContainer
- range.endOffset
- range.setStart(node, offset)
- range.setEnd(node, offset)
- range.selectNodeContents(node)
- range.collapse(toStart)
- range.compareBoundaryPoints(how, range)
- range.toString()

https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#selections
