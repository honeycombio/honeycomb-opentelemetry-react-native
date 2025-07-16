
build:
	yarn install

lint-typescript:
	yarn eslint src/ example/index.js example/src

lint-android:
	cd example/android/ && ./gradlew spotlessCheck

lint-c:
	find ios/ \( -name '*.h' -o -name '*.c' -o -name '*.cc' -o -name '*.m' -o -name '*.mm' \) -not -path '*/generated/*' | xargs clang-format --Werror --dry-run

lint-swift:
	swift format lint --strict --recursive ios/ example/ios/HoneycombOpentelemetryReactNativeExample

lint: lint-typescript lint-android lint-swift lint-c

format-typescript:
	yarn eslint --fix src/ example/index.js example/src

format-android:
	cd example/android/ && ./gradlew spotlessApply

format-c:
	find ios/ \( -name '*.h' -o -name '*.c' -o -name '*.cc' -o -name '*.m' -o -name '*.mm' \) -not -path '*/generated/*' | xargs clang-format -i

format-swift:
	swift format format --in-place --recursive ios/ example/ios/HoneycombOpentelemetryReactNativeExample

format: format-typescript format-android format-swift format-c

#: cleans up smoke test output
clean-smoke-tests:
	rm -rf ./smoke-tests/collector/data.json
	rm -rf ./smoke-tests/collector/data-results/*.json
	rm -rf ./smoke-tests/report.*

smoke-tests/collector/data.json:
	@echo ""
	@echo "+++ Zhuzhing smoke test's Collector data.json"
	@echo ""
	@touch $@ && chmod o+w $@

smoke-docker: smoke-tests/collector/data.json
	@echo ""
	@echo "+++ Spinning up the smokers."
	@echo ""
	docker compose up --build react-native --build collector --build mock-server --detach

unsmoke:
	@echo ""
	@echo "+++ Spinning down the smokers."
	@echo ""
	docker compose down --volumes

android-emulator:
	@echo ""
	@echo "+++ Setting up Android environment."
	@echo ""
	bash ./setup-android-env.sh

android-test: android-emulator
	@echo ""
	@echo "+++ Running Android tests."
	@echo ""
	yarn example detox build --configuration android.emu.debug
	yarn example detox test --configuration android.emu.debug

ios-test:
	@echo ""
	@echo "+++ Running iOS tests."
	@echo ""
	yarn example detox build --configuration ios.sim.debug
	yarn example detox test --configuration ios.sim.debug

smoke-bats: smoke-tests/collector/data.json
	@echo ""
	@echo "+++ Running bats smoke tests."
	@echo ""
	cd smoke-tests && bats ./smoke-e2e.bats --report-formatter junit --output ./

smoke-android: unsmoke clean-smoke-tests smoke-docker android-test smoke-bats

smoke-ios: unsmoke clean-smoke-tests smoke-docker ios-test smoke-bats
