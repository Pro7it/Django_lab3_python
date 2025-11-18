FROM python:3.12-slim

# встановлюємо системні залежності
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# копіюємо залежності та встановлюємо
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# копіюємо код бекенду
COPY . .

# відкриваємо порт для Django
EXPOSE 8000

# команда запуску Django dev server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
