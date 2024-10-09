const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, 'src', 'database.json');
const newDataPath = path.join(__dirname, 'new-data.json');

// Đọc dữ liệu hiện tại
const currentData = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Đọc dữ liệu mới
const newData = JSON.parse(fs.readFileSync(newDataPath, 'utf8'));

// Merge dữ liệu
const mergedData = {
  CửuTinh: [...currentData.CửuTinh, ...newData.CửuTinh],
  BátMôn: [...currentData.BátMôn, ...newData.BátMôn],
  BátThần: [...currentData.BátThần, ...newData.BátThần],
  CáchCục: [...currentData.CáchCục, ...newData.CáchCục],
};

// Ghi dữ liệu đã merge vào file database.json
fs.writeFileSync(databasePath, JSON.stringify(mergedData, null, 2));

console.log('Dữ liệu đã được cập nhật thành công!');