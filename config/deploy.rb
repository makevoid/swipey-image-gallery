# configs

app_name = "upandcoming"


# deploy

require 'mina/bundler'
require 'mina/git'

set :domain,      'makevoid.com'
set :deploy_to,   "/www/#{app_name}"
set :repository,  "git://github.com/makevoid/#{app_name}"
set :branch,      'master'

set :shared_paths, ['log']

set :user, 'www-data'


task :environment do
  # load env here...
end

task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do

    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'

    to :launch do
      queue 'mkdir -p tmp'
      queue 'touch tmp/restart.txt'
    end
  end
end