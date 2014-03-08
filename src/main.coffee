
if window.getSelection || !document.selection then return

#Every browsing context has **a** selection
selection = null
window.getSelection = ->
	selection ?= new Selection

document.createRange = ->
	new Range

document.attachEvent 'onkeydown', ->
	#when a new character is entered set a new Range
	window.getSelection().setRangeAt(0, new Range(true))

document.attachEvent 'onselectionchange', ->
	#when selection changes set a new Range at index 0
	window.getSelection().setRangeAt(0, new Range(true))
