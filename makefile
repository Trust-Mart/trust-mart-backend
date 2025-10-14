# Makefile for local quality checks before pushing code

# Use Node scripts for consistency with package.json
.PHONY: all check type lint format test build clean

# Default target (run all checks)
all: check

# Run all checks before push
check: type lint format test
	@echo "✅ All pre-push checks passed!"

# Run TypeScript type checking
type:
	@echo "🔍 Running TypeScript type check..."
	npm run type-check

# Run ESLint (and autofix common issues)
lint:
	@echo "🧹 Running ESLint..."
	npm run lint:fix
	npm run lint

# Run Prettier (and check formatting)
format:
	@echo "✨ Running Prettier formatting checks..."
	npm run format
	npm run format:check

# Run tests
test:
	@echo "🧪 Running test suite..."
	npm run test:run

# Run build (optional step)
build:
	@echo "🏗️  Building project..."
	npm run build

# Clean up node_modules and dist
clean:
	@echo "🧽 Cleaning up..."
	rm -rf node_modules dist
