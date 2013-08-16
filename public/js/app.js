var Gallery, PATH, SIZE, Window, defer, json, llog;

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

Gallery = (function() {
  Gallery.prototype.zoomed = false;

  Gallery.prototype.size = SIZE;

  function Gallery() {
    this.idx = 0;
    this.images = [];
    this.window = new Window(this);
    this.fill_window();
    this.bind_swipe();
  }

  Gallery.prototype.fill_window = function() {};

  Gallery.prototype.bind_swipe = function() {
    var img;

    img = document.querySelector(".main img[data-id='0']");
    return img.addEventListener("touchend", this.handle_swipe.bind(this));
  };

  Gallery.prototype.handle_swipe = function() {
    llog("swipe");
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
    return this.py = 0;
  };

  Gallery.prototype.bind_movearound = function() {
    var img,
      _this = this;

    img = document.querySelector(".main img");
    img.addEventListener("drag", this.movearound);
    img.addEventListener("dragend", function(evt) {
      var dx, dy, px, py;

      dx = evt.pageX - _this.drag_start.x;
      dy = evt.pageY - _this.drag_start.y;
      px = dx / innerWidth * 100;
      py = dy / innerHeight * 100;
      _this.px = px + _this.px;
      _this.py = py + _this.py;
      _this.px = Math.min(25, Math.max(-25, _this.px));
      _this.py = Math.min(25, Math.max(-25, _this.py));
      return evt.target.style.webkitTransform = "scale3d(" + _this.scale_factor + ") translate3d(" + _this.px + "%, " + _this.py + "%, 0)";
    });
    return img.addEventListener("dragstart", function(evt) {
      return _this.drag_start = {
        x: evt.pageX,
        y: evt.pageY
      };
    });
  };

  Gallery.prototype.unbind_movearound = function() {};

  Gallery.prototype.movearound = function(evt) {
    var x, y;

    x = evt.pageX;
    return y = evt.pageY;
  };

  Gallery.prototype.next = function() {
    return this.go_to(this.idx + 1);
  };

  Gallery.prototype.prev = function() {
    return this.go_to(this.idx - 1);
  };

  Gallery.prototype.go_to = function(idx) {
    var direction;

    if (this.idx === idx) {
      return;
    }
    if (idx < 0) {
      return;
    }
    if (idx > this.size) {
      return;
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
      img.remove();
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
    if (direction === "next") {
      this.gallery_elem().appendChild(img);
      img.style.opacity = 1;
      img.style.webkitTransform = "translate3d(100%, 0, 0)";
    } else {
      this.gallery_elem().insertBefore(img);
      img.style.opacity = 1;
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
    return img.remove();
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
  width = (thumb_width + 8) * gallery.size;
  thumbs_cont = document.querySelector(".thumbs");
  thumbs_cont.style.width = "" + width + "px";
  prev = document.querySelector(".main .prev");
  prev.addEventListener("click", gallery.prev.bind(gallery));
  next = document.querySelector(".main .next");
  next.addEventListener("click", gallery.next.bind(gallery));
  zoom = document.querySelector(".main .zoom");
  return zoom.addEventListener("click", gallery.handle_zoom.bind(gallery));
});
