APP_NAME := swiss-content-generator
APP_DIR := $(shell pwd)

# Pick a high, uncommon port by default.
PORT ?= 38123
BIND_ADDR ?= 0.0.0.0

SYSTEMD_USER_DIR := $(HOME)/.config/systemd/user
ENV_DIR := $(HOME)/.config/$(APP_NAME)
ENV_FILE := $(ENV_DIR)/env
UNIT_NAME := $(APP_NAME).service
UNIT_FILE := $(SYSTEMD_USER_DIR)/$(UNIT_NAME)

.PHONY: build install-service restart status logs deploy

build:
	npm ci
	npm run build

install-service:
	mkdir -p "$(SYSTEMD_USER_DIR)" "$(ENV_DIR)"
	if [ ! -f "$(ENV_FILE)" ]; then \
		sed \
			-e 's|__PORT__|$(PORT)|g' \
			-e 's|__BIND_ADDR__|$(BIND_ADDR)|g' \
			deploy/env.example > "$(ENV_FILE)"; \
	fi
	sed \
		-e 's|__APP_DIR__|$(APP_DIR)|g' \
		deploy/systemd/$(UNIT_NAME).tmpl > "$(UNIT_FILE)"
	systemctl --user daemon-reload
	systemctl --user enable "$(UNIT_NAME)"

restart:
	systemctl --user restart "$(UNIT_NAME)"

status:
	systemctl --user status "$(UNIT_NAME)" --no-pager

logs:
	journalctl --user -u "$(UNIT_NAME)" -f

deploy: build install-service restart status
	@printf "\nDeployed. Set env in %s and restart if needed.\n" "$(ENV_FILE)"
	@printf "Listening on http://%s:%s\n" "$(BIND_ADDR)" "$(PORT)"
