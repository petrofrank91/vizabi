NPM_PATH = node_modules/.bin
CLEANCSS = $(NPM_PATH)/cleancss
UGLIFY = $(NPM_PATH)/uglifyjs
SMASH = $(NPM_PATH)/smash

all: clean gapminder.css gapminder.js gapminder.min.js

gapminder.css:
	cat src/**/*.css | $(CLEANCSS) -o $@

gapminder.js: $(shell $(SMASH) --list src/gapminder.js)
	$(SMASH) src/gapminder.js | $(UGLIFY) - -b -o $@

gapminder.min.js: gapminder.js
	$(UGLIFY) gapminder.js -m -c -o $@

income_mountain.js:
	$(SMASH) src/income_mountain/index.js | $(UGLIFY) - -b -o $@

clean:
	rm -f gapminder.js
	rm -f gapminder.min.js
	rm -f gapminder.css


all: clean vizabi.js vizabi.min.js

vizabi.js: $(shell smash --list src/vizabi.js)
	smash src/vizabi.js | uglifyjs - -b -o $@

vizabi.min.js: vizabi.js
	uglifyjs vizabi.js -m -c -o $@

clean:
	rm -f vizabi.js
	rm -f vizabi.min.js