import * as XLSX from 'xlsx';
import { menuItems, branches } from '../lib/data';
import { MenuItem, Branch } from '../lib/types';

const menuData = menuItems.map((item: MenuItem) => ({
    'Item ID': item.id,
    'Name': item.name,
    'Description': item.description,
    'Price (₹)': item.price,
    'Discount (%)': item.discount,
    'Final Price (₹)': item.price - (item.price * item.discount / 100),
    'Category': item.category,
    'Food Type': item.foodType,
    'Image Path': item.image,
    'Branches': item.branch.map((branchId: string) => branches.find((b: Branch) => b.id === branchId)?.name.replace('Sangem Hotels - ', '')).join(', '),
    'Is Special': item.isSpecial ? 'Yes' : 'No',
    'Available': item.available ? 'Yes' : 'No',
    'Rating': item.rating
}));

const branchData = branches.map((branch: Branch) => ({
    'Branch ID': branch.id,
    'Name': branch.name,
    'Address': branch.address,
    'Phone': branch.phone,
    'Latitude': branch.coordinates.lat,
    'Longitude': branch.coordinates.lng,
    'Opening Hours': branch.openHours
}));

const menuWorksheet = XLSX.utils.json_to_sheet(menuData);
const branchWorksheet = XLSX.utils.json_to_sheet(branchData);

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, menuWorksheet, 'Menu Items');
XLSX.utils.book_append_sheet(workbook, branchWorksheet, 'Branches');

XLSX.writeFile(workbook, 'sangem-hotels-data.xlsx');
