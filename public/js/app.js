var Gallery, Image, PATH, SIZE, Window, defer, llog;

PATH = "issues/05";

SIZE = 11;

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
    this.window = new Window();
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
    console.log("switch to ", idx);
    direction = "forward";
    if (this.nearby(idx)) {
      this.window.push_image();
      this.window.slide();
      this.window.remove_image();
    } else {
      this.window.replace_window();
    }
    return this.idx = idx;
  };

  Gallery.prototype.nearby = function(idx) {
    return idx === this.idx - 1 || idx === this.idx + 1;
  };

  return Gallery;

})();

Window = (function() {
  function Window() {}

  Window.prototype.push_image = function() {
    var gallery, img;

    console.log("push");
    gallery = document.querySelector(".main");
    img = document.createElement("img");
    img.dataset.id = 1;
    img.draggable = true;
    img.src = "/issues_linux/5/02.jpg";
    gallery.appendChild(img);
    img.style.opacity = 1;
    img.style.webkitTransform = "translate3d(100%, 0, 0)";
    return console.log(gallery);
  };

  Window.prototype.slide = function() {
    defer(function() {
      var img;

      img = document.querySelector(".main img[data-id='0']");
      return img.style.webkitTransform = "translate3d(-100%, 0, 0)";
    });
    return defer(function() {
      var img;

      img = document.querySelector(".main img[data-id='1']");
      return img.style.webkitTransform = "translate3d(0, 0, 0)";
    });
  };

  Window.prototype.remove_image = function() {};

  Window.prototype.replace_window = function() {};

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
