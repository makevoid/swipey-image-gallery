guard 'sass', input: 'sass', output: 'public/css'
guard 'coffeescript', input: 'coffee', output: "public/js", bare: true

guard 'livereload' do
  watch(%r{views/.+.(erb|haml|slim|md|markdown)})
  watch(%r{public/css/.+.css})
  watch(%r{public/js/.+.js})
end


# js_files = %w(vendor/hammer vendor/underscore vendor/zepto vendor/jimagesloaded)
# js_files << "old"

js_files = %w(bind_shim vendor/domready)
js_files << "app"

guard :concat, type: "js", files: js_files, input_dir: "public/js", output: "public/js/all"

