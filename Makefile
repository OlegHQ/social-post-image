APP_NAME := swiss-content-generator

.PHONY: build deploy restart stop status logs

build:
	bun install --frozen-lockfile
	node node_modules/next/dist/bin/next build

deploy: build
	smdctl run -f smdctl.yml

restart:
	smdctl restart $(APP_NAME)

stop:
	smdctl stop $(APP_NAME)

status:
	smdctl status $(APP_NAME)

logs:
	smdctl logs -f $(APP_NAME)
