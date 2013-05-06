$("body").imagesLoaded ->
  image = $("img")

  resize_image image
  $(window).on "resize", ->
    resize_image image

  # console.log $(window).height()
  # console.log image.height()

resize_image = (image) ->
  base = get_base_image image
  prop = base.width / base.height

  if prop > 0 # horizontal
    width = Math.min base.width, $(window).width()
    margin = $(window).height()/2 - image.height()/2
    image.width width
    image.css paddingTop: margin
  else # vertical
    height = Math.min base.height, $(window).height()
    width = height * prop
    image.width width

get_base_image = (current) ->
  image = new Image()
  image.src = current.attr "src"
  image
