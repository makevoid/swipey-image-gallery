if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    var aArgs, fBound, fNOP, fToBind;

    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    aArgs = Array.prototype.slice.call(arguments, 1);
    fToBind = this;
    fNOP = function() {};
    fBound = function() {
      return fToBind.apply((this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array.prototype.slice.call(arguments)));
    };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
}

// https://github.com/ded/domready

!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
    , loaded = loadedRgx.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
})
var Gallery, PATH, SIZE, Window, defer, json, llog, removeElement,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

json = JSON.parse(ISSUES_JSON);

PATH = json.path;

SIZE = json.size;

llog = function(log) {
  var debug;
  debug = document.querySelector(".debug");
  return debug.innerHTML += "" + log + "<br>";
};

defer = function(fn) {
  return setTimeout(fn, 0);
};

removeElement = function(elem) {
  return elem.parentNode.removeChild(elem);
};

Gallery = (function() {
  Gallery.prototype.zoomed = false;

  Gallery.prototype.size = SIZE;

  function Gallery() {
    this.handle_mouseup = __bind(this.handle_mouseup, this);
    this.idx = 0;
    this.images = [];
    this.window = new Window(this);
  }

  Gallery.prototype.fill_window = function() {};

  Gallery.prototype.bind_swipe = function() {};

  Gallery.prototype.handle_zmove_start = function(evt) {
    var touch;
    touch = evt.touches[0];
    return this.start_zoom_touch = evt;
  };

  Gallery.prototype.handle_zmove_end = function(evt) {
    var end, start, x, y;
    end = evt.changedTouches[0];
    start = this.start_zoom_touch;
    x = end.pageX - start.pageX;
    y = end.pageY - start.pageY;
    return console.log("zoom end", x, y);
  };

  Gallery.prototype.handle_swipe = function() {
    return this.next();
  };

  Gallery.prototype.handle_keyboard = function(evt) {
    if (evt.keyCode === 37) {
      this.prev();
    }
    if (evt.keyCode === 39) {
      return this.next();
    }
  };

  Gallery.prototype.handle_thumbs_click = function(evt) {
    var id;
    id = evt.target.dataset.id;
    return this.go_to(parseInt(id));
  };

  Gallery.prototype.scale_factor = "2, 2, 2";

  Gallery.prototype.px = 0;

  Gallery.prototype.py = 0;

  Gallery.prototype.handle_zoom = function() {
    if (!this.zoomed) {
      this.zoom();
    } else {
      this.dezoom();
    }
    return this.zoomed = !this.zoomed;
  };

  Gallery.prototype.zoom = function() {
    var img;
    img = document.querySelector(".main img");
    img.style.webkitTransform = "scale3d(" + this.scale_factor + ")";
    return this.bind_movearound();
  };

  Gallery.prototype.dezoom = function() {
    var img;
    img = document.querySelector(".main img");
    img.style.webkitTransform = "scale3d(1, 1, 1)";
    this.unbind_movearound();
    this.px = 0;
    this.py = 0;
    return this.remove_all_listeners(img);
  };

  Gallery.prototype.handle_zdrag_start = function(evt) {
    return this.drag_start = {
      x: evt.pageX,
      y: evt.pageY
    };
  };

  Gallery.prototype.handle_zdrag_end = function(evt) {
    var dx, dy, px, py,
      _this = this;
    if (!this.drag_start) {
      return;
    }
    dx = evt.pageX - this.drag_start.x;
    dy = evt.pageY - this.drag_start.y;
    px = dx / innerWidth * 100;
    py = dy / innerHeight * 100;
    this.px = px + this.px;
    this.py = py + this.py;
    this.px = Math.min(25, Math.max(-25, this.px));
    this.py = Math.min(25, Math.max(-25, this.py));
    return defer(function() {
      return evt.target.style.webkitTransform = "scale3d(" + _this.scale_factor + ") translate3d(" + _this.px + "%, " + _this.py + "%, 0)";
    });
  };

  Gallery.prototype.handle_mouseup = function(event) {
    return this.handle_zdrag_end(event);
  };

  Gallery.prototype.unbind_movearound = function() {
    return document.removeEventListener("mouseup", this.handle_mouseup);
  };

  Gallery.prototype.bind_movearound = function() {
    var img,
      _this = this;
    img = document.querySelector(".main img");
    img.addEventListener("mousedown", this.handle_zdrag_start.bind(this));
    document.addEventListener("mouseup", this.handle_mouseup);
    img.addEventListener("dragstart", function(event) {
      return event.preventDefault();
    });
    img.addEventListener("touchstart", function(event) {
      return _this.handle_zdrag_start(event.touches[0]);
    });
    return img.addEventListener("touchend", function(event) {
      return _this.handle_zdrag_end(event.changedTouches[0]);
    });
  };

  Gallery.prototype.next = function() {
    return this.go_to(this.idx + 1);
  };

  Gallery.prototype.prev = function() {
    return this.go_to(this.idx - 1);
  };

  Gallery.prototype.go_to = function(idx) {
    var direction, img;
    if (this.idx === idx) {
      return;
    }
    if (idx < 0) {
      return;
    }
    if (idx > this.size) {
      return;
    }
    if (this.zoomed) {
      img = document.querySelector(".main img");
      this.remove_all_listeners(img);
    }
    this.zoomed = false;
    this.px = 0;
    this.py = 0;
    direction = "forward";
    if (this.nearby(idx)) {
      this.window.push_and_slide(idx);
    } else {
      this.window.replace_window(idx);
    }
    return this.idx = idx;
  };

  Gallery.prototype.nearby = function(idx) {
    return idx === this.idx - 1 || idx === this.idx + 1;
  };

  Gallery.prototype.remove_all_listeners = function(elem) {
    var copy;
    copy = elem.cloneNode();
    elem.parentElement.appendChild(copy);
    copy.style.opacity = 1;
    return removeElement(elem);
  };

  return Gallery;

})();

