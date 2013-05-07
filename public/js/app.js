var H, get_base_image, resize_image, resize_images;

H = Hammer;

$("img").css("transtionDuration", "1s");

$("body").imagesLoaded(function() {
  var Gallery, gallery;

  Gallery = (function() {
    function Gallery() {}

    Gallery.prototype.images = $("img");

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

    Gallery.prototype.resize = function() {
      return resize_image(this.images);
    };

    Gallery.prototype.init = function() {
      var _this = this;

      this.reposition_images();
      this.bind_gestures();
      this.show_images();
      return $("img").on("webkitTransitionEnd", function() {
        return _this.show_images();
      });
    };

    Gallery.prototype.next = function() {
      this.current().translateX(this.positions.left());
      this.image_right().translateX(0);
      this.image_left().translateX(this.positions.right());
      this.index += 1;
      return this.bind_gestures();
    };

    Gallery.prototype.prev = function() {
      this.current().translateX(this.positions.right());
      this.image_left().translateX(0);
      this.index -= 1;
      return this.bind_gestures();
    };

    Gallery.prototype.reposition_images = function() {
      this.images.translateX(this.positions.right());
      return this.current().translateX(0);
    };

    Gallery.prototype.bind_gestures = function() {
      var h_image, handle_drag, handle_drag_thrott, start_x,
        _this = this;

      _(this.images).map(function(img) {
        return $(img).off(["swipeleft", "swiperight"]);
      });
      start_x = 0;
      h_image = H(this.current().get(0, {
        swipe_velocity: 0.4,
        drag_block_vertical: true
      }));
      handle_drag = function(evt) {
        var x;

        x = evt.gesture.deltaX;
        return gallery.current().translateX(x);
      };
      handle_drag_thrott = _.throttle(handle_drag, 110);
      h_image.on("drag", function(evt) {
        return handle_drag(evt);
      });
      h_image.on("dragstart", function(evt) {
        return start_x = evt.gesture.center.pageX;
      });
      return h_image.on("dragend", function(evt) {
        var page_x, x;

        page_x = evt.gesture.center.pageX;
        x = start_x - page_x;
        if (x > 0) {
          return _this.next();
        } else {
          return _this.prev();
        }
      });
    };

    Gallery.prototype.show_images = function() {
      this.images.css({
        opacity: 0
      });
      this.current().css({
        opacity: 1
      });
      this.image_right().css({
        opacity: 1
      });
      return this.image_left().css({
        opacity: 1
      });
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
