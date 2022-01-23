task :data do
  system 'bin/initdb.sh'
end

task :install do
  system 'npm install'
  system 'npm install -g lighthouse-ci'

  system 'bundle install'

  system 'mkdir -p build'
  system 'curl -s --location --output build/sql-wasm.js https://unpkg.com/sql.js@latest/dist/sql-wasm.js'
  system 'curl -s --location --output build/sql-wasm.wasm https://unpkg.com/sql.js@latest/dist/sql-wasm.wasm'
  system 'curl -s --location --output build/tabulator.min.css.map https://unpkg.com/tabulator-tables@latest/dist/css/tabulator.min.css.map'
end

task :lint do
  system 'npm run lint'
end

task :build do
  system 'npm run build'
  system 'jekyll build'
end

task :dev do
  system 'npm run dev & jekyll serve'
end

task lh: :build do
  system 'lhci autorun'
end

task :clean do
  system 'git clean -fxd -e /data'
end

task :realclean do
  system 'git clean -fxd'
end
