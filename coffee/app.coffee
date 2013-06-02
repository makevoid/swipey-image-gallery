# utils

is_touch_device = null

detect_touch_devices = ->
  document.querySelector("img").setAttribute('ongesturestart', 'return;')
  is_touch_device =
    !!document.querySelector("img").ongesturestart

detect_touch_devices()

H = Hammer


$("body").imagesLoaded ->

  $('img').on 'dragstart', (evt) ->
    evt.preventDefault()

  class Thumbs
    container: $ ".thumbs"
    images: $ ".thumbs img"
    imagez: ->
      $(".thumbs img")
    imgs: _(this.images)

    init: ->
      img_width = 80

      _(this.imagez()).each (img, idx) ->
        # img.style.left = idx*img_width+"px"

        # bind clicks
        img.addEventListener "click", =>
          gallery.go_to parseInt img.dataset.id

      width = (img_width+8) * this.imagez().length
      this.container.width width


  class Gallery
    images: $ ".main img"

    anim_time: 300 # ms

    positions:
      left:  -> -$(window).width()
      right: -> $(window).width()

    index: 0

    # very public

    go_to: (id) ->
      # animate
      return if id == this.index
      if id > this.index
        this.animate_forward()
        this.current().translateX this.image_left()
      else
        this.animate_backward()
        this.current().translateX this.image_right()

      this.cur_img().style.opacity = 0
      this.index = id
      this.cur_img().style.opacity = 1
      this.current().translateX 0
      this.bind_gestures()

    # ...

    current: ->
      $ this.images[this.index]
    cur_img: ->
      this.current().get 0
    image_right: ->
      $ this.images[this.index+1]
    image_left: ->
      $ this.images[this.index-1]
    image_left_left: ->
      $ this.images[this.index-2]

    resize: ->
      resize_image this.images
      #$(window).on "resize", =>
      #  resize_image this.images

    init: ->
      this.prepare_images()
      this.reposition_images()
      this.bind_gestures()
      this.show_images "right"
      this.images_hide()
      setTimeout this.images_show, 400

    # zIndex order

    images_hide: ->
      _(this.images).each (img, idx) ->
        img.style.opacity = 0

    images_show: =>
      _(this.images).each (img, idx) ->
        img.style.opacity = 1

    zindex_sort: ->
      _(this.images).each (img, idx) ->
        img.style.zIndex = idx+1

    zindex_sort_reverse: ->
      _(this.images).each (img, idx) =>
        img.style.zIndex = this.images.length-idx

    # animate

    animate_forward: ->
      this.zindex_sort()
      this.images.translateX this.positions.right()
      this.current().translateX this.positions.left()
      this.image_right().translateX 0

    animate_backward: ->
      this.zindex_sort_reverse()
      this.images.translateX this.positions.left()
      this.image_left().translateX 0
      this.current().translateX this.positions.right()

    next: ->
      this.animate_forward()
      this.index += 1
      this.bind_gestures()

    prev: ->
      this.animate_backward()
      this.index -= 1
      this.bind_gestures()

    reposition_images: ->
      this.images.translateX this.positions.right()
      this.current().translateX 0

    prepare_images: ->
      for img in this.images
        img.className = "fast"
      setTimeout =>
        for img in this.images
          img.className = null
      , 100

    # ui movements

    start_x: null

    move: (evt) =>
      this.cur_img().className = "fast"
      this.handle_drag evt
      evt.preventDefault()

    handle_drag: (evt) ->
      x = if evt.gesture
        evt.gesture.deltaX if evt.gesture
      else
        evt.changedTouches[0].pageX - @start_x

      this.current().translateX x

    move_start: (evt) =>
      @start_x = this.get_touch(evt).pageX

    move_end: (evt) =>
      this.cur_img().className = null
      # log this.current().get(0).dataset.id
      page_x = this.get_touch(evt).pageX
      x = @start_x - page_x
      x_delta = Math.abs x
      x_delta_min = 50
      id = this.current().data("id")

      console.log id
      if id <= 0 && x < 0 || id >= this.images.length-1  && x > 0
        this.current().translateX 0
        return
      else if x > 0 && x_delta > x_delta_min
        direction = "right"
        this.next()
      else if id > 0 && x_delta > x_delta_min # drag_right
        direction = "left"
        this.prev()
      else
        throw "move_end should not reach here"

      setTimeout =>
        this.show_images direction
      , this.anim_time


    # ui bindings

    unbind_gestures: ->
      _(this.images).each (img) ->
        h_img = H(img)
        h_img.off "drag", this.move
        h_img.off "dragstart", this.move_start
        h_img.off "dragend", this.move_end
        img.removeEventListener "touchstart", this.move_start
        img.removeEventListener "touchmove", this.move
        img.removeEventListener "touchend", this.move_end

    bind_gestures: ->
      this.unbind_gestures()

      this.cur_img().addEventListener "touchstart", this.move_start
      this.cur_img().addEventListener "touchmove", this.move
      this.cur_img().addEventListener "touchend", this.move_end

      # img.addEventListener "webkitTransitionEnd", =>
      #   console.log "transition end", direction

      return if is_touch_device # blocks execution

      h_image = H(this.cur_img(), swipe_velocity: 0.4, drag_block_vertical: true)

      h_image.on "drag", this.move
      h_image.on "dragstart", this.move_start
      h_image.on "dragend", this.move_end


    show_images: (direction) ->
      # TODO: set z indexes - direction == right (asc) direction == left (desc)
      $(this.images).css            opacity: 0
      this.current().css            opacity: 1
      if direction == "left"
        this.image_left().css       opacity: 1
        this.image_left_left().css  opacity: 1
        this.image_right().css      opacity: 1
      else
        this.image_right().css      opacity: 1
        this.image_left().css       opacity: 1


    # private

    get_touch: (evt) ->
      return evt.gesture.center     if evt.gesture
      return evt.changedTouches[0]  if evt.changedTouches
      return evt                    if evt.pageX
      throw "unable to get_touch"

  # main

  gallery = new Gallery()
  window.gallery = gallery
  gallery.init()

  thumbs = new Thumbs()
  window.thumbs = thumbs
  thumbs.init()

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

debug = (string) ->
  $(".debug").html string


log = (string) ->
  existing = $(".debug").html()
  existing = "#{existing}<br>" if existing
  $(".debug").html "#{existing}#{string}"
