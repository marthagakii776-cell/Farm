import React, { useState } from 'react';
import { Farm, CropRecord, LivestockRecord, FinancialRecord } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sprout,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Activity,
  Layers,
  Milk,
  CheckCircle2,
  Edit2,
  X,
} from 'lucide-react';

interface FarmManagerProps {
  farms: Farm[];
  crops: CropRecord[];
  livestock: LivestockRecord[];
  financials: FinancialRecord[];
  onAddCrop: (crop: Partial<CropRecord>) => Promise<void>;
  onDeleteCrop: (id: string) => Promise<void>;
  onAddLivestock: (animal: Partial<LivestockRecord>) => Promise<void>;
  onDeleteLivestock: (id: string) => Promise<void>;
  onAddFinancial: (rec: Partial<FinancialRecord>) => Promise<void>;
  onDeleteFinancial: (id: string) => Promise<void>;
}

export const FarmManager: React.FC<FarmManagerProps> = ({
  farms,
  crops,
  livestock,
  financials,
  onAddCrop,
  onDeleteCrop,
  onAddLivestock,
  onDeleteLivestock,
  onAddFinancial,
  onDeleteFinancial,
}) => {
  const { currentUser } = useAuth();
  const [subTab, setSubTab] = useState<'crops' | 'livestock' | 'financials' | 'farms'>('crops');

  // Modals state
  const [showCropModal, setShowCropModal] = useState(false);
  const [showLivestockModal, setShowLivestockModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);

  // Form states
  const [cropForm, setCropForm] = useState({
    cropName: '',
    variety: '',
    acreage: 2,
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    stage: 'Vegetative' as const,
    healthStatus: 'Healthy' as const,
    notes: '',
  });

  const [livestockForm, setLivestockForm] = useState({
    tagNumber: '',
    animalType: 'Dairy Cow' as const,
    breed: '',
    count: 1,
    healthStatus: 'Healthy' as const,
    feedingSchedule: '',
    milkYieldLpd: 15,
    lastVeterinaryCheck: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [financialForm, setFinancialForm] = useState({
    type: 'expense' as const,
    category: 'Fertilizer',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Calculation for financial totals
  const totalIncome = financials
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpense = financials
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddCrop({
      ...cropForm,
      farmId: farms[0]?.id || 'farm_1',
      userId: currentUser?.id || 'usr_farmer_1',
    });
    setShowCropModal(false);
    setCropForm({
      cropName: '',
      variety: '',
      acreage: 2,
      plantingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      stage: 'Vegetative',
      healthStatus: 'Healthy',
      notes: '',
    });
  };

  const handleCreateLivestock = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddLivestock({
      ...livestockForm,
      farmId: farms[0]?.id || 'farm_1',
      userId: currentUser?.id || 'usr_farmer_1',
    });
    setShowLivestockModal(false);
    setLivestockForm({
      tagNumber: '',
      animalType: 'Dairy Cow',
      breed: '',
      count: 1,
      healthStatus: 'Healthy',
      feedingSchedule: '',
      milkYieldLpd: 15,
      lastVeterinaryCheck: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleCreateFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialForm.amount) return;
    await onAddFinancial({
      ...financialForm,
      amount: Number(financialForm.amount),
      userId: currentUser?.id || 'usr_farmer_1',
    });
    setShowFinancialModal(false);
    setFinancialForm({
      type: 'expense',
      category: 'Fertilizer',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Precision Agricultural Records
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
            Farm Management System
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage your registered holdings, crop vegetative stages, livestock herd health, and daily income-expense ledger.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setSubTab('crops')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTab === 'crops'
                ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Crop Cycles ({crops.length})
          </button>
          <button
            onClick={() => setSubTab('livestock')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTab === 'livestock'
                ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Livestock ({livestock.length})
          </button>
          <button
            onClick={() => setSubTab('financials')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTab === 'financials'
                ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Financial Ledger
          </button>
          <button
            onClick={() => setSubTab('farms')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTab === 'farms'
                ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Farm Profile
          </button>
        </div>
      </div>

      {/* 1. Crops Tab */}
      {subTab === 'crops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">
              Active Field Plantings & Growth Timelines
            </h3>
            <button
              onClick={() => setShowCropModal(true)}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Crop Cycle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-800">{crop.variety}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        crop.healthStatus === 'Healthy'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {crop.healthStatus}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900">{crop.cropName}</h4>

                  <div className="mt-3 space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Acreage:</span>
                      <span className="font-mono font-medium">{crop.acreage} Acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Planting Date:</span>
                      <span className="font-mono">{crop.plantingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Target Harvest:</span>
                      <span className="font-mono font-medium text-emerald-900">
                        {crop.expectedHarvestDate || 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Current Stage:</span>
                      <span className="font-semibold text-emerald-800">{crop.stage}</span>
                    </div>
                  </div>

                  {crop.notes && (
                    <p className="mt-3 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      {crop.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">Managed Block</span>
                  <button
                    onClick={() => onDeleteCrop(crop.id)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Livestock Tab */}
      {subTab === 'livestock' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">
              Livestock Herd Register & Veterinary Logs
            </h3>
            <button
              onClick={() => setShowLivestockModal(true)}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Livestock / Herd</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {livestock.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-emerald-800">
                      {item.tagNumber || 'BATCH-LOG'}
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                      {item.healthStatus}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900">
                    {item.animalType} ({item.count} head)
                  </h4>
                  <p className="text-xs text-stone-500 mb-3">{item.breed}</p>

                  <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                    {item.milkYieldLpd && (
                      <div className="flex justify-between items-center text-emerald-900 font-medium">
                        <span className="text-stone-500 flex items-center gap-1">
                          <Milk className="w-3.5 h-3.5 text-emerald-700" /> Daily Yield:
                        </span>
                        <span className="font-mono font-bold">{item.milkYieldLpd} L / day</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-400">Last Vet Check:</span>
                      <span className="font-mono">{item.lastVeterinaryCheck}</span>
                    </div>
                  </div>

                  {item.feedingSchedule && (
                    <div className="mt-3 text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      <span className="font-medium text-stone-700 block mb-0.5">Feeding Regimen:</span>
                      {item.feedingSchedule}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">Vaccinated & Monitored</span>
                  <button
                    onClick={() => onDeleteLivestock(item.id)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Financial Ledger Tab */}
      {subTab === 'financials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Farm Financial Ledger & Profitability
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Keep accurate tabs on seed, fertilizer, machinery, and produce receipts.
              </p>
            </div>
            <button
              onClick={() => setShowFinancialModal(true)}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Income / Expense</span>
            </button>
          </div>

          {/* Quick Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500">Total Produce Sales (Income)</span>
              <div className="text-xl font-bold text-emerald-900 font-mono tabular-nums mt-1">
                KSh {totalIncome.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500">Operating Expenses</span>
              <div className="text-xl font-bold text-amber-800 font-mono tabular-nums mt-1">
                KSh {totalExpense.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500">Net Farm Profit / Cash Margin</span>
              <div
                className={`text-xl font-bold font-mono tabular-nums mt-1 ${
                  netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                KSh {netBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Amount (KSh)</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {financials.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-stone-500 whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold capitalize ${
                            rec.type === 'income' ? 'text-emerald-800' : 'text-amber-800'
                          }`}
                        >
                          {rec.type === 'income' ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {rec.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-800">{rec.category}</td>
                      <td className="px-4 py-3 text-stone-600 max-w-xs truncate">
                        {rec.description}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono font-bold tabular-nums ${
                          rec.type === 'income' ? 'text-emerald-900' : 'text-stone-800'
                        }`}
                      >
                        {rec.type === 'income' ? '+' : '-'}
                        {rec.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onDeleteFinancial(rec.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Farms Profile Tab */}
      {subTab === 'farms' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs max-w-2xl">
          <h3 className="text-sm font-bold text-stone-900 mb-4">
            Registered Agricultural Land Holding
          </h3>

          {farms.length > 0 ? (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Farm Holding Name:</span>
                <span className="font-semibold text-stone-900">{farms[0].name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Location & Sub-County:</span>
                <span className="font-semibold text-stone-900">{farms[0].location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Total Registered Acreage:</span>
                <span className="font-mono font-bold text-emerald-900">
                  {farms[0].sizeAcres} Acres
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Soil Classification:</span>
                <span className="font-semibold text-stone-900">{farms[0].soilType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Irrigation Infrastructure:</span>
                <span className="font-semibold text-stone-900">{farms[0].irrigationType}</span>
              </div>
              <div className="py-2">
                <span className="text-stone-500 block mb-1">Key Enterprise Notes:</span>
                <p className="text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-100">
                  {farms[0].notes || 'Primary grain and orchard production.'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500">No farm holding registered yet.</p>
          )}
        </div>
      )}

      {/* Modal: Add Crop Record */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">Add Crop Planting Record</h3>
              <button onClick={() => setShowCropModal(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>
            <form onSubmit={handleCreateCrop} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Crop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yellow Dent Hybrid Maize"
                  value={cropForm.cropName}
                  onChange={(e) => setCropForm({ ...cropForm, cropName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Variety *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. H6213 Highland"
                    value={cropForm.variety}
                    onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Acreage (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={cropForm.acreage}
                    onChange={(e) => setCropForm({ ...cropForm, acreage: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Planting Date</label>
                  <input
                    type="date"
                    value={cropForm.plantingDate}
                    onChange={(e) => setCropForm({ ...cropForm, plantingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Expected Harvest</label>
                  <input
                    type="date"
                    value={cropForm.expectedHarvestDate}
                    onChange={(e) => setCropForm({ ...cropForm, expectedHarvestDate: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Current Stage</label>
                  <select
                    value={cropForm.stage}
                    onChange={(e: any) => setCropForm({ ...cropForm, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Maturity">Maturity</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Health Status</label>
                  <select
                    value={cropForm.healthStatus}
                    onChange={(e: any) => setCropForm({ ...cropForm, healthStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Treated">Treated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Field Agronomy Notes</label>
                <textarea
                  rows={2}
                  placeholder="Record fertilizer dosage, soil moisture readings, or pest scouting..."
                  value={cropForm.notes}
                  onChange={(e) => setCropForm({ ...cropForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                >
                  Save Crop Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Livestock Record */}
      {showLivestockModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">Log Livestock Record</h3>
              <button onClick={() => setShowLivestockModal(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>
            <form onSubmit={handleCreateLivestock} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Animal Type</label>
                  <select
                    value={livestockForm.animalType}
                    onChange={(e: any) => setLivestockForm({ ...livestockForm, animalType: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Dairy Cow">Dairy Cow</option>
                    <option value="Goat">Goat</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Pig">Pig</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tag / Batch ID</label>
                  <input
                    type="text"
                    placeholder="e.g. KEN-NKR-095"
                    value={livestockForm.tagNumber}
                    onChange={(e) => setLivestockForm({ ...livestockForm, tagNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Holstein Friesian or Boer"
                    value={livestockForm.breed}
                    onChange={(e) => setLivestockForm({ ...livestockForm, breed: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Head Count</label>
                  <input
                    type="number"
                    min="1"
                    value={livestockForm.count}
                    onChange={(e) => setLivestockForm({ ...livestockForm, count: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Daily Milk (L/day)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={livestockForm.milkYieldLpd}
                    onChange={(e) => setLivestockForm({ ...livestockForm, milkYieldLpd: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Last Vet Check</label>
                  <input
                    type="date"
                    value={livestockForm.lastVeterinaryCheck}
                    onChange={(e) => setLivestockForm({ ...livestockForm, lastVeterinaryCheck: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Feeding Routine & Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Silage 60%, Lucerne hay 25%, Dairy meal 15%"
                  value={livestockForm.feedingSchedule}
                  onChange={(e) => setLivestockForm({ ...livestockForm, feedingSchedule: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLivestockModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                >
                  Save Animal Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Financial Record */}
      {showFinancialModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-900">Record Farm Transaction</h3>
              <button onClick={() => setShowFinancialModal(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>
            <form onSubmit={handleCreateFinancial} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Type *</label>
                  <select
                    value={financialForm.type}
                    onChange={(e: any) => setFinancialForm({ ...financialForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={financialForm.category}
                    onChange={(e) => setFinancialForm({ ...financialForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Labor">Labor</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Produce Sale">Produce Sale</option>
                    <option value="Vet Services">Vet Services</option>
                    <option value="Transport">Transport</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Amount (KSh) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 15000"
                  value={financialForm.amount}
                  onChange={(e) => setFinancialForm({ ...financialForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 bags DAP fertilizer purchased from Agrovet"
                  value={financialForm.description}
                  onChange={(e) => setFinancialForm({ ...financialForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  value={financialForm.date}
                  onChange={(e) => setFinancialForm({ ...financialForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFinancialModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
