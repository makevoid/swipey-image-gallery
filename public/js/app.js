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

  Gallery.prototype.handle_thumbs_click = function() {
    return console.log("asd");
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
    console.log("switch to ", idx + 1);
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
  function Window(gallery) {
    this.gallery = gallery;
  }

  Window.prototype.push_and_slide = function(idx) {
    this.push_image(idx);
    this.slide(idx);
    return this.remove_image();
  };

  Window.prototype.push_image = function(idx) {
    var gallery, img;

    console.log("push");
    gallery = document.querySelector(".main");
    img = document.createElement("img");
    img.draggable = true;
    img.dataset.id = idx;
    img.src = "/issues_linux/5/" + (this.pad(idx + 1)) + ".jpg";
    gallery.appendChild(img);
    img.style.opacity = 1;
    img.style.webkitTransform = "translate3d(100%, 0, 0)";
    return console.log(gallery);
  };

  Window.prototype.slide = function(idx) {
    defer(function() {
      var img;

      img = document.querySelector(".main img[data-id='" + (idx - 1) + "']");
      return img.style.webkitTransform = "translate3d(-100%, 0, 0)";
    });
    return defer(function() {
      var img;

      img = document.querySelector(".main img[data-id='" + idx + "']");
      return img.style.webkitTransform = "translate3d(0, 0, 0)";
    });
  };

  Window.prototype.remove_image = function() {};

  Window.prototype.replace_window = function(idx) {};

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
  var gallery, thumbs;

  gallery = new Gallery();
  window.addEventListener("keydown", gallery.handle_keyboard.bind(gallery));
  thumbs = document.querySelector(".thumbs");
  return thumbs.addEventListener("click", gallery.handle_thumbs_click.bind(gallery));
});
