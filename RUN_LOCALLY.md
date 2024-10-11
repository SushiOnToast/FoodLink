# Setting up FoodLink Locally

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python**: Version 3.8+
- **pip**: Package installer for Python
- **Node.js**: Version 14+
- **npm**: Node package manager
- **SQLite**: (No need for separate installation; it will be managed automatically during local development)

## Backend (Django)

### 1. Clone the Repository

Open your terminal and run the following commands to clone the repository and navigate to the project directory:

```bash
git clone https://github.com/SushiOnToast/FoodLink.git
cd FoodLink
```

### 2. Navigate to the Backend Directory

Change to the backend directory:

```bash
cd backend
```

### 3. Create a Virtual Environment

Set up a virtual environment to manage dependencies:

```bash
python -m venv venv
```

### 4. Activate the Virtual Environment

#### For PowerShell

If your execution policy allows, run:

```bash
.\venv\Scripts\Activate.ps1
```

If you encounter an error regarding the execution policy, you may need to change it temporarily with the following command:

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

After that, try activating again.

Alternatively, you can activate the environment using:

```bash
venv\Scripts\activate
```

#### For Command Prompt (Windows)

```bash
venv\Scripts\activate
```

#### For macOS/Linux

```bash
source venv/bin/activate
```

### 5. Install Dependencies

Install the required packages using pip:

```bash
pip install -r requirements.txt
```

### 6. Create a `.env` File

Create a `.env` file in the `backend` directory and set the following environment variables:

```env
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
```

**Note**: Replace `your_secret_key` with a strong secret key. You can generate one using Django's `django-admin` command or an online key generator:

```bash
django-admin shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 7. Run Migrations

Run the database migrations to set up the database schema:

```bash
python manage.py migrate
```

### 8. Create a Superuser (Optional)

Creating a superuser provides access to the Django admin panel, allowing you to manage database models easily:

```bash
python manage.py createsuperuser
```

### 9. Run the Development Server

Start the Django development server:

```bash
python manage.py runserver
```

Your Django backend will be running at `http://localhost:8000`.

## Frontend (React)

### 1. Navigate to the Frontend Directory

Change to the directory where the frontend is located:

```bash
cd ../frontend
```

### 2. Install Dependencies

Install the required dependencies for the frontend:

```bash
npm install
```

### 3. Create a `.env` File

Create a `.env` file in the `frontend` directory with the following content:

```env
VITE_API_URL=http://127.0.0.1:8000/
VITE_IMG_BASE_URL="http://127.0.0.1:8000"
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

**Note**: Replace `your_mapbox_access_token` with a Mapbox access token. You will need to create a [Mapbox account](https://account.mapbox.com/auth/signup/?route-to=https%3A%2F%2Faccount.mapbox.com%2F%3Fauth%3D1) and utilize the free tier to obtain this token.

### 4. Run the Development Server

Start the React development server:

```bash
npm run dev
```

Your React frontend will be running at `http://localhost:5173`.

## Usage

1. Open your browser and navigate to `http://localhost:5173` to access the React frontend.
2. The frontend communicates with the Django backend to handle user authentication, profile management, and other features.

## Troubleshooting

If you encounter any issues during setup or running the project, consider the following:

- Ensure all dependencies are correctly installed.
- Double-check your environment variable configurations in the `.env` files.
- Review the terminal output for any error messages that may provide clues on resolving issues.
