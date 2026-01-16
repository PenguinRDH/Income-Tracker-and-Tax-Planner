# Income Tracker and Tax Planner

A full-stack web application for tracking income across multiple jobs and calculating estimated federal tax obligations. Built with React, Flask, PostgreSQL, and Docker.

## Features

- 📊 **Income Tracking**: Record income from multiple jobs with different income types (W2, 1099, Other)
- 💰 **Tax Withholding**: Track federal tax amounts withheld from each payment
- 🧮 **Automatic Tax Calculation**: Calculates estimated federal tax based on 2024 single filer tax brackets
- 📈 **Tax Summary Dashboard**: View total income, estimated tax owed, taxes paid, and effective tax rate
- 🗑️ **Income Management**: Add and delete income entries with ease
- 🐳 **Fully Dockerized**: Complete development environment with one command

## Tech Stack

### Frontend
- **React** 19.2.0 - UI framework
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Flask** 3.0.0 - Python web framework
- **SQLAlchemy** 2.0.23 - ORM for database interactions
- **Flask-CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** 15 - Relational database

### DevOps
- **Docker** & **Docker Compose** - Containerization and orchestration

## Prerequisites

Before running this application, make sure you have installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker and Docker Compose)
- Git (for cloning the repository)

That's it! Docker handles all other dependencies.

## Project Structure

```
income-tracker-and-tax-planner/
├── docker-compose.yml          # Docker orchestration configuration
├── backend/
│   ├── Dockerfile             # Backend container configuration
│   ├── app.py                 # Flask application and API routes
│   └── requirements.txt       # Python dependencies
└── frontend/
    ├── Dockerfile             # Frontend container configuration
    ├── package.json           # Node.js dependencies
    ├── public/                # Static assets
    └── src/
        ├── App.js             # Main React component
        ├── App.css            # Application styles
        └── index.js           # React entry point
```

## Getting Started

### 1. Clone the Repository

```bash
git clone Income-Tracker-and-Tax-Planner
cd income-tracker-and-tax-planner
```

### 2. Start Docker Desktop

Make sure Docker Desktop is running before proceeding.

### 3. Build and Run the Application

```bash
docker-compose up --build
```

This command will:
- Build the frontend, backend, and database containers
- Start all services
- Create the PostgreSQL database and tables automatically

### 4. Access the Application

Once all containers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## Usage

### Adding Income

1. Fill out the form with:
   - Job name
   - Income amount
   - Federal tax withheld
   - Date of income
   - Income type (W2, 1099, or Other)
2. Click "Add Income"

### Viewing Tax Summary

The tax summary card automatically updates and shows:
- Total income across all jobs
- Estimated federal tax owed (based on 2024 brackets)
- Total federal tax already paid
- Effective tax rate

### Managing Income Entries

- View all income entries in the "Income History" section
- Delete any entry by clicking the "Delete" button

## API Endpoints

### Get All Incomes
```
GET /api/incomes
```

### Add New Income
```
POST /api/incomes
Content-Type: application/json

{
  "job_name": "string",
  "amount": float,
  "federal_amount": float,
  "date": "YYYY-MM-DD",
  "income_type": "W2|1099|Other"
}
```

### Delete Income
```
DELETE /api/incomes/<income_id>
```

### Get Tax Summary
```
GET /api/tax-summary
```

## Development

### Viewing Logs

To view logs for a specific service:

```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs db

# All logs
docker-compose logs
```

### Stopping the Application

```bash
docker-compose down
```

### Stopping and Removing All Data

```bash
docker-compose down -v
```

⚠️ **Warning**: The `-v` flag removes all database data permanently.

### Rebuilding After Changes

If you make changes to the code:

```bash
docker-compose down
docker-compose up --build
```

## Database Access

To connect to the PostgreSQL database directly:

```bash
docker-compose exec db psql -U user -d taxtracker
```

**Database Credentials**:
- Host: `localhost`
- Port: `5432`
- Database: `taxtracker`
- User: `user`
- Password: `password`

You can also use GUI tools like pgAdmin or DBeaver with these credentials.

## Tax Calculation Details

The application uses 2024 federal tax brackets for single filers:

| Taxable Income | Tax Rate |
|---------------|----------|
| $0 - $11,600 | 10% |
| $11,600 - $47,150 | 12% |
| $47,150 - $100,525 | 22% |
| $100,525 - $191,950 | 24% |
| $191,950 - $243,725 | 32% |
| $243,725 - $609,350 | 35% |
| $609,350+ | 37% |

**Standard Deduction**: $14,600

## Future Enhancements

- [ ] Support for married filing jointly/separately tax brackets
- [ ] State tax calculations
- [ ] Quarterly estimated tax payment calculator
- [ ] Tax deduction tracking
- [ ] Multi-year income comparison
- [ ] Data export to CSV/PDF
- [ ] User authentication and multi-user support
- [ ] Mobile responsive improvements
- [ ] Income visualization charts

## Troubleshooting

### Docker Desktop Not Running
If you see `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`:
- Start Docker Desktop and wait for it to fully initialize
- Try the command again

### Port Already in Use
If ports 3000, 5000, or 5432 are already in use:
- Stop other applications using those ports
- Or modify the port mappings in `docker-compose.yml`

### CORS Errors
If you see CORS errors in the browser console:
- Make sure the backend container is running
- Check that `flask-cors` is installed (it should be in requirements.txt)
- Rebuild the backend: `docker-compose up --build backend`

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Tax brackets based on 2024 IRS single filer brackets
- Built as a learning project for full-stack development with Docker
