# Licensed under the MIT License
# https://github.com/craigahobbs/calc-script/blob/main/LICENSE


# Download javascript-build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
_WGET := $$(shell $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if which wget; then wget -q -c $(1); else curl -f -Os $(1); fi
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/Makefile.base))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/jsdoc.json))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/.eslintrc.cjs))


# Include javascript-build
include Makefile.base


ESLINT_ARGS := $(ESLINT_ARGS) bin/


clean:
	rm -rf Makefile.base jsdoc.json .eslintrc.cjs


# JavaScript to generate the library documentation
define LIBRARY_EXPR
import {expressionFunctionMap} from "./lib/library.js";
import {readFileSync} from 'node:fs';

// Load the script library documentation
const library = JSON.parse(readFileSync('build/doc/library/library.json'));
const libraryFunctionMap = Object.fromEntries(library.functions.map((func) => [func.name, func]));

// Output the expression library documentation
const libraryExpr = {'functions': []};
for (const [exprFnName, scriptFnName] of Object.entries(expressionFunctionMap)) {
    libraryExpr.functions.push({...libraryFunctionMap[scriptFnName], 'name': exprFnName});
}
console.log(JSON.stringify(libraryExpr, null, 4));
endef

export LIBRARY_EXPR


TITLE := The CalcScript Model

doc:
    # Copy statics underneath the package documentation
	mkdir -p build/doc/
	cp -R static/* build/doc/

    # Generate the library documentation
	$(NODE_DOCKER) node bin/calcScriptDoc.js lib/library.js > build/doc/library/library.json
	$(NODE_DOCKER) node --input-type=module -e "$$LIBRARY_EXPR" > build/doc/library-expr/library.json

    # Generate the runtime model documentation
	mkdir -p build/doc/model/
	$(NODE_DOCKER) node --input-type=module \
		-e 'import {calcScriptTypes} from "./lib/model.js"; console.log(JSON.stringify(calcScriptTypes))' \
		> build/doc/model/model.json
	(cd build/doc/model/ && $(call WGET_CMD, https://craigahobbs.github.io/schema-markdown-doc/static/index.html))
	sed -E 's/>Title</>$(TITLE)</; s/"Description"/"$(TITLE)"/; s/(schemaMarkdownDoc)\(.*\)/\1('\''model.json'\'', '\''$(TITLE)'\'')/' \
		build/doc/model/index.html > build/doc/model/index.html.tmp
	mv build/doc/model/index.html.tmp build/doc/model/index.html
