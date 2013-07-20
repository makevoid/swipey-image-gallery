var Gallery, Image, PATH, SIZE, Window, gallery, log;

PATH = "issues/05";

SIZE = 11;

log = console.log;

Gallery = (function() {
  function Gallery() {
    this.idx = 0;
    this.images = [];
    this.window = new Window;
    log("gallery! " + PATH + ", " + SIZE);
    log("images: ", this.images);
    this.load_images();
    this.fill_window();
  }

  Gallery.prototype.load_images = function() {};

  Gallery.prototype.fill_window = function() {};

  Gallery.prototype.handle_keyboard = function(evt) {
    if (evt.keyCode === 37) {
      this.prev();
    }
    if (evt.keyCode === 39) {
      return this.next();
    }
  };

  Gallery.prototype.next = function() {
    return this.go_to(this.idx + 1);
  };

  Gallery.prototype.prev = function() {
    return this.go_to(this.idx - 1);
  };

  Gallery.prototype.go_to = function(idx) {
    var direction;

    log("switch to ", idx);
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

  Window.prototype.push_image = function() {};

  Window.prototype.remove_image = function() {};

  Window.prototype.slide = function() {};

  Window.prototype.replace_window = function() {};

  return Window;

})();

Image = (function() {
  function Image(images) {
    this.images = images;
    log("img");
  }

  return Image;

})();

gallery = new Gallery;

window.addEventListener("keydown", gallery.handle_keyboard.bind(gallery));
