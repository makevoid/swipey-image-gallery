# confs

PATH = "issues/05"
SIZE = 11

# utils

llog = (log) ->
  debug = document.querySelector ".debug"
  debug.innerHTML += "#{log}<br>"

defer = (fn) ->
  setTimeout fn, 0

class Gallery
  constructor:  ->
    @idx = 0 # current index
    @images = []
    @window = new Window()
    # console.log "gallery! #{PATH}, #{SIZE}"
    # console.log "images: ", @images
    this.fill_window()
    this.bind_swipe()

  # init

  fill_window: ->


  bind_swipe: ->
    img = document.querySelector ".main img[data-id='0']"
    img.addEventListener "touchend", this.handle_swipe.bind this


  # handlers

  handle_swipe: ->
    console.log "swipe"
    llog "swipe"
    this.next()

  handle_keyboard: (evt) ->
    this.prev() if evt.keyCode == 37
    this.next() if evt.keyCode == 39

  handle_thumbs_click: ->
    console.log "asd"

  # actions

  next: ->
    this.go_to @idx+1

  prev: ->
    this.go_to @idx-1

  go_to: (idx) ->
    return if @idx == idx
    return if idx < 0
    return if idx > SIZE
    console.log "switch to ", idx
    # sanitize idx

    direction = "forward"

    if this.nearby(idx)
      @window.push_image()
      @window.slide()
      @window.remove_image()
    else
      @window.replace_window()

    # async? (called inside window)
    @idx = idx

  # utils

  nearby: (idx) ->
    idx == @idx-1 || idx == @idx+1

class Window
  push_image: ->
    console.log "push"

    gallery = document.querySelector ".main"
    img = document.createElement "img"
    img.dataset.id = 1
    img.draggable = true
    img.src = "/issues_linux/5/02.jpg"
    gallery.appendChild img

    # place on the right
    img.style.opacity = 1
    img.style.webkitTransform = "translate3d(100%, 0, 0)"

    console.log gallery


  slide: ->

    defer ->
      img = document.querySelector ".main img[data-id='0']"
      img.style.webkitTransform = "translate3d(-100%, 0, 0)"

    defer ->
      img = document.querySelector ".main img[data-id='1']"
      img.style.webkitTransform = "translate3d(0, 0, 0)"

  remove_image: ->


  #

  replace_window: ->


class Image
  constructor: (@images) ->
    console.log "img"


# main


domready ->

  gallery = new Gallery()

  window.addEventListener "keydown", gallery.handle_keyboard.bind gallery

  thumbs = document.querySelector ".thumbs"
  thumbs.addEventListener "click", gallery.handle_thumbs_click.bind gallery



#