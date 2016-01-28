if (Object.defineProperty && Object.getOwnPropertyDescriptor &&
     Object.getOwnPropertyDescriptor(Element.prototype, "textContent") &&
    !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get)
  (function() {
    var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
    Object.defineProperty(Element.prototype, "textContent",
      { // It won't work if you just drop in innerText.get
        // and innerText.set or the whole descriptor.
        get : function() {
          return innerText.get.call(this);
        },
        set : function(x) {
          if (x == null) {
            x = "";
          }
          return innerText.set.call(this, x);
        }
      }
    );
  })();

// Event listeners
!window.addEventListener && Element.prototype && (function (polyfill) {
	// window.addEventListener, document.addEventListener, <>.addEventListener
	// window.removeEventListener, document.removeEventListener, <>.removeEventListener

	function Event() { [polyfill] }

	Event.prototype.preventDefault = function () {
		this.nativeEvent.returnValue = false;
	};

	Event.prototype.stopPropagation = function () {
		this.nativeEvent.cancelBubble = true;
	};

	function addEventListener(type, listener, useCapture) {
		useCapture = !!useCapture;

		var cite = this;

		cite.__eventListener = cite.__eventListener || {};
		cite.__eventListener[type] = cite.__eventListener[type] || [[],[]];

		if (!cite.__eventListener[type][0].length && !cite.__eventListener[type][1].length) {
			cite.__eventListener['on' + type] = function (nativeEvent) {
				var newEvent = new Event, newNodeList = [], node = nativeEvent.srcElement || cite, property;

				for (property in nativeEvent) {
					newEvent[property] = nativeEvent[property];
				}

				newEvent.currentTarget =  cite;
				newEvent.pageX = nativeEvent.clientX + document.documentElement.scrollLeft;
				newEvent.pageY = nativeEvent.clientY + document.documentElement.scrollTop;
				newEvent.target = node;
				newEvent.timeStamp = +new Date;

				newEvent.nativeEvent = nativeEvent;

				while (node) {
					newNodeList.unshift(node);

					node = node.parentNode;
				}

				for (var a, i = 0; (a = newNodeList[i]); ++i) {
					if (a.__eventListener && a.__eventListener[type]) {
						for (var aa, ii = 0; (aa = a.__eventListener[type][0][ii]); ++ii) {
							aa.call(cite, newEvent);
						}
					}
				}

				newNodeList.reverse();

				for (var a, i = 0; (a = newNodeList[i]) && !nativeEvent.cancelBubble; ++i) {
					if (a.__eventListener && a.__eventListener[type]) {
						for (var aa, ii = 0; (aa = a.__eventListener[type][1][ii]) && !nativeEvent.cancelBubble; ++ii) {
							aa.call(cite, newEvent);
						}
					}
				}

				nativeEvent.cancelBubble = true;
			};

			cite.attachEvent('on' + type, cite.__eventListener['on' + type]);
		}

		cite.__eventListener[type][useCapture ? 0 : 1].push(listener);
	}

	function removeEventListener(type, listener, useCapture) {
		useCapture = !!useCapture;

		var cite = this, a;

		cite.__eventListener = cite.__eventListener || {};
		cite.__eventListener[type] = cite.__eventListener[type] || [[],[]];

		a = cite.__eventListener[type][useCapture ? 0 : 1];

		for (eventIndex = a.length - 1, eventLength = -1; eventIndex > eventLength; --eventIndex) {
			if (a[eventIndex] == listener) {
				a.splice(eventIndex, 1)[0][1];
			}
		}

		if (!cite.__eventListener[type][0].length && !cite.__eventListener[type][1].length) {
			cite.detachEvent('on' + type, cite.__eventListener['on' + type]);
		}
	}

	window.constructor.prototype.addEventListener = document.constructor.prototype.addEventListener = Element.prototype.addEventListener = addEventListener;
	window.constructor.prototype.removeEventListener = document.constructor.prototype.removeEventListener = Element.prototype.removeEventListener = removeEventListener;
})();
// getElementsbyClassName
(function() {
    if (!document.getElementsByClassName) {
        var indexOf = [].indexOf || function(prop) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === prop) return i;
            }
            return -1;
        };
        getElementsByClassName = function(className,context) {
            var elems = document.querySelectorAll ? context.querySelectorAll("." + className) : (function() {
                var all = context.getElementsByTagName("*"),
                    elements = [],
                    i = 0;
                for (; i < all.length; i++) {
                    if (all[i].className && (" " + all[i].className + " ").indexOf(" " + className + " ") > -1 && indexOf.call(elements,all[i]) === -1) elements.push(all[i]);
                }
                return elements;
            })();
            return elems;
        };
        document.getElementsByClassName = function(className) {
            return getElementsByClassName(className,document);
        };
        Element.prototype.getElementsByClassName = function(className) {
            return getElementsByClassName(className,this);
        };
    }
})();

