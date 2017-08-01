(function(window, document) {var selection;

if (window.getSelection || !document.selection) {
  return;
}

selection = null;

window.getSelection = document.getSelection = function() {
  return selection != null ? selection : selection = new Selection;
};

document.createRange = function() {
  return new Range;
};

document.attachEvent('onkeydown', function() {
  return window.getSelection().setRangeAt(0, new Range(true));
});

document.attachEvent('onselectionchange', function() {
  var el, range;
  window.getSelection().setRangeAt(0, new Range(true));
  el = document.selection.createRange().parentElement();
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    range = window.getSelection().getRangeAt(0);
    el.selectionStart = range.selectionStart;
    return el.selectionEnd = range.selectionEnd;
  }
});

window.Range = (function() {
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
    startToStart = _.findLength('StartToStart', temp, this.range);
    result = _.findNodeByPos(parent, startToStart, flag);
    this.startContainer = result.el;
    this.startOffset = result.offset;
    startToEnd = _.findLength('StartToEnd', temp, this.range);
    result = _.findNodeByPos(parent, startToEnd, 1);
    this.endContainer = result.el;
    this.endOffset = result.offset;
    this.selectionStart = _.findLength('StartToStart', temp, this.range, true);
    return this.selectionEnd = _.findLength('StartToEnd', temp, this.range, true);
  };

  Range.prototype.select = function() {
    return this.range.select();
  };

  Range.prototype.setStart = function(node, offset) {
    var nodePos, temp;
    if (_.getText(node).length >= offset && offset >= 0) {
      temp = this.range.duplicate();
      if (node.nodeType === 3) {
        nodePos = _.findPosFromNode(node);
        temp.moveToElementText(node.parentNode);
        temp.moveStart('character', nodePos + offset);
      }
      if (this.range.compareEndPoints('StartToEnd', temp) === -1) {
        this.range.setEndPoint('EndToStart', temp);
      }
      return this.range.setEndPoint('StartToStart', temp);
    }
  };

  Range.prototype.setEnd = function(node, offset) {
    var nodePos, temp;
    if (_.getText(node).length >= offset && offset >= 0) {
      temp = this.range.duplicate();
      if (node.nodeType === 3) {
        nodePos = _.findPosFromNode(node);
        temp.moveToElementText(node.parentNode);
        temp.moveStart('character', nodePos + offset);
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

  Range.prototype.detach = function() {
    return delete this.range;
  };

  Range.prototype.getBoundingClientRect = function() {
    var obj, rect;
    rect = this.range.getBoundingClientRect();
    return obj = {
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      top: rect.top
    };
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

var _;

_ = {
  convertLineBreaks: function(str) {
    return str.replace(/\r\n/g, '\n');
  },
  stripLineBreaks: function(str) {
    return str.replace(/\r\n/g, '');
  },
  getText: function(el) {
    return el.innerText || el.nodeValue;
  },
  findLength: function(how, r1, r2, raw) {
    var temp;
    temp = r1.duplicate();
    switch (how) {
      case 'StartToStart':
        temp.setEndPoint('EndToStart', r2);
        break;
      case 'StartToEnd':
        temp.setEndPoint('EndToEnd', r2);
    }
    if (raw) {
      return _.convertLineBreaks(temp.text).length;
    } else {
      return _.stripLineBreaks(temp.text).length;
    }
  },
  findNodeByPos: function(parent, pos, end) {
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
  },
  findPosFromNode: function(n) {
    var fn, obj, parent;
    obj = {
      pos: 0
    };
    parent = n.parentNode;
    (fn = function(parent, n, obj) {
      var node, _i, _len, _ref, _results;
      _ref = parent.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (!obj.found) {
          if (node === n) {
            obj.found = true;
            break;
          } else if (node.nodeType === 3) {
            _results.push(obj.pos += node.length);
          } else if (node.hasChildNodes()) {
            _results.push(fn(node, n, obj));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    })(parent, n, obj);
    return obj.pos;
  }
};
})(window, document);
