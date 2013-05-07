$("body").imagesLoaded ->
  image = $("img")

  resize_image image
  $(window).on "resize", ->
    resize_image image

  img = image.on "touchmove", (evt) ->
    console.log evt
    $("body").css "background", "darkBlue"


  # console.log $(window).height()
  # console.log image.height()


$.fn.transform = (values) ->
  this.css "transform",         values
  this.css "-ms-transform",     values
  this.css "-webkit-transform", values

$.fn.translate = (left, top) ->
  # image.css left: left, top: top # fallback
  this.transform "translate(#{left}px, #{top}px)"

resize_image = (image) ->
  base = get_base_image image
  prop = base.width / base.height

  if prop > 0 # horizontal
    width = Math.min base.width, $(window).width()
    image.width width
  else # vertical
    height = Math.min base.height, $(window).height()
    width = height * prop
    image.width width

  top   = $(window).height()/2 - image.height()/2
  left  = $(window).width()/2 - image.width()/2
  image.translate left, top

get_base_image = (current) ->
  image = new Image()
  image.src = current.attr "src"
  image
