var H, debug, detect_touch_devices, get_base_image, is_touch_device, log, resize_image, resize_images,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

is_touch_device = null;

detect_touch_devices = function() {
  document.querySelector("img").setAttribute('ongesturestart', 'return;');
  return is_touch_device = !!document.querySelector("img").ongesturestart;
};

detect_touch_devices();

H = Hammer;

$("body").imagesLoaded(function() {
  var Gallery, Thumbs, gallery, thumbs;

  $('img').on('dragstart', function(evt) {
    return evt.preventDefault();
  });
  Thumbs = (function() {
    function Thumbs() {}

    Thumbs.prototype.container = $(".thumbs");

    Thumbs.prototype.images = $(".thumbs img");

    Thumbs.prototype.imagez = function() {
      return $(".thumbs img");
    };

    Thumbs.prototype.imgs = _(Thumbs.images);

    Thumbs.prototype.init = function() {
      var img_width, width;

      img_width = 80;
      _(this.imagez()).each(function(img, idx) {
        var _this = this;

        return img.addEventListener("click", function() {
          return gallery.go_to(parseInt(img.dataset.id));
        });
      });
      width = (img_width + 8) * this.imagez().length;
      return this.container.width(width);
    };

    return Thumbs;

  })();
  Gallery = (function() {
    function Gallery() {
      this.move_end = __bind(this.move_end, this);
      this.move_start = __bind(this.move_start, this);
      this.move = __bind(this.move, this);
      this.images_show = __bind(this.images_show, this);
    }

    Gallery.prototype.images = $(".main img");

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

    Gallery.prototype.go_to = function(id) {
      if (id === this.index) {
        return;
      }
      if (id > this.index) {
        this.animate_forward();
        this.current().translateX(this.image_left());
      } else {
        this.animate_backward();
        this.current().translateX(this.image_right());
      }
      this.cur_img().style.opacity = 0;
      this.index = id;
      this.cur_img().style.opacity = 1;
      this.current().translateX(0);
      return this.bind_gestures();
    };

    Gallery.prototype.current = function() {
      return $(this.images[this.index]);
    };

    Gallery.prototype.cur_img = function() {
      return this.current().get(0);
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
      this.show_images("right");
      this.images_hide();
      return setTimeout(this.images_show, 400);
    };

    Gallery.prototype.images_hide = function() {
      return _(this.images).each(function(img, idx) {
        return img.style.opacity = 0;
      });
    };

    Gallery.prototype.images_show = function() {
      return _(this.images).each(function(img, idx) {
        return img.style.opacity = 1;
      });
    };

    Gallery.prototype.zindex_sort = function() {
      return _(this.images).each(function(img, idx) {
        return img.style.zIndex = idx + 1;
      });
    };

    Gallery.prototype.zindex_sort_reverse = function() {
      var _this = this;

      return _(this.images).each(function(img, idx) {
        return img.style.zIndex = _this.images.length - idx;
      });
    };

    Gallery.prototype.animate_forward = function() {
      this.zindex_sort();
      this.images.translateX(this.positions.right());
      this.current().translateX(this.positions.left());
      return this.image_right().translateX(0);
    };

    Gallery.prototype.animate_backward = function() {
      this.zindex_sort_reverse();
      this.images.translateX(this.positions.left());
      this.image_left().translateX(0);
      return this.current().translateX(this.positions.right());
    };

    Gallery.prototype.next = function() {
      this.animate_forward();
      this.index += 1;
      return this.bind_gestures();
    };

    Gallery.prototype.prev = function() {
      this.animate_backward();
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

    Gallery.prototype.start_x = null;

    Gallery.prototype.move = function(evt) {
      this.cur_img().className = "fast";
      this.handle_drag(evt);
      return evt.preventDefault();
    };

    Gallery.prototype.handle_drag = function(evt) {
      var x;

      x = evt.gesture ? evt.gesture ? evt.gesture.deltaX : void 0 : evt.changedTouches[0].pageX - this.start_x;
      return this.current().translateX(x);
    };

    Gallery.prototype.move_start = function(evt) {
      return this.start_x = this.get_touch(evt).pageX;
    };

    Gallery.prototype.move_end = function(evt) {
      var direction, id, page_x, x, x_delta, x_delta_min,
        _this = this;

      this.cur_img().className = null;
      page_x = this.get_touch(evt).pageX;
      x = this.start_x - page_x;
      x_delta = Math.abs(x);
      x_delta_min = 50;
      id = this.current().data("id");
      console.log(id);
      if (id <= 0 && x < 0 || id >= this.images.length - 1 && x > 0) {
        this.current().translateX(0);
        return;
      } else if (x > 0 && x_delta > x_delta_min) {
        direction = "right";
        this.next();
      } else if (id > 0 && x_delta > x_delta_min) {
        direction = "left";
        this.prev();
      } else {
        throw "move_end should not reach here";
      }
      return setTimeout(function() {
        return _this.show_images(direction);
      }, this.anim_time);
    };

    Gallery.prototype.unbind_gestures = function() {
      return _(this.images).each(function(img) {
        var h_img;

        h_img = H(img);
        h_img.off("drag", this.move);
        h_img.off("dragstart", this.move_start);
        h_img.off("dragend", this.move_end);
        img.removeEventListener("touchstart", this.move_start);
        img.removeEventListener("touchmove", this.move);
        return img.removeEventListener("touchend", this.move_end);
      });
    };

    Gallery.prototype.bind_gestures = function() {
      var h_image;

      this.unbind_gestures();
      this.cur_img().addEventListener("touchstart", this.move_start);
      this.cur_img().addEventListener("touchmove", this.move);
      this.cur_img().addEventListener("touchend", this.move_end);
      if (is_touch_device) {
        return;
      }
      h_image = H(this.cur_img(), {
        swipe_velocity: 0.4,
        drag_block_vertical: true
      });
      h_image.on("drag", this.move);
      h_image.on("dragstart", this.move_start);
      return h_image.on("dragend", this.move_end);
    };

    Gallery.prototype.show_images = function(direction) {
      $(this.images).css({
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
        this.image_right().css({
          opacity: 1
        });
        return this.image_left().css({
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
      if (evt.pageX) {
        return evt;
      }
      throw "unable to get_touch";
    };

    return Gallery;

  })();
  gallery = new Gallery();
  window.gallery = gallery;
  gallery.init();
  thumbs = new Thumbs();
  window.thumbs = thumbs;
  return thumbs.init();
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
