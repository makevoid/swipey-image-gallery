# from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fbind#Compatibility

unless Function::bind
  Function::bind = (oThis) ->

    # closest thing possible to the ECMAScript 5 internal IsCallable function
    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")  if typeof this isnt "function"
    aArgs = Array::slice.call(arguments, 1)
    fToBind = this
    fNOP = ->

    fBound = ->
      fToBind.apply (if this instanceof fNOP and oThis then this else oThis), aArgs.concat(Array::slice.call(arguments))

    fNOP:: = @::
    fBound:: = new fNOP()
    fBound