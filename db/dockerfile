FROM postgres:latest

# Set environment variables
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 2314
ENV POSTGRES_DB tools

# Create a volume for PostgreSQL data
VOLUME /var/lib/postgresql/data

# Copy the init-schema.sql into the container
COPY init.sql /docker-entrypoint-initdb.d/

RUN chown -R 1009730000:1009730000 /var/lib/postgresql/data


# Expose the PostgreSQL port
EXPOSE 5432