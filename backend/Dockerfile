# Use an official Python runtime as a parent image
FROM python:3.12-slim

ENV VIRTUAL_ENV=/usr/local

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /backend

# Copy the requirements file
COPY requirements.txt /backend/

RUN pip install uv && uv pip install --no-cache -r requirements.txt

# Copy the current directory contents into the container at /backend
COPY . /backend/

# Expose the Django port
EXPOSE 8000

# Run the Django app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
