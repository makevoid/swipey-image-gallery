guard 'sass', input: 'sass', output: 'public/css'
guard 'coffeescript', input: 'coffee', output: "public/js"

guard 'livereload' do
  watch(%r{views/.+.(erb|haml|slim|md|markdown)})
  watch(%r{public/css/.+.css})
  watch(%r{public/js/.+.js})
end


guard :concat, type: "js", files: %w(vendor/underscore vendor/zepto vendor/jimagesloaded app), input_dir: "public/js", output: "public/js/all"
