from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database setup
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://user:password@db:5432/taxtracker')
engine = create_engine(DATABASE_URL)
Base = declarative_base()
Session = sessionmaker(bind=engine)

# Models
class Income(Base):
    __tablename__ = 'incomes'
    
    id = Column(Integer, primary_key=True)
    job_name = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    federal_amount = Column(Float, nullable=False, default=0.0)
    date = Column(Date, nullable=False)
    income_type = Column(String(50), nullable=False)  # W2, 1099, etc.
    
    def to_dict(self):
        return {
            'id': self.id,
            'job_name': self.job_name,
            'amount': self.amount,
            'federal_amount': self.federal_amount,
            'date': self.date.isoformat(),
            'income_type': self.income_type
        }

# Create tables
Base.metadata.create_all(engine)

# Routes
@app.route('/api/incomes', methods=['GET'])
def get_incomes():
    session = Session()
    incomes = session.query(Income).all()
    session.close()
    return jsonify([income.to_dict() for income in incomes])

@app.route('/api/incomes', methods=['POST'])
def add_income():
    data = request.json
    session = Session()

    income = Income(
        job_name=data['job_name'],
        amount=data['amount'],
        federal_amount=data['federal_amount'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        income_type=data['income_type']
    )      
    
    session.add(income)
    session.commit()
    result = income.to_dict()
    session.close()
    
    return jsonify(result), 201

@app.route('/api/incomes/<int:income_id>', methods=['DELETE'])
def delete_income(income_id):
    session = Session()
    income = session.query(Income).get(income_id)
    
    if income:
        session.delete(income)
        session.commit()
        session.close()
        return '', 204
    
    session.close()
    return jsonify({'error': 'Income not found'}), 404

@app.route('/api/tax-summary', methods=['GET'])
def get_tax_summary():
    session = Session()
    incomes = session.query(Income).all()
    
    total_income = sum(income.amount for income in incomes)
    
    # Simple US federal tax calculation (2024 single filer brackets)
    tax_owed = calculate_federal_tax(total_income)
    
    summary = {
        'total_income': total_income,
        'estimated_tax': tax_owed,
        'paid_tax': sum(income.federal_amount for income in incomes),
        'effective_rate': (tax_owed / total_income * 100) if total_income > 0 else 0
    }
    
    session.close()
    return jsonify(summary)

def calculate_federal_tax(income):
    # 2024 tax brackets for single filers (simplified)
    brackets = [
        (11600, 0.10),
        (47150, 0.12),
        (100525, 0.22),
        (191950, 0.24),
        (243725, 0.32),
        (609350, 0.35),
        (float('inf'), 0.37)
    ]
    
    standard_deduction = 14600
    taxable_income = max(0, income - standard_deduction)
    
    tax = 0
    prev_bracket = 0
    
    for bracket_limit, rate in brackets:
        if taxable_income <= bracket_limit:
            tax += (taxable_income - prev_bracket) * rate
            break
        else:
            tax += (bracket_limit - prev_bracket) * rate
            prev_bracket = bracket_limit
    
    return round(tax, 2)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)