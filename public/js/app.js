var H, debug, detect_touch_devices, get_base_image, is_touch_device, log, resize_image, resize_images;

is_touch_device = null;

detect_touch_devices = function() {
  document.querySelector("img").setAttribute('ongesturestart', 'return;');
  return is_touch_device = !!document.querySelector("img").ongesturestart;
};

detect_touch_devices();

H = Hammer;

$("body").imagesLoaded(function() {
  var Gallery, gallery;

  Gallery = (function() {
    function Gallery() {}

    Gallery.prototype.images = $("img");

    Gallery.prototype.anim_time = 300;

    Gallery.prototype.positions = {
      left: function() {
        return -$(window).width();
      },
      right: function() {
        return $(window).width();
      }
    };

    Gallery.prototype.index = 0;

    Gallery.prototype.current = function() {
      return $(this.images[this.index]);
    };

    Gallery.prototype.image_right = function() {
      return $(this.images[this.index + 1]);
    };

    Gallery.prototype.image_left = function() {
      return $(this.images[this.index - 1]);
    };

    Gallery.prototype.image_left_left = function() {
      return $(this.images[this.index - 2]);
    };

    Gallery.prototype.resize = function() {
      return resize_image(this.images);
    };

    Gallery.prototype.init = function() {
      this.prepare_images();
      this.reposition_images();
      this.bind_gestures();
      return this.show_images("right");
    };

    Gallery.prototype.next = function() {
      this.current().translateX(this.positions.left());
      this.image_right().translateX(0);
      this.image_left().translateX(this.positions.right());
      this.index += 1;
      return this.bind_gestures();
    };

    Gallery.prototype.prev = function() {
      this.image_right().translateX(this.positions.left());
      this.current().translateX(this.positions.right());
      this.index -= 1;
      return this.bind_gestures();
    };

    Gallery.prototype.reposition_images = function() {
      this.images.translateX(this.positions.right());
      return this.current().translateX(0);
    };

    Gallery.prototype.prepare_images = function() {
      var img, _i, _len, _ref,
        _this = this;

      _ref = this.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        img.className = "fast";
      }
      return setTimeout(function() {
        var _j, _len1, _ref1, _results;

        _ref1 = _this.images;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          img = _ref1[_j];
          _results.push(img.className = null);
        }
        return _results;
      }, 100);
    };

    Gallery.prototype.bind_gestures = function() {
      var direction, drag_start, h_image, handle_drag, handle_drag_thrott, img, move, move_end, removeListeners, start_x,
        _this = this;

      start_x = 0;
      direction = "right";
      handle_drag = function(evt) {
        var x;

        x = evt.gesture ? evt.gesture.deltaX : evt.changedTouches[0].pageX - start_x;
        return gallery.current().translateX(x);
      };
      move = function(evt) {
        img.className = "fast";
        handle_drag(evt);
        return evt.preventDefault();
      };
      drag_start = function(evt) {
        return start_x = evt.gesture.center.pageX;
      };
      move_end = function(evt) {
        var page_x, x;

        img.className = null;
        log(_this.current().get(0).dataset.id);
        page_x = _this.get_touch(evt).pageX;
        x = start_x - page_x;
        console.log("move end", _this.current().data("id"));
        if (x > 0 && _this.current().data("id") >= _this.images.length - 1) {
          _this.current().translateX(0);
        } else if (x > 0) {
          direction = "right";
          _this.next();
        } else if (_this.current().data("id") > 0) {
          direction = "left";
          _this.prev();
          removeListeners();
        } else {
          _this.current().translateX(0);
        }
        return setTimeout(function() {
          console.log("asd2");
          return _this.show_images(direction);
        }, _this.anim_time);
      };
      removeListeners = function() {
        return _(this.images).map(function(img) {
          var h_img;

          img.removeEventListener("touchend", move_end);
          h_img = H(img);
          h_img.off("drag", move);
          h_img.off("dragstart", drag_start);
          h_img.off("dragend", move_end);
          img.removeEventListener("touchstart", drag_start);
          img.removeEventListener("touchmove", move);
          return img.removeEventListener("touchend", move_end);
        });
      };
      console.log("asd");
      img = this.current().get(0);
      removeListeners();
      img.addEventListener("touchstart", function(evt) {
        return start_x = _this.get_touch(evt).pageX;
      });
      img.addEventListener("touchmove", move);
      img.addEventListener("touchend", move_end);
      if (is_touch_device) {
        return;
      }
      h_image = H(this.current().get(0, {
        swipe_velocity: 0.4,
        drag_block_vertical: true
      }));
      handle_drag_thrott = _.throttle(handle_drag, 110);
      h_image.on("drag", move);
      h_image.on("dragstart", drag_start);
      return h_image.on("dragend", move_end);
    };

    Gallery.prototype.show_images = function(direction) {
      console.log(direction);
      this.images.css({
        opacity: 0
      });
      this.current().css({
        opacity: 1
      });
      if (direction === "left") {
        this.image_left().css({
          opacity: 1
        });
        this.image_left_left().css({
          opacity: 1
        });
        return this.image_right().css({
          opacity: 1
        });
      } else {
        return this.image_right().css({
          opacity: 1
        });
      }
    };

    Gallery.prototype.get_touch = function(evt) {
      if (evt.gesture) {
        return evt.gesture.center;
      }
      if (evt.changedTouches) {
        return evt.changedTouches[0];
      }
      throw "unable to get_touch";
    };

    return Gallery;

  })();
  gallery = new Gallery();
  window.gallery = gallery;
  return gallery.init();
});

$.fn.transform = function(values) {
  this.css("transform", values);
  this.css("-ms-transform", values);
  return this.css("-webkit-transform", values);
};

$.fn.translate = function(left, top) {
  return this.transform("translate3d(" + left + "px, " + top + "px, 0)");
};

$.fn.translateX = function(left) {
  return this.transform("translateX(" + left + "px)");
};

resize_image = function(image) {
  var base, height, left, prop, top, width;

  base = get_base_image(image);
  prop = base.width / base.height;
  if (prop > 0) {
    width = Math.min(base.width, $(window).width());
    image.width(width);
  } else {
    height = Math.min(base.height, $(window).height());
    width = height * prop;
    image.width(width);
  }
  top = $(window).height() / 2 - image.height() / 2;
  left = $(window).width() / 2 - image.width() / 2;
  return image.translate(left, top);
};

resize_images = function(images) {
  var base, height, left, prop, top, width;

  base = get_base_image($(images[0]));
  prop = base.width / base.height;
  if (prop > 0) {
    width = Math.min(base.width, $(window).width());
    images.width(width);
  } else {
    height = Math.min(base.height, $(window).height());
    width = height * prop;
    images.width(width);
  }
  top = $(window).height() / 2 - images.height() / 2;
  left = $(window).width() / 2 - images.width() / 2;
  return images.translate(left, top);
};

get_base_image = function(current) {
  var image;

  image = new Image();
  image.src = current.attr("src");
  return image;
};

debug = function(string) {
  return $(".debug").html(string);
};

log = function(string) {
  var existing;

  existing = $(".debug").html();
  if (existing) {
    existing = "" + existing + "<br>";
  }
  return $(".debug").html("" + existing + string);
};
