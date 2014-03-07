
if window.getSelection || !document.selection then return

#Every browsing context has **a** selection
selection = null
window.getSelection = ->
	selection ?= new Selection

document.createRange = ->
	new Range

document.attachEvent 'onselectionchange', ->
	window.getSelection().setRangeAt(0, new Range(true))
