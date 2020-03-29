all:
.SILENT:
PRECMD=echo "  $(@F)" ; mkdir -p $(@D) ;

run:all;http-server src -a 0.0.0.0 -p 8080 -c-1 

clean:;rm -f src/mini.js src/mini.js.map

all:src/mini.js
JSMINIFILES:=$(shell find src/js -name '*.js')
src/mini.js:$(JSMINIFILES);$(PRECMD) jspp -o$@ -m$@.map -psrc src/js
