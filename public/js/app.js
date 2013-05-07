(function() {
  var get_base_image, resize_image;

  $("body").imagesLoaded(function() {
    var image, img;

    image = $("img");
    resize_image(image);
    $(window).on("resize", function() {
      return resize_image(image);
    });
    return img = image.on("touchmove", function(evt) {
      console.log(evt);
      return $("body").css("background", "darkBlue");
    });
  });

  $.fn.transform = function(values) {
    this.css("transform", values);
    this.css("-ms-transform", values);
    return this.css("-webkit-transform", values);
  };

  $.fn.translate = function(left, top) {
    return this.transform("translate(" + left + "px, " + top + "px)");
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

  get_base_image = function(current) {
    var image;

    image = new Image();
    image.src = current.attr("src");
    return image;
  };

}).call(this);
