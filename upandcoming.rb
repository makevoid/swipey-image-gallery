path = File.expand_path '../', __FILE__

require "#{path}/config/env.rb"

class Upandcoming < Sinatra::Base
  include Voidtools::Sinatra::ViewHelpers

  # basic logging configs:
  #
  # set :logging, true
  # log = File.new "log/development.log", "a"
  # STDOUT.reopen log
  # STDERR.reopen log

  # partial :comment, { comment: "blah" }
  # partial :comment, comment

  def partial(name, value={})
    locals = if value.is_a? Hash
      value
    else
      hash = {}; hash[name] = value
      hash
    end
    haml "_#{name}".to_sym, locals: locals
  end

  @@path = PATH

  helpers do
    def photos
      all = Dir.glob("#{@@path}/public/issues/4/*.jpg")
      all.sort_by do |img|
        File.basename(img).to_i
      end
    end
  end

  get "/" do
    haml :index
  end

end

# require_all "#{path}/routes"