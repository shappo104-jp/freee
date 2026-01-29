import { useState, useEffect } from 'react'
import './App.css'
import { Home, Clock, FileText, Menu, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react'

type TabType = 'home' | 'attendance' | 'payslip' | 'others'
type PayslipTabType = 'salary' | 'bonus'
type ScreenType = 'main' | 'payslipDetail' | 'createPayslip' | 'deletePayslip' | 'editPayslip'

interface PayslipItem {
  id: string
  year: number
  month: number
  type: 'salary' | 'bonus'
  netAmount: number
  grossAmount: number
  totalDeductions: number
  payments: { name: string; amount: number }[]
  deductions: { name: string; amount: number }[]
}

interface AttendanceRecord {
  date: string
  time: string
  type: string
}

const initialSalaryData: PayslipItem[] = [
  { id: 's1', year: 2026, month: 1, type: 'salary', netAmount: 285000, grossAmount: 350000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 30000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's2', year: 2025, month: 12, type: 'salary', netAmount: 280000, grossAmount: 345000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 25000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's3', year: 2025, month: 11, type: 'salary', netAmount: 282000, grossAmount: 347000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 27000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's4', year: 2025, month: 10, type: 'salary', netAmount: 278000, grossAmount: 343000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 23000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's5', year: 2025, month: 9, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's6', year: 2025, month: 8, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's7', year: 2025, month: 7, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's8', year: 2025, month: 6, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's9', year: 2025, month: 5, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's10', year: 2025, month: 4, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's11', year: 2025, month: 3, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's12', year: 2025, month: 2, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's13', year: 2025, month: 1, type: 'salary', netAmount: 275000, grossAmount: 340000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 300000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's14', year: 2024, month: 12, type: 'salary', netAmount: 270000, grossAmount: 335000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 295000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's15', year: 2024, month: 11, type: 'salary', netAmount: 270000, grossAmount: 335000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 295000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's16', year: 2024, month: 10, type: 'salary', netAmount: 270000, grossAmount: 335000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 295000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's17', year: 2024, month: 9, type: 'salary', netAmount: 270000, grossAmount: 335000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 295000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's18', year: 2024, month: 8, type: 'salary', netAmount: 270000, grossAmount: 335000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 295000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's19', year: 2024, month: 7, type: 'salary', netAmount: 270000, grossAmount: 335000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 295000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
  { id: 's20', year: 2024, month: 6, type: 'salary', netAmount: 270000, grossAmount: 335000, totalDeductions: 65000, payments: [{ name: '基本給', amount: 295000 }, { name: '通勤手当', amount: 20000 }, { name: '残業手当', amount: 20000 }], deductions: [{ name: '健康保険料', amount: 15000 }, { name: '厚生年金', amount: 27000 }, { name: '雇用保険料', amount: 3000 }, { name: '所得税', amount: 15000 }, { name: '住民税', amount: 5000 }] },
]

const initialBonusData: PayslipItem[] = [
  { id: 'b1', year: 2025, month: 12, type: 'bonus', netAmount: 450000, grossAmount: 600000, totalDeductions: 150000, payments: [{ name: '賞与（基本）', amount: 500000 }, { name: '特別手当', amount: 100000 }], deductions: [{ name: '健康保険料', amount: 30000 }, { name: '厚生年金', amount: 55000 }, { name: '雇用保険料', amount: 5000 }, { name: '所得税', amount: 60000 }] },
  { id: 'b2', year: 2025, month: 7, type: 'bonus', netAmount: 420000, grossAmount: 550000, totalDeductions: 130000, payments: [{ name: '賞与（基本）', amount: 450000 }, { name: '特別手当', amount: 100000 }], deductions: [{ name: '健康保険料', amount: 28000 }, { name: '厚生年金', amount: 50000 }, { name: '雇用保険料', amount: 4000 }, { name: '所得税', amount: 48000 }] },
  { id: 'b3', year: 2024, month: 12, type: 'bonus', netAmount: 400000, grossAmount: 520000, totalDeductions: 120000, payments: [{ name: '賞与（基本）', amount: 420000 }, { name: '特別手当', amount: 100000 }], deductions: [{ name: '健康保険料', amount: 26000 }, { name: '厚生年金', amount: 47000 }, { name: '雇用保険料', amount: 4000 }, { name: '所得税', amount: 43000 }] },
  { id: 'b4', year: 2024, month: 7, type: 'bonus', netAmount: 380000, grossAmount: 500000, totalDeductions: 120000, payments: [{ name: '賞与（基本）', amount: 400000 }, { name: '特別手当', amount: 100000 }], deductions: [{ name: '健康保険料', amount: 25000 }, { name: '厚生年金', amount: 45000 }, { name: '雇用保険料', amount: 4000 }, { name: '所得税', amount: 46000 }] },
]

const initialAttendanceRecords: AttendanceRecord[] = [
  { date: '2025年11月7日', time: '09:00', type: '出勤' }
]

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土']

function formatCurrency(amount: number): string {
  return '¥ ' + amount.toLocaleString('ja-JP')
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [payslipTab, setPayslipTab] = useState<PayslipTabType>('salary')
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main')
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipItem | null>(null)
  const [salaryData, setSalaryData] = useState<PayslipItem[]>(initialSalaryData)
  const [bonusData, setBonusData] = useState<PayslipItem[]>(initialBonusData)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set())
  const [deleteTab, setDeleteTab] = useState<PayslipTabType>('salary')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [newPayslipType, setNewPayslipType] = useState<'salary' | 'bonus'>('salary')
  const [newPayslipYear, setNewPayslipYear] = useState(2026)
  const [newPayslipMonth, setNewPayslipMonth] = useState(1)
  const [newPayments, setNewPayments] = useState<{ name: string; amount: number }[]>([{ name: '', amount: 0 }])
  const [newDeductions, setNewDeductions] = useState<{ name: string; amount: number }[]>([{ name: '', amount: 0 }])
  const [showActionMenu, setShowActionMenu] = useState(false)
  const [editTab, setEditTab] = useState<PayslipTabType>('salary')
  const [editingPayslip, setEditingPayslip] = useState<PayslipItem | null>(null)
  const [editPayments, setEditPayments] = useState<{ name: string; amount: number }[]>([])
  const [editDeductions, setEditDeductions] = useState<{ name: string; amount: number }[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()]
    return `${year}年${month}月${day}日 ${dayOfWeek}曜日`
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const handlePunch = (type: string) => {
    const now = new Date()
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    setAttendanceRecords([{ date: dateStr, time: timeStr, type }, ...attendanceRecords])
  }

  const getCalendarDays = () => {
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()
    
    const days: (number | null)[] = []
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const handlePayslipClick = (payslip: PayslipItem) => {
    setSelectedPayslip(payslip)
    setCurrentScreen('payslipDetail')
  }

  const handleCreatePayslip = () => {
    const totalPayments = newPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalDeductions = newDeductions.reduce((sum, d) => sum + d.amount, 0)
    const newPayslip: PayslipItem = {
      id: `${newPayslipType === 'salary' ? 's' : 'b'}${Date.now()}`,
      year: newPayslipYear,
      month: newPayslipMonth,
      type: newPayslipType,
      netAmount: totalPayments - totalDeductions,
      grossAmount: totalPayments,
      totalDeductions: totalDeductions,
      payments: newPayments.filter(p => p.name && p.amount > 0),
      deductions: newDeductions.filter(d => d.name && d.amount > 0),
    }
    
    if (newPayslipType === 'salary') {
      setSalaryData([newPayslip, ...salaryData].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      }))
    } else {
      setBonusData([newPayslip, ...bonusData].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      }))
    }
    
    setNewPayments([{ name: '', amount: 0 }])
    setNewDeductions([{ name: '', amount: 0 }])
    setCurrentScreen('main')
    setActiveTab('payslip')
  }

  const handleDeleteSelected = () => {
    if (deleteTab === 'salary') {
      setSalaryData(salaryData.filter(s => !selectedForDelete.has(s.id)))
    } else {
      setBonusData(bonusData.filter(b => !selectedForDelete.has(b.id)))
    }
    setSelectedForDelete(new Set())
    setShowDeleteConfirm(false)
  }

  const toggleDeleteSelection = (id: string) => {
    const newSet = new Set(selectedForDelete)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedForDelete(newSet)
  }

  const renderHomeScreen = () => (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="bg-[#DCE8FF] p-4 pt-12">
        <h2 className="text-lg font-medium text-center text-gray-800">ホーム</h2>
      </div>
      
      <div className="p-4">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">{formatDate(currentTime)}</p>
          <p className="text-4xl font-bold">{formatTime(currentTime)}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: '出勤', color: 'bg-[#3366FF]' },
            { label: '退勤', color: 'bg-[#3366FF]' },
            { label: '休憩開始', color: 'bg-white border border-[#3366FF] text-[#3366FF]' },
            { label: '休憩終了', color: 'bg-white border border-[#3366FF] text-[#3366FF]' },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handlePunch(btn.label)}
              className={`${btn.color} ${idx < 2 ? 'text-white' : ''} rounded-xl py-6 text-lg font-medium shadow-sm active:opacity-80 transition-opacity`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-3">打刻履歴</h3>
          {attendanceRecords.slice(0, 5).map((record, idx) => (
            <div key={idx} className="flex items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-600 text-sm">{record.date}</span>
              <span className="ml-auto text-[#3366FF] font-medium">{record.time} {record.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAttendanceScreen = () => (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="bg-[#DCE8FF] p-4 pt-12">
        <h2 className="text-lg font-medium text-center text-gray-800">勤怠</h2>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}>
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
            <span className="text-lg font-medium">{calendarDate.getFullYear()}年{calendarDate.getMonth() + 1}月</span>
            <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((day, idx) => (
              <div key={day} className={`text-xs py-2 ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
                {day}
              </div>
            ))}
            {getCalendarDays().map((day, idx) => (
              <div key={idx} className="py-2 text-sm">
                {day || ''}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-3">勤務サマリー</h3>
          {[
            { label: '総勤務時間', value: '0時間0分' },
            { label: '所定内', value: '0時間0分' },
            { label: '所定外', value: '0時間0分' },
            { label: '深夜', value: '0時間0分' },
            { label: '休日', value: '0時間0分' },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPayslipList = () => (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="bg-[#DCE8FF] pt-12 pb-0">
        <h2 className="text-lg font-bold text-center text-gray-900 pb-4">明細</h2>
        <div className="flex">
          <button
            onClick={() => setPayslipTab('salary')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${payslipTab === 'salary' ? 'text-[#3366FF] border-b-2 border-[#3366FF]' : 'text-gray-500'}`}
          >
            給与
          </button>
          <button
            onClick={() => setPayslipTab('bonus')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${payslipTab === 'bonus' ? 'text-[#3366FF] border-b-2 border-[#3366FF]' : 'text-gray-500'}`}
          >
            賞与
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="bg-white">
          {(payslipTab === 'salary' ? salaryData : bonusData).map((item, index) => (
            <button
              key={item.id}
              onClick={() => handlePayslipClick(item)}
              className={`w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors ${index !== 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="text-left">
                <p className="font-bold text-gray-900">
                  {item.year}年 {item.month}月{item.type === 'bonus' ? '賞与' : ''}
                </p>
                <p className="text-sm text-gray-500">支給日 {item.year}/{String(item.month).padStart(2, '0')}/24</p>
              </div>
              <div className="flex items-center">
                <p className="font-bold text-gray-900 mr-2">{formatCurrency(item.netAmount)}</p>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPayslipDetail = () => {
    if (!selectedPayslip) return null
    
    return (
      <div className="flex flex-col h-full bg-[#F8F9FB]">
        <div className="bg-[#DCE8FF] p-4 pt-12">
          <button onClick={() => setCurrentScreen('main')} className="flex items-center mb-2 text-[#3366FF]">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>戻る</span>
          </button>
          <h2 className="text-lg font-bold text-center text-gray-900">
            {selectedPayslip.year}年{selectedPayslip.month}月{selectedPayslip.type === 'bonus' ? '賞与' : '給与'}明細
          </h2>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="bg-white py-8 px-4">
            <p className="text-sm text-gray-500 text-center mb-2">差引総支給額</p>
            <p className="text-3xl font-bold text-gray-900 text-center">{formatCurrency(selectedPayslip.netAmount)}</p>
            <p className="text-sm text-gray-500 text-center mt-2">支給日 {selectedPayslip.year}/{String(selectedPayslip.month).padStart(2, '0')}/24</p>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">総支給額</span>
                <span className="font-medium text-gray-900">{formatCurrency(selectedPayslip.grossAmount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">総控除額</span>
                <span className="font-medium text-gray-900">{formatCurrency(selectedPayslip.totalDeductions)}</span>
              </div>
            </div>
          </div>
          
          <div className="px-4 pt-4">
            <p className="text-sm text-gray-500 mb-2">支給</p>
          </div>
          <div className="bg-white">
            {selectedPayslip.payments.map((payment, idx) => (
              <div key={idx} className={`flex justify-between px-4 py-3 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                <span className="text-gray-900">{payment.name}</span>
                <span className="text-gray-900">{formatCurrency(payment.amount)}</span>
              </div>
            ))}
          </div>
          
          <div className="px-4 pt-4">
            <p className="text-sm text-gray-500 mb-2">控除</p>
          </div>
          <div className="bg-white">
            {selectedPayslip.deductions.map((deduction, idx) => (
              <div key={idx} className={`flex justify-between px-4 py-3 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                <span className="text-gray-900">{deduction.name}</span>
                <span className="text-gray-900">{formatCurrency(deduction.amount)}</span>
              </div>
            ))}
          </div>
          
          <div className="px-4 pt-4">
            <p className="text-sm text-gray-500 mb-2">勤怠</p>
          </div>
          <div className="bg-white mb-4">
            {[
              { label: '出勤日数', value: '0日' },
              { label: '欠勤日数', value: '0日' },
              { label: '有給取得日数', value: '0日' },
              { label: '残業時間', value: '0時間' },
            ].map((item, idx) => (
              <div key={idx} className={`flex justify-between px-4 py-3 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                <span className="text-gray-900">{item.label}</span>
                <span className="text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderOthersScreen = () => (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="bg-[#DCE8FF] p-4 pt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">その他</h2>
          <button
            onClick={() => setShowActionMenu(true)}
            className="p-2"
          >
            <Plus className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {[
            { label: 'プロフィール' },
            { label: '通知設定' },
            { label: 'ヘルプ' },
            { label: 'お問い合わせ' },
          ].map((item, idx, arr) => (
            <button key={idx} className={`w-full p-4 flex items-center justify-between ${idx < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <span>{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
      
      {showActionMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4 pb-8" onClick={() => setShowActionMenu(false)}>
          <div className="w-full max-w-md space-y-2" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  setShowActionMenu(false)
                  setCurrentScreen('createPayslip')
                }}
                className="w-full p-4 text-center text-[#3366FF] font-medium border-b border-gray-100"
              >
                データの追加
              </button>
              <button
                onClick={() => {
                  setShowActionMenu(false)
                  setSelectedForDelete(new Set())
                  setCurrentScreen('deletePayslip')
                }}
                className="w-full p-4 text-center text-[#3366FF] font-medium border-b border-gray-100"
              >
                データの削除
              </button>
              <button
                onClick={() => {
                  setShowActionMenu(false)
                  setEditingPayslip(null)
                  setCurrentScreen('editPayslip')
                }}
                className="w-full p-4 text-center text-[#3366FF] font-medium"
              >
                データの編集
              </button>
            </div>
            <button
              onClick={() => setShowActionMenu(false)}
              className="w-full bg-white rounded-xl p-4 text-center text-[#3366FF] font-bold"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderCreatePayslipScreen = () => (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="bg-[#DCE8FF] p-4 pt-12">
        <button onClick={() => setCurrentScreen('main')} className="flex items-center mb-4 text-gray-800">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>戻る</span>
        </button>
        <h2 className="text-lg font-medium text-gray-800">明細データの新規作成</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <label className="text-sm text-gray-500 mb-2 block">種別</label>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setNewPayslipType('salary')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${newPayslipType === 'salary' ? 'bg-white text-[#3366FF] shadow-sm' : 'text-gray-600'}`}
            >
              給与明細
            </button>
            <button
              onClick={() => setNewPayslipType('bonus')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${newPayslipType === 'bonus' ? 'bg-white text-[#3366FF] shadow-sm' : 'text-gray-600'}`}
            >
              賞与明細
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <label className="text-sm text-gray-500 mb-2 block">対象年月</label>
          <div className="flex gap-4">
            <select
              value={newPayslipYear}
              onChange={(e) => setNewPayslipYear(Number(e.target.value))}
              className="flex-1 border border-gray-300 rounded-lg p-3 text-lg"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
            <select
              value={newPayslipMonth}
              onChange={(e) => setNewPayslipMonth(Number(e.target.value))}
              className="flex-1 border border-gray-300 rounded-lg p-3 text-lg"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}月</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <label className="text-sm text-gray-500 mb-2 block">支給項目</label>
          {newPayments.map((payment, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="項目名"
                value={payment.name}
                onChange={(e) => {
                  const updated = [...newPayments]
                  updated[idx].name = e.target.value
                  setNewPayments(updated)
                }}
                className="flex-1 border border-gray-300 rounded-lg p-2"
              />
              <input
                type="number"
                placeholder="金額"
                value={payment.amount || ''}
                onChange={(e) => {
                  const updated = [...newPayments]
                  updated[idx].amount = Number(e.target.value)
                  setNewPayments(updated)
                }}
                inputMode="numeric"
                className="w-32 border border-gray-300 rounded-lg p-2"
              />
              {newPayments.length > 1 && (
                <button
                  onClick={() => setNewPayments(newPayments.filter((_, i) => i !== idx))}
                  className="text-red-500 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setNewPayments([...newPayments, { name: '', amount: 0 }])}
            className="text-[#3366FF] text-sm font-medium mt-2"
          >
            + 支給項目を追加
          </button>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <label className="text-sm text-gray-500 mb-2 block">控除項目</label>
          {newDeductions.map((deduction, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="項目名"
                value={deduction.name}
                onChange={(e) => {
                  const updated = [...newDeductions]
                  updated[idx].name = e.target.value
                  setNewDeductions(updated)
                }}
                className="flex-1 border border-gray-300 rounded-lg p-2"
              />
              <input
                type="number"
                placeholder="金額"
                value={deduction.amount || ''}
                onChange={(e) => {
                  const updated = [...newDeductions]
                  updated[idx].amount = Number(e.target.value)
                  setNewDeductions(updated)
                }}
                inputMode="numeric"
                className="w-32 border border-gray-300 rounded-lg p-2"
              />
              {newDeductions.length > 1 && (
                <button
                  onClick={() => setNewDeductions(newDeductions.filter((_, i) => i !== idx))}
                  className="text-red-500 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setNewDeductions([...newDeductions, { name: '', amount: 0 }])}
            className="text-[#3366FF] text-sm font-medium mt-2"
          >
            + 控除項目を追加
          </button>
        </div>
        
        <button
          onClick={handleCreatePayslip}
          className="w-full bg-[#3366FF] text-white rounded-xl p-4 font-medium shadow-sm"
        >
          作成する
        </button>
      </div>
    </div>
  )

  const renderDeletePayslipScreen = () => (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="bg-[#DCE8FF] p-4 pt-12">
        <button onClick={() => setCurrentScreen('main')} className="flex items-center mb-4 text-gray-800">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>戻る</span>
        </button>
        <h2 className="text-lg font-medium text-gray-800">明細データの削除</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="flex bg-gray-200 rounded-lg p-1 mb-4">
          <button
            onClick={() => {
              setDeleteTab('salary')
              setSelectedForDelete(new Set())
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${deleteTab === 'salary' ? 'bg-white text-[#3366FF] shadow-sm' : 'text-gray-600'}`}
          >
            給与
          </button>
          <button
            onClick={() => {
              setDeleteTab('bonus')
              setSelectedForDelete(new Set())
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${deleteTab === 'bonus' ? 'bg-white text-[#3366FF] shadow-sm' : 'text-gray-600'}`}
          >
            賞与
          </button>
        </div>
        
        <div className="space-y-2">
          {(deleteTab === 'salary' ? salaryData : bonusData).map((item) => (
            <button
              key={item.id}
              onClick={() => toggleDeleteSelection(item.id)}
              className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center"
            >
              <div className={`w-6 h-6 rounded border-2 mr-4 flex items-center justify-center ${selectedForDelete.has(item.id) ? 'bg-[#3366FF] border-[#3366FF]' : 'border-gray-300'}`}>
                {selectedForDelete.has(item.id) && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <p className="font-medium">
                  {item.year}年 {item.month}月{item.type === 'bonus' ? '賞与' : ''}
                </p>
                <p className="text-gray-500 text-sm">{formatCurrency(item.netAmount)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {selectedForDelete.size > 0 && (
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-500 text-white rounded-xl p-4 font-medium"
          >
            選択した項目を削除（{selectedForDelete.size}件）
          </button>
        </div>
      )}
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">削除の確認</h3>
            <p className="text-gray-600 mb-6">一度削除すると復元できません。よろしいですか？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 rounded-xl py-3 font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 bg-red-500 text-white rounded-xl py-3 font-medium"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const handleEditPayslip = (payslip: PayslipItem) => {
    setEditingPayslip(payslip)
    setEditPayments([...payslip.payments])
    setEditDeductions([...payslip.deductions])
  }

  const handleSaveEdit = () => {
    if (!editingPayslip) return
    
    const totalPayments = editPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalDeductions = editDeductions.reduce((sum, d) => sum + d.amount, 0)
    const updatedPayslip: PayslipItem = {
      ...editingPayslip,
      netAmount: totalPayments - totalDeductions,
      grossAmount: totalPayments,
      totalDeductions: totalDeductions,
      payments: editPayments.filter(p => p.name && p.amount > 0),
      deductions: editDeductions.filter(d => d.name && d.amount > 0),
    }
    
    if (editingPayslip.type === 'salary') {
      setSalaryData(salaryData.map(s => s.id === editingPayslip.id ? updatedPayslip : s))
    } else {
      setBonusData(bonusData.map(b => b.id === editingPayslip.id ? updatedPayslip : b))
    }
    
    setEditingPayslip(null)
    setCurrentScreen('main')
    setActiveTab('payslip')
  }

  const renderEditPayslipScreen = () => (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="bg-[#DCE8FF] p-4 pt-12">
        <button onClick={() => {
          if (editingPayslip) {
            setEditingPayslip(null)
          } else {
            setCurrentScreen('main')
          }
        }} className="flex items-center mb-4 text-gray-800">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>戻る</span>
        </button>
        <h2 className="text-lg font-medium text-gray-800">{editingPayslip ? '明細データの編集' : '編集する明細を選択'}</h2>
      </div>
      
      {!editingPayslip ? (
        <div className="flex-1 overflow-auto p-4">
          <div className="flex bg-gray-200 rounded-lg p-1 mb-4">
            <button
              onClick={() => setEditTab('salary')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${editTab === 'salary' ? 'bg-white text-[#3366FF] shadow-sm' : 'text-gray-600'}`}
            >
              給与
            </button>
            <button
              onClick={() => setEditTab('bonus')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${editTab === 'bonus' ? 'bg-white text-[#3366FF] shadow-sm' : 'text-gray-600'}`}
            >
              賞与
            </button>
          </div>
          
          <div className="space-y-2">
            {(editTab === 'salary' ? salaryData : bonusData).map((item) => (
              <button
                key={item.id}
                onClick={() => handleEditPayslip(item)}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="text-left">
                  <p className="font-medium">
                    {item.year}年 {item.month}月{item.type === 'bonus' ? '賞与' : ''}
                  </p>
                  <p className="text-[#3366FF] text-lg font-bold">{formatCurrency(item.netAmount)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <p className="text-sm text-gray-500 mb-1">編集中</p>
            <p className="font-medium">{editingPayslip.year}年 {editingPayslip.month}月{editingPayslip.type === 'bonus' ? '賞与' : '給与'}明細</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <label className="text-sm text-gray-500 mb-2 block">支給項目</label>
            {editPayments.map((payment, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="項目名"
                  value={payment.name}
                  onChange={(e) => {
                    const updated = [...editPayments]
                    updated[idx].name = e.target.value
                    setEditPayments(updated)
                  }}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="number"
                  placeholder="金額"
                  value={payment.amount || ''}
                  onChange={(e) => {
                    const updated = [...editPayments]
                    updated[idx].amount = Number(e.target.value)
                    setEditPayments(updated)
                  }}
                  inputMode="numeric"
                  className="w-32 border border-gray-300 rounded-lg p-2"
                />
                {editPayments.length > 1 && (
                  <button
                    onClick={() => setEditPayments(editPayments.filter((_, i) => i !== idx))}
                    className="text-red-500 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setEditPayments([...editPayments, { name: '', amount: 0 }])}
              className="text-[#3366FF] text-sm font-medium mt-2"
            >
              + 支給項目を追加
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <label className="text-sm text-gray-500 mb-2 block">控除項目</label>
            {editDeductions.map((deduction, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="項目名"
                  value={deduction.name}
                  onChange={(e) => {
                    const updated = [...editDeductions]
                    updated[idx].name = e.target.value
                    setEditDeductions(updated)
                  }}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="number"
                  placeholder="金額"
                  value={deduction.amount || ''}
                  onChange={(e) => {
                    const updated = [...editDeductions]
                    updated[idx].amount = Number(e.target.value)
                    setEditDeductions(updated)
                  }}
                  inputMode="numeric"
                  className="w-32 border border-gray-300 rounded-lg p-2"
                />
                {editDeductions.length > 1 && (
                  <button
                    onClick={() => setEditDeductions(editDeductions.filter((_, i) => i !== idx))}
                    className="text-red-500 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setEditDeductions([...editDeductions, { name: '', amount: 0 }])}
              className="text-[#3366FF] text-sm font-medium mt-2"
            >
              + 控除項目を追加
            </button>
          </div>
          
          <button
            onClick={handleSaveEdit}
            className="w-full bg-[#3366FF] text-white rounded-xl p-4 font-medium shadow-sm"
          >
            保存する
          </button>
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    if (currentScreen === 'payslipDetail') return renderPayslipDetail()
    if (currentScreen === 'createPayslip') return renderCreatePayslipScreen()
    if (currentScreen === 'deletePayslip') return renderDeletePayslipScreen()
    if (currentScreen === 'editPayslip') return renderEditPayslipScreen()
    
    switch (activeTab) {
      case 'home':
        return renderHomeScreen()
      case 'attendance':
        return renderAttendanceScreen()
      case 'payslip':
        return renderPayslipList()
      case 'others':
        return renderOthersScreen()
      default:
        return renderHomeScreen()
    }
  }

  const showBottomNav = currentScreen === 'main'

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB] max-w-md mx-auto">
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
      
      {showBottomNav && (
        <nav className="bg-white border-t border-gray-200 px-4 py-2 pb-6">
          <div className="flex justify-around">
            {[
              { id: 'home' as TabType, label: 'ホーム', icon: Home },
              { id: 'attendance' as TabType, label: '勤怠', icon: Clock },
              { id: 'payslip' as TabType, label: '明細', icon: FileText },
              { id: 'others' as TabType, label: 'その他', icon: Menu },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 ${activeTab === tab.id ? 'text-[#3366FF]' : 'text-gray-400'}`}
              >
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default App
