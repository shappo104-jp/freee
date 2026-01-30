from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import json
import os

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Database path - use /data for persistent storage in production
DB_PATH = "/data/app.db" if os.path.exists("/data") else "app.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create payslips table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payslips (
            id TEXT PRIMARY KEY,
            year INTEGER NOT NULL,
            month INTEGER NOT NULL,
            type TEXT NOT NULL,
            payments TEXT NOT NULL,
            deductions TEXT NOT NULL
        )
    ''')
    
    # Create attendance_records table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            type TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models
class PaymentItem(BaseModel):
    name: str
    amount: int

class PayslipCreate(BaseModel):
    id: str
    year: int
    month: int
    type: str
    payments: List[PaymentItem]
    deductions: List[PaymentItem]

class PayslipUpdate(BaseModel):
    year: Optional[int] = None
    month: Optional[int] = None
    type: Optional[str] = None
    payments: Optional[List[PaymentItem]] = None
    deductions: Optional[List[PaymentItem]] = None

class PayslipResponse(BaseModel):
    id: str
    year: int
    month: int
    type: str
    netAmount: int
    grossAmount: int
    totalDeductions: int
    payments: List[PaymentItem]
    deductions: List[PaymentItem]

class AttendanceRecord(BaseModel):
    date: str
    time: str
    type: str

class AttendanceRecordResponse(BaseModel):
    id: int
    date: str
    time: str
    type: str

def calculate_payslip_totals(payments: List[dict], deductions: List[dict]) -> tuple:
    """Calculate grossAmount, totalDeductions, and netAmount from payments and deductions"""
    gross_amount = sum(p['amount'] for p in payments)
    total_deductions = sum(d['amount'] for d in deductions)
    net_amount = gross_amount - total_deductions
    return gross_amount, total_deductions, net_amount

def row_to_payslip(row) -> dict:
    """Convert a database row to a payslip response dict"""
    payments = json.loads(row['payments'])
    deductions = json.loads(row['deductions'])
    gross_amount, total_deductions, net_amount = calculate_payslip_totals(payments, deductions)
    
    return {
        'id': row['id'],
        'year': row['year'],
        'month': row['month'],
        'type': row['type'],
        'netAmount': net_amount,
        'grossAmount': gross_amount,
        'totalDeductions': total_deductions,
        'payments': payments,
        'deductions': deductions
    }

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

# Payslip endpoints
@app.get("/payslips", response_model=List[PayslipResponse])
async def get_payslips():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM payslips ORDER BY year DESC, month DESC')
    rows = cursor.fetchall()
    conn.close()
    
    return [row_to_payslip(row) for row in rows]

@app.get("/payslips/{payslip_id}", response_model=PayslipResponse)
async def get_payslip(payslip_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM payslips WHERE id = ?', (payslip_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Payslip not found")
    
    return row_to_payslip(row)

@app.post("/payslips", response_model=PayslipResponse)
async def create_payslip(payslip: PayslipCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    payments_json = json.dumps([p.model_dump() for p in payslip.payments])
    deductions_json = json.dumps([d.model_dump() for d in payslip.deductions])
    
    try:
        cursor.execute('''
            INSERT INTO payslips (id, year, month, type, payments, deductions)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (payslip.id, payslip.year, payslip.month, payslip.type, payments_json, deductions_json))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Payslip with this ID already exists")
    
    cursor.execute('SELECT * FROM payslips WHERE id = ?', (payslip.id,))
    row = cursor.fetchone()
    conn.close()
    
    return row_to_payslip(row)

@app.put("/payslips/{payslip_id}", response_model=PayslipResponse)
async def update_payslip(payslip_id: str, payslip: PayslipUpdate):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if payslip exists
    cursor.execute('SELECT * FROM payslips WHERE id = ?', (payslip_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Payslip not found")
    
    # Build update query
    updates = []
    values = []
    
    if payslip.year is not None:
        updates.append('year = ?')
        values.append(payslip.year)
    if payslip.month is not None:
        updates.append('month = ?')
        values.append(payslip.month)
    if payslip.type is not None:
        updates.append('type = ?')
        values.append(payslip.type)
    if payslip.payments is not None:
        updates.append('payments = ?')
        values.append(json.dumps([p.model_dump() for p in payslip.payments]))
    if payslip.deductions is not None:
        updates.append('deductions = ?')
        values.append(json.dumps([d.model_dump() for d in payslip.deductions]))
    
    if updates:
        values.append(payslip_id)
        cursor.execute(f'UPDATE payslips SET {", ".join(updates)} WHERE id = ?', values)
        conn.commit()
    
    cursor.execute('SELECT * FROM payslips WHERE id = ?', (payslip_id,))
    row = cursor.fetchone()
    conn.close()
    
    return row_to_payslip(row)

@app.delete("/payslips/{payslip_id}")
async def delete_payslip(payslip_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM payslips WHERE id = ?', (payslip_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Payslip not found")
    
    cursor.execute('DELETE FROM payslips WHERE id = ?', (payslip_id,))
    conn.commit()
    conn.close()
    
    return {"status": "deleted"}

# Bulk operations for initial data sync
@app.post("/payslips/bulk", response_model=List[PayslipResponse])
async def bulk_create_payslips(payslips: List[PayslipCreate]):
    conn = get_db()
    cursor = conn.cursor()
    
    for payslip in payslips:
        payments_json = json.dumps([p.model_dump() for p in payslip.payments])
        deductions_json = json.dumps([d.model_dump() for d in payslip.deductions])
        
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO payslips (id, year, month, type, payments, deductions)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (payslip.id, payslip.year, payslip.month, payslip.type, payments_json, deductions_json))
        except Exception as e:
            print(f"Error inserting payslip {payslip.id}: {e}")
    
    conn.commit()
    
    cursor.execute('SELECT * FROM payslips ORDER BY year DESC, month DESC')
    rows = cursor.fetchall()
    conn.close()
    
    return [row_to_payslip(row) for row in rows]

# Attendance endpoints
@app.get("/attendance", response_model=List[AttendanceRecordResponse])
async def get_attendance():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM attendance_records ORDER BY date DESC, time DESC')
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@app.post("/attendance", response_model=AttendanceRecordResponse)
async def create_attendance(record: AttendanceRecord):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO attendance_records (date, time, type)
        VALUES (?, ?, ?)
    ''', (record.date, record.time, record.type))
    conn.commit()
    
    record_id = cursor.lastrowid
    cursor.execute('SELECT * FROM attendance_records WHERE id = ?', (record_id,))
    row = cursor.fetchone()
    conn.close()
    
    return dict(row)

@app.delete("/attendance/{record_id}")
async def delete_attendance(record_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM attendance_records WHERE id = ?', (record_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    cursor.execute('DELETE FROM attendance_records WHERE id = ?', (record_id,))
    conn.commit()
    conn.close()
    
    return {"status": "deleted"}
