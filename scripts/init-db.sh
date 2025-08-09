#!/bin/bash

echo "🗄️  Initializing GitLumen database..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    echo "   Please start PostgreSQL or use Docker:"
    echo "   docker-compose -f docker/docker-compose.yml up -d postgres"
    exit 1
fi

# Database configuration
DB_NAME="gitlumen"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "✅ PostgreSQL is running"
echo "📊 Database: $DB_NAME"
echo "👤 User: $DB_USER"
echo "🌐 Host: $DB_HOST"
echo "🔌 Port: $DB_PORT"

# Create database if it doesn't exist
echo "🔨 Creating database if it doesn't exist..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database already exists"

# Check if database was created successfully
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\l" &> /dev/null; then
    echo "✅ Database '$DB_NAME' is ready"
    
    # Run migrations if they exist
    if [ -d "apps/api/dist/migrations" ]; then
        echo "🔄 Running migrations..."
        yarn workspace @gitlumen/api migration:run
    else
        echo "⚠️  No migrations found. Build the API first:"
        echo "   yarn workspace @gitlumen/api build"
    fi
else
    echo "❌ Failed to connect to database '$DB_NAME'"
    echo "   Please check your PostgreSQL configuration"
    exit 1
fi

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "Next steps:"
echo "1. Start the API: yarn workspace @gitlumen/api start:dev"
echo "2. Start the Web app: yarn workspace @gitlumen/web dev"
echo "3. Or use Docker: docker-compose -f docker/docker-compose.yml up -d" 