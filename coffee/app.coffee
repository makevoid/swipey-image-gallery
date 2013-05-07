H = Hammer

$("img").css "transtionDuration", "1s"

$("body").imagesLoaded ->

  class Gallery
    images: $ "img"

    positions:
      left:  -> -$(window).width()
      right: -> $(window).width()

    index: 0

    current: ->
      $ this.images[this.index]
    image_right: ->
      $ this.images[this.index+1]
    image_left: ->
      $ this.images[this.index-1]

    resize: ->
      resize_image this.images
      #$(window).on "resize", =>
      #  resize_image this.images

    init: ->
      # this.resize()
      this.reposition_images()
      this.bind_gestures()
      this.show_images()

      $("img").on "webkitTransitionEnd", =>
        this.show_images()

    next: ->
      this.current().translateX this.positions.left()
      this.image_right().translateX 0
      this.image_left().translateX this.positions.right()
      this.index += 1
      this.bind_gestures()

    prev: ->
      this.current().translateX this.positions.right()
      this.image_left().translateX 0
      this.index -= 1
      this.bind_gestures()

    reposition_images: ->
      this.images.translateX this.positions.right()
      this.current().translateX 0

    bind_gestures: ->
      _(this.images).map (img) ->
        $(img).off(["swipeleft", "swiperight"])

      start_x = 0

      h_image = H(this.current().get 0, swipe_velocity: 0.4, drag_block_vertical: true)

      handle_drag = (evt) ->
        x = evt.gesture.deltaX
        gallery.current().translateX x

      handle_drag_thrott = _.throttle(handle_drag, 110)

      h_image.on "drag", (evt) =>
        handle_drag evt

      h_image.on "dragstart", (evt) =>
        start_x = evt.gesture.center.pageX

      h_image.on "dragend", (evt) =>
        page_x = evt.gesture.center.pageX
        x = start_x - page_x
        if x > 0 # drag_left
          this.next()
        else     # drag_right
          this.prev()

      # h_image.on "swipeleft", =>
      #   this.next()
      #   console.log "swipe left"

      # h_image.on "swiperight", =>
      #   this.prev()
      #   console.log "swipe right"

    show_images: ->
      this.images.css         opacity: 0
      this.current().css      opacity: 1
      this.image_right().css  opacity: 1
      this.image_left().css   opacity: 1

  # main

  gallery = new Gallery()
  window.gallery = gallery
  gallery.init()


$.fn.transform = (values) ->
  this.css "transform",         values
  this.css "-ms-transform",     values
  this.css "-webkit-transform", values

$.fn.translate = (left, top) ->
  # image.css left: left, top: top # fallback
  this.transform "translate3d(#{left}px, #{top}px, 0)"

$.fn.translateX = (left) ->
  # image.css left: left, top: top # fallback
  this.transform "translateX(#{left}px)"

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

resize_images = (images) ->
  base = get_base_image $(images[0])
  prop = base.width / base.height

  if prop > 0 # horizontal
    width = Math.min base.width, $(window).width()
    images.width width
  else # vertical
    height = Math.min base.height, $(window).height()
    width = height * prop
    images.width width

  top   = $(window).height()/2 - images.height()/2
  left  = $(window).width()/2 - images.width()/2
  images.translate left, top

get_base_image = (current) ->
  image = new Image()
  image.src = current.attr "src"
  image
