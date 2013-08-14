# confs

PATH = "issues/05"
SIZE = 11 -1 # as it's zero based

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
    @window = new Window(this)
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
    console.log "switch to ", idx+1
    # sanitize idx

    direction = "forward"

    if this.nearby(idx)
      @window.push_and_slide(idx)
    else
      @window.replace_window(idx)

    # async? (called inside window)
    @idx = idx

  # utils

  nearby: (idx) ->
    idx == @idx-1 || idx == @idx+1

class Window
  constructor: (@gallery) ->

  push_and_slide: (idx) ->
    this.push_image idx
    this.slide idx
    this.remove_image()

  push_image: (idx) ->
    console.log "push"

    gallery = document.querySelector ".main"
    img = document.createElement "img"
    img.draggable = true

    img.dataset.id = idx
    img.src = "/issues_linux/5/#{this.pad idx+1}.jpg"
    gallery.appendChild img
    # or prepend


    # place on the right
    img.style.opacity = 1
    img.style.webkitTransform = "translate3d(100%, 0, 0)"

    console.log gallery


  slide: (idx) ->

    defer ->
      img = document.querySelector ".main img[data-id='#{idx-1}']"
      img.style.webkitTransform = "translate3d(-100%, 0, 0)"

    defer ->
      img = document.querySelector ".main img[data-id='#{idx}']"
      img.style.webkitTransform = "translate3d(0, 0, 0)"

  remove_image: ->


  #

  replace_window: (idx) ->

  # private

  pad: (num) ->
    s = "0" + num
    s.substr s.length-2


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