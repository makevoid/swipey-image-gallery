guard 'sass', input: 'sass', output: 'css'
guard 'coffeescript', input: 'coffee', output: "js", bare: true

guard 'livereload' do
  watch(%r{css/.+.css})
  watch(%r{js/.+.js})
end

js_files = %w(bind_shim vendor/domready)
js_files << "app"

guard :concat, type: "js", files: js_files, input_dir: "js", output: "js/all"