import React, { useState, useEffect } from 'react';
import Lookup from './components/Lookup';
import DataEntry from './components/DataEntry';
import DataManagement from './components/DataManagement';
import { FengShuiData, Category } from './types';
import { Compass, Upload, Download } from 'lucide-react';
import databaseData from './database.json';

function App() {
  const [data, setData] = useState<Record<Category, FengShuiData[]>>(databaseData);
  const [activeTab, setActiveTab] = useState<'lookup' | 'dataEntry' | 'dataManagement'>('lookup');

  const saveData = (newData: Record<Category, FengShuiData[]>) => {
    setData(newData);
    localStorage.setItem('fengShuiData', JSON.stringify(newData));
    console.log('Dữ liệu mới:', JSON.stringify(newData, null, 2));
  };

  const handleSave = (category: Category, newData: FengShuiData) => {
    const updatedData = {
      ...data,
      [category]: [...data[category], newData],
    };
    saveData(updatedData);
  };

  const handleEdit = (category: Category, id: string, updatedData: FengShuiData) => {
    const updatedCategory = data[category].map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    const newData = { ...data, [category]: updatedCategory };
    saveData(newData);
  };

  const handleDelete = (category: Category, id: string) => {
    const updatedCategory = data[category].filter((item) => item.id !== id);
    const newData = { ...data, [category]: updatedCategory };
    saveData(newData);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const importedData = JSON.parse(content);
          saveData(importedData);
          alert('Dữ liệu đã được nhập thành công!');
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu:', error);
          alert(`Có lỗi xảy ra khi nhập dữ liệu. Chi tiết lỗi: ${(error as Error).message}. Vui lòng kiểm tra file và thử lại.`);
        }
      };
      reader.onerror = (error) => {
        console.error('Lỗi khi đọc file:', error);
        alert('Có lỗi xảy ra khi đọc file. Vui lòng thử lại.');
      };
      reader.readAsText(file);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'feng_shui_data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-700 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Compass className="mr-2" size={24} />
            <h1 className="text-2xl font-bold">Hệ thống Tham khảo Phong thủy</h1>
          </div>
          <div className="flex items-center">
            <label htmlFor="import-data" className="cursor-pointer flex items-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded mr-2">
              <Upload size={20} className="mr-2" />
              Nhập dữ liệu
            </label>
            <input
              id="import-data"
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
            <button
              onClick={handleExportData}
              className="flex items-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded"
            >
              <Download size={20} className="mr-2" />
              Xuất dữ liệu
            </button>
          </div>
        </div>
      </header>
      <nav className="bg-amber-600 text-white">
        <div className="container mx-auto flex">
          <button
            className={`px-4 py-2 ${activeTab === 'lookup' ? 'bg-amber-800' : ''}`}
            onClick={() => setActiveTab('lookup')}
          >
            Tra cứu
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'dataEntry' ? 'bg-amber-800' : ''}`}
            onClick={() => setActiveTab('dataEntry')}
          >
            Nhập dữ liệu
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'dataManagement' ? 'bg-amber-800' : ''}`}
            onClick={() => setActiveTab('dataManagement')}
          >
            Quản lý dữ liệu
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        {activeTab === 'lookup' && <Lookup data={data} />}
        {activeTab === 'dataEntry' && <DataEntry onSave={handleSave} />}
        {activeTab === 'dataManagement' && (
          <DataManagement data={data} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

export default App;