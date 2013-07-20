# confs

PATH = "issues/05"
SIZE  = 11

log = console.log

class Gallery
  constructor:  ->
    @idx = 0 # current index
    @images = []
    @window = new Window
    log "gallery! #{PATH}, #{SIZE}"
    log "images: ", @images
    this.load_images()
    this.fill_window()

  load_images: ->

  fill_window: ->

  #

  handle_keyboard: (evt) ->
    this.prev() if evt.keyCode == 37
    this.next() if evt.keyCode == 39

  next: ->
    this.go_to @idx+1

  prev: ->
    this.go_to @idx-1

  go_to: (idx) ->
    log "switch to ", idx
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

  nearby: (idx) ->
    idx == @idx-1 || idx == @idx+1

class Window
  push_image: ->

  remove_image: ->

  slide: ->

  #

  replace_window: ->


class Image
  constructor: (@images) ->
    log "img"


# main


gallery = new Gallery

window.addEventListener "keydown", gallery.handle_keyboard.bind gallery
#