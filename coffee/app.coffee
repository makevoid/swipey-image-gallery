# confs

# PATH = "issues/5"
PATH = "issues_linux/5"
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

  handle_thumbs_click: (evt) ->
    id = evt.target.dataset.id
    this.go_to parseInt(id)

  # actions

  next: ->
    this.go_to @idx+1

  prev: ->
    this.go_to @idx-1

  go_to: (idx) ->
    return if @idx == idx
    return if idx < 0
    return if idx > SIZE
    console.log "switch to", idx+1
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
  images_dir: PATH

  constructor: (@gallery) ->

  # replace

  replace_window: (idx) ->
    img = document.querySelector ".main img"
    img.remove()

    console.log "removed"

    img = document.createElement "img"
    img.draggable = true
    img.dataset.id = idx
    img.src = "/#{this.images_dir}/#{this.pad idx+1}.jpg"

    this.gallery_elem().appendChild img
    img.style.opacity = 1

    img.style.webkitTransform = "translate3d(0, 0, 0)"

  # push_and_slide

  push_and_slide: (idx) ->
    this.push_image idx

  push_image: (idx) ->
    direction = this.direction idx

    img = document.createElement "img"
    img.draggable = true
    img.dataset.id = idx
    img.src = "/#{this.images_dir}/#{this.pad idx+1}.jpg"

    if direction == "next"
      this.gallery_elem().appendChild img
      img.style.opacity = 1
      # place on the right
      img.style.webkitTransform = "translate3d(100%, 0, 0)"
    else
      this.gallery_elem().insertBefore img
      img.style.opacity = 1
      # place on the left
      img.style.webkitTransform = "translate3d(-100%, 0, 0)"

    this.slide direction, idx

  deferred_slide: (idx, percent) ->
    defer ->
      img = document.querySelector ".main img[data-id='#{idx}']"
      img.style.webkitTransform = "translate3d(#{percent}%, 0, 0)"

  slide: (direction, idx) ->

    if direction == "next"
      this.deferred_slide idx-1, -100
    else
      this.deferred_slide idx+1, 100

    this.deferred_slide idx, 0

    this.remove_image direction

  remove_image: (direction) ->
    idx = @gallery.idx

    # after slide event, instead of timeout
    setTimeout =>
      id = if direction == "next"
        idx
      else
        idx

      img = document.querySelector ".main img[data-id='#{id}']"
      img.remove()
      console.log "removed", idx

    , 700

  # private

  gallery_elem: ->
    document.querySelector ".main"

  direction: (idx) ->
    if idx > @gallery.idx then "next" else "prev"

  pad: (num) ->
    s = "0" + num
    s.substr s.length-2


class Image
  constructor: (@images) ->
    console.log "img"


# main


domready ->

  gallery = new Gallery()
  window.gallery = gallery

  window.addEventListener "keydown", gallery.handle_keyboard.bind gallery

  thumbs = document.querySelectorAll ".thumbs img"
  for thumb in thumbs
    thumb.addEventListener "click", gallery.handle_thumbs_click.bind gallery



#