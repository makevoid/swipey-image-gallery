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
    
  handle_thumbs_click: ->
    console.log "asd"
    
  next: ->
    this.go_to @idx+1

  prev: ->
    this.go_to @idx-1

  go_to: (idx) ->
    return if @idx == idx
    return if idx < 0
    return if idx > SIZE
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
    log "push"
    # gallery = document.querySelector ".main"
    # log gallery
    # frag = document.createDocumentFragment()
    # img = document.createElement "img"
    # img.src = "/issues/5/02.jpg"
    # img.dataset.id = 1
    # gallery.appendChild img
    

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

thumbs = document.querySelector ".thumbs"
thumbs.addEventListener "click", gallery.handle_thumbs_click.bind gallery
#