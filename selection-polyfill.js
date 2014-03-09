(function(window, document) {var selection;

if (window.getSelection || !document.selection) {
  return;
}

selection = null;

window.getSelection = function() {
  return selection != null ? selection : selection = new Selection;
};

document.createRange = function() {
  return new Range;
};

document.attachEvent('onkeydown', function() {
  return window.getSelection().setRangeAt(0, new Range(true));
});

document.attachEvent('onselectionchange', function() {
  return window.getSelection().setRangeAt(0, new Range(true));
});

var Range;

Range = (function() {
  Range.END_TO_END = 'EndToEnd';

  Range.END_TO_START = 'EndToStart';

  Range.START_TO_END = 'StartToEnd';

  Range.START_TO_START = 'StartToStart';

  function Range(isSelection) {
    if (isSelection) {
      this.range = document.selection.createRange();
    } else {
      this.range = document.body.createTextRange();
      this.collapse(true);
    }
    this.init();
  }

  Range.prototype.init = function() {
    var flag, parent, result, startToEnd, startToStart, temp;
    parent = this.range.parentElement();
    this.commonAncestorContainer = parent;
    this.collapsed = this.compareBoundaryPoints('StartToEnd', this) === 0;
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
    return this.endOffset = result.offset;
  };

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
      el: parent,
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
      temp = this.range.duplicate();
      if (node.nodeType === 3) {
        temp.moveToElementText(node.parentNode);
        temp.moveStart('character', offset);
      }
      if (this.range.compareEndPoints('StartToEnd', temp) === -1) {
        this.range.setEndPoint('EndToStart', temp);
      }
      return this.range.setEndPoint('StartToStart', temp);
    }
  };

  Range.prototype.setEnd = function(node, offset) {
    var temp;
    if (this.getText(node).length >= offset && offset >= 0) {
      temp = this.range.duplicate();
      if (node.nodeType === 3) {
        temp.moveToElementText(node.parentNode);
        temp.moveStart('character', offset);
      }
      if (this.range.compareEndPoints('EndToStart', temp) === 1) {
        this.range.setEndPoint('StartToStart', temp);
      }
      return this.range.setEndPoint('EndToStart', temp);
    }
  };

  Range.prototype.selectNodeContents = function(node) {
    return this.range.moveToElementText(node);
  };

  Range.prototype.collapse = function(toStart) {
    if (toStart) {
      return this.range.setEndPoint('EndToStart', this.range);
    } else {
      return this.range.setEndPoint('StartToEnd', this.range);
    }
  };

  Range.prototype.compareBoundaryPoints = function(how, source) {
    return this.range.compareEndPoints(how, source.range);
  };

  Range.prototype.cloneRange = function() {
    var clone;
    clone = new Range;
    clone.range = this.range.duplicate();
    clone.init();
    return clone;
  };

  Range.prototype.toString = function() {
    return this.range.text || '';
  };

  return Range;

})();

var Selection;

Selection = (function() {
  function Selection() {
    this.selection = document.selection;
    this.ranges = [];
    this.init();
  }

  Selection.prototype.init = function() {
    var anchor, current, focus, _ref, _ref1;
    this.rangeCount = this.ranges.length;
    if (this.rangeCount) {
      current = this.ranges[0];
      if (this.prev == null) {
        this.prev = current;
      }
      if (current.compareBoundaryPoints(Range.END_TO_END, this.prev) === 0) {
        _ref = ['end', 'start'], anchor = _ref[0], focus = _ref[1];
      } else {
        _ref1 = ['start', 'end'], anchor = _ref1[0], focus = _ref1[1];
      }
      this.anchorNode = current["" + anchor + "Container"];
      this.anchorOffset = current["" + anchor + "Offset"];
      this.focusNode = current["" + focus + "Container"];
      this.focusOffset = current["" + focus + "Offset"];
      return this.isCollapsed = this.anchorNode === this.focusNode;
    }
  };

  Selection.prototype.getRangeAt = function(index) {
    return this.ranges[index];
  };

  Selection.prototype.setRangeAt = function(index, r) {
    this.prev = this.ranges[index];
    this.ranges[index] = r;
    return this.init();
  };

  Selection.prototype.removeAllRanges = function() {
    this.ranges = [];
    return this.init();
  };

  Selection.prototype.addRange = function(r) {
    var range, _i, _len, _ref, _results;
    this.ranges.push(r);
    this.init();
    _ref = this.ranges;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      range = _ref[_i];
      _results.push(range.select());
    }
    return _results;
  };

  Selection.prototype.deleteFromDocument = function() {
    return this.selection.clear();
  };

  Selection.prototype.toString = function() {
    return this.ranges[0].toString();
  };

  return Selection;

})();
})(window, document);