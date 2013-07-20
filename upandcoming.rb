path = File.expand_path '../', __FILE__

require "#{path}/config/env.rb"

class Upandcoming < Sinatra::Base
  include Voidtools::Sinatra::ViewHelpers

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

  @@issues_dir = "issues"
  @@issues_dir = "issues_linux" if File.exist?("/home/makevoid")

  # confs

  ISSUE_NUM = 5 # defines the directory whre the issue images are

  #

  def issues_dir
    @@issues_dir
  end

  helpers do
    def photos
      all = Dir.glob("#{@@path}/public/#{@@issues_dir}/#{ISSUE_NUM}/*.jpg")
      all.sort_by do |img|
        File.basename(img).to_i
      end
    end
  end

  get "/" do
    haml :index
  end

  # get "/slides.json" do
  #   # TODO: staticize this
  #   photos.map do |photo|
  #     File.basename photo, ".jpg"
  #   end.to_json
  # end

end

# require_all "#{path}/routes"