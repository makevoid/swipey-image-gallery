var Gallery, Image, PATH, SIZE, Window, defer, llog;

PATH = "issues/05";

SIZE = 11 - 1;

llog = function(log) {
  var debug;

  debug = document.querySelector(".debug");
  return debug.innerHTML += "" + log + "<br>";
};

defer = function(fn) {
  return setTimeout(fn, 0);
};

Gallery = (function() {
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
    console.log("swipe");
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
    if (idx > SIZE) {
      return;
    }
    console.log("switch to", idx + 1);
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
  Window.prototype.images_dir = "issues/5";

  function Window(gallery) {
    this.gallery = gallery;
  }

  Window.prototype.replace_window = function(idx) {
    var img;

    img = document.querySelector(".main img");
    img.remove();
    console.log("removed");
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
    if (direction === "next") {
      this.deferred_slide(idx - 1, -100);
    } else {
      this.deferred_slide(idx + 1, 100);
    }
    this.deferred_slide(idx, 0);
    return this.remove_image(direction);
  };

  Window.prototype.remove_image = function(direction) {
    var idx,
      _this = this;

    idx = this.gallery.idx;
    return setTimeout(function() {
      var id, img;

      id = direction === "next" ? idx : idx;
      img = document.querySelector(".main img[data-id='" + id + "']");
      img.remove();
      return console.log("removed", idx);
    }, 700);
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

Image = (function() {
  function Image(images) {
    this.images = images;
    console.log("img");
  }

  return Image;

})();

domready(function() {
  var gallery, thumb, thumbs, _i, _len, _results;

  gallery = new Gallery();
  window.gallery = gallery;
  window.addEventListener("keydown", gallery.handle_keyboard.bind(gallery));
  thumbs = document.querySelectorAll(".thumbs img");
  _results = [];
  for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
    thumb = thumbs[_i];
    _results.push(thumb.addEventListener("click", gallery.handle_thumbs_click.bind(gallery)));
  }
  return _results;
});
