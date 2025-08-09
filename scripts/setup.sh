#!/bin/bash

echo "🚀 Setting up GitLumen project..."

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install Yarn first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ Yarn version: $(yarn --version)"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build packages
echo "🔨 Building packages..."
yarn build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your configuration values"
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker is available. You can run:"
    echo "   docker-compose -f docker/docker-compose.yml up -d"
    echo "   to start the development environment"
else
    echo "⚠️  Docker is not available. You'll need to run PostgreSQL manually."
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Start the development environment:"
echo "   - API: yarn workspace @gitlumen/api start:dev"
echo "   - Web: yarn workspace @gitlumen/web dev"
echo "3. Or use Docker: docker-compose -f docker/docker-compose.yml up -d" 