Window = (function() {
  Window.prototype.images_dir = PATH;

  function Window(gallery) {
    this.gallery = gallery;
  }

  Window.prototype.replace_window = function(idx) {
    var images, img, _i, _len;
    images = document.querySelectorAll(".main img");
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      img = images[_i];
      removeElement(img);
    }
    img = document.createElement("img");
    img.draggable = true;
    img.dataset.id = idx;
    img.src = "/" + this.images_dir + "/" + (this.pad(idx + 1)) + ".jpg";
    this.gallery_elem().appendChild(img);
    img.style.opacity = 1;
    return img.style.webkitTransform = "translate3d(0, 0, 0)";
  };

  Window.prototype.push_and_slide = function(idx) {
    return this.push_image(idx);
  };

  Window.prototype.push_image = function(idx) {
    var direction, img;
    direction = this.direction(idx);
    img = document.createElement("img");
    img.draggable = true;
    img.dataset.id = idx;
    img.src = "/" + this.images_dir + "/" + (this.pad(idx + 1)) + ".jpg";
    this.gallery_elem().appendChild(img);
    img.style.opacity = 1;
    if (direction === "next") {
      img.style.webkitTransform = "translate3d(100%, 0, 0)";
    } else {
      img.style.webkitTransform = "translate3d(-100%, 0, 0)";
    }
    return this.slide(direction, idx);
  };

  Window.prototype.deferred_slide = function(idx, percent) {
    return defer(function() {
      var img;
      img = document.querySelector(".main img[data-id='" + idx + "']");
      return img.style.webkitTransform = "translate3d(" + percent + "%, 0, 0)";
    });
  };

  Window.prototype.slide = function(direction, idx) {
    var next_id, position;
    next_id = direction === "next" ? idx - 1 : idx + 1;
    position = direction === "next" ? -100 : 100;
    this.deferred_slide(next_id, position);
    this.deferred_slide(idx, 0);
    return this.remove_image(next_id, direction);
  };

  Window.prototype.remove_func = function(idx) {
    var img;
    img = document.querySelector(".main img[data-id='" + idx + "']");
    return removeElement(img);
  };

  Window.prototype.remove_image = function(idx) {
    var img,
      _this = this;
    img = document.querySelector(".main img");
    return img.addEventListener("webkitTransitionEnd", function() {
      return _this.remove_func(idx);
    });
  };

  Window.prototype.webkit_is_supported = function() {
    return true;
  };

  Window.prototype.delayed_remove = function(func) {
    var img,
      _this = this;
    if (this.webkit_is_supported()) {
      img = document.querySelector(".main img");
      return img.addEventListener("webkitTransitionEnd", function() {
        return func();
      });
    } else {
      return setTimeout(function() {
        return func();
      }, 700);
    }
  };

  Window.prototype.gallery_elem = function() {
    return document.querySelector(".main");
  };

  Window.prototype.direction = function(idx) {
    if (idx > this.gallery.idx) {
      return "next";
    } else {
      return "prev";
    }
  };

  Window.prototype.pad = function(num) {
    var s;
    s = "0" + num;
    return s.substr(s.length - 2);
  };

  return Window;

})();

domready(function() {
  var gallery, next, prev, thumb, thumb_width, thumbs, thumbs_cont, width, zoom, _i, _len;
  gallery = new Gallery();
  window.gallery = gallery;
  window.addEventListener("keydown", gallery.handle_keyboard.bind(gallery));
  thumbs = document.querySelectorAll(".thumbs img");
  for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
    thumb = thumbs[_i];
    thumb.addEventListener("click", gallery.handle_thumbs_click.bind(gallery));
  }
  thumb_width = 80;
  width = (thumb_width + 5) * gallery.size;
  thumbs_cont = document.querySelector(".thumbs");
  thumbs_cont.style.width = "" + width + "px";
  prev = document.querySelector(".main .prev");
  prev.addEventListener("click", gallery.prev.bind(gallery));
  next = document.querySelector(".main .next");
  next.addEventListener("click", gallery.next.bind(gallery));
  zoom = document.querySelector(".main .zoom");
  return zoom.addEventListener("click", gallery.handle_zoom.bind(gallery));
});