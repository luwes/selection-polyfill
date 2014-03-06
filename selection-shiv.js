(function(window, document) {if (window.getSelection || !document.selection) {
  return;
}

window.getSelection = function() {
  return new Selection;
};

document.createRange = function() {
  return new Range;
};

var Range;

Range = (function() {
  function Range(selection) {
    var flag, parent, result, temp;
    this.selection = selection;
    this.range = this.selection.createRange();
    parent = this.range.parentElement();
    this.commonAncestorContainer = parent;
    temp = this.range.duplicate();
    temp.moveToElementText(parent);
    flag = this.range.text.length > 0 ? 0 : 1;
    temp.setEndPoint('EndToStart', this.range);
    result = this.findNodeByPos(parent, temp.text.length, flag);
    this.startContainer = result.el;
    this.startOffset = result.offset;
    temp.setEndPoint('EndToEnd', this.range);
    result = this.findNodeByPos(parent, temp.text.length, 1);
    this.endContainer = result.el;
    this.endOffset = result.offset;
  }

  Range.prototype.findNodeByPos = function(parent, pos, end) {
    var fn, obj;
    if (end == null) {
      end = 0;
    }
    obj = {
      length: 0,
      el: 0,
      offset: 0
    };
    (fn = function(parent, pos, end, obj) {
      var node, _i, _len, _ref, _results;
      _ref = parent.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.nodeType === 3) {
          if (obj.length + node.nodeValue.length + end > pos) {
            obj.el = node;
            obj.offset = pos - obj.length;
            break;
          }
          _results.push(obj.length += node.nodeValue.length);
        } else {
          _results.push(fn(node, pos, end, obj));
        }
      }
      return _results;
    })(parent, pos, end, obj);
    return obj;
  };

  return Range;

})();

var Selection;

Selection = (function() {
  function Selection() {
    this.rangeCount = 1;
    this.selection = document.selection;
    this.range = new Range(this.selection);
  }

  Selection.prototype.getRangeAt = function() {
    return this.range;
  };

  return Selection;

})();
})(window, document);