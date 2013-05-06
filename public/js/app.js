(function() {
  var get_base_image, resize_image;

  $("body").imagesLoaded(function() {
    var image;

    image = $("img");
    resize_image(image);
    return $(window).on("resize", function() {
      return resize_image(image);
    });
  });

  resize_image = function(image) {
    var base, height, margin, prop, width;

    base = get_base_image(image);
    prop = base.width / base.height;
    if (prop > 0) {
      width = Math.min(base.width, $(window).width());
      margin = $(window).height() / 2 - image.height() / 2;
      image.width(width);
      return image.css({
        paddingTop: margin
      });
    } else {
      height = Math.min(base.height, $(window).height());
      width = height * prop;
      return image.width(width);
    }
  };

  get_base_image = function(current) {
    var image;

    image = new Image();
    image.src = current.attr("src");
    return image;
  };

}).call(this);
