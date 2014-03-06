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
    var flag, parent, result, startToEnd, startToStart, temp;
    this.selection = selection;
    this.range = this.selection.createRange();
    parent = this.range.parentElement();
    this.commonAncestorContainer = parent;
    temp = this.range.duplicate();
    temp.moveToElementText(parent);
    flag = this.range.text.length > 0 ? 0 : 1;
    temp.setEndPoint('EndToStart', this.range);
    startToStart = this.stripLineBreaks(temp.text);
    result = this.findNodeByPos(parent, startToStart.length, flag);
    this.startContainer = result.el;
    this.startOffset = result.offset;
    temp.setEndPoint('EndToEnd', this.range);
    startToEnd = this.stripLineBreaks(temp.text);
    result = this.findNodeByPos(parent, startToEnd.length, 1);
    this.endContainer = result.el;
    this.endOffset = result.offset;
  }

  Range.prototype.select = function() {
    return this.range.select();
  };

  Range.prototype.stripLineBreaks = function(str) {
    return str.replace(/\r\n/g, '');
  };

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
        if (!obj.found) {
          if (node.nodeType === 3) {
            if (obj.length + node.length + end > pos) {
              obj.found = true;
              obj.el = node;
              obj.offset = pos - obj.length;
              break;
            }
            _results.push(obj.length += node.length);
          } else {
            _results.push(fn(node, pos, end, obj));
          }
        }
      }
      return _results;
    })(parent, pos, end, obj);
    return obj;
  };

  Range.prototype.getText = function(el) {
    return el.innerText || el.nodeValue;
  };

  Range.prototype.setStart = function(node, offset) {
    var temp;
    if (this.getText(node).length >= offset && offset >= 0) {
      temp = document.body.createTextRange();
      temp.moveToElementText(node);
      temp.moveStart('character', offset);
      return this.range.setEndPoint('StartToStart', temp);
    }
  };

  Range.prototype.setEnd = function(node, offset) {
    var temp;
    if (this.getText(node).length >= offset && offset >= 0) {
      temp = document.body.createTextRange();
      temp.moveToElementText(node);
      temp.moveStart('character', offset);
      return this.range.setEndPoint('StartToStart', temp);
    }
  };

  return Range;

})();

var Selection;

Selection = (function() {
  function Selection() {
    this.selection = document.selection;
    this.ranges = [new Range(this.selection)];
    this.init();
  }

  Selection.prototype.init = function() {
    var _ref, _ref1;
    this.rangeCount = this.ranges.length;
    this.anchorNode = (_ref = this.range) != null ? _ref.startContainer : void 0;
    return this.anchorOffset = (_ref1 = this.range) != null ? _ref1.startOffset : void 0;
  };

  Selection.prototype.getRangeAt = function(index) {
    return this.ranges[index];
  };

  Selection.prototype.removeAllRanges = function() {
    this.ranges = [];
    return this.init();
  };

  Selection.prototype.addRange = function(r) {
    var range, _i, _len, _ref, _results;
    this.ranges.push(r);
    _ref = this.ranges;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      range = _ref[_i];
      _results.push(range.select());
    }
    return _results;
  };

  return Selection;

})();
})(window, document);