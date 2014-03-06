

if window.getSelection || !document.selection then return

window.getSelection = ->
	new Selection

document.createRange = ->
	new Range
