# PS4 EAN Bar Codes Scraper

## 📌 Description
This Google Apps Script automates the extraction of product details (**EAN, language, publisher, availability**, etc.) from the **Gamefinity** website and saves them into a **Google Sheets** document. It also includes a reset function to clear the last processed row, allowing for reprocessing when needed.

## 🚀 Features
✅ Scrapes product details from Gamefinity.
✅ Extracts information such as **EAN, language version, cover language, publisher, release date, platform, and availability**.
✅ Saves the extracted data directly into Google Sheets.
✅ Includes a **reset function** to restart processing from the first row.

## 🛠 Installation
1. Open **Google Sheets**.
2. Click **`Extensions > Apps Script`**.
3. Copy and paste the script files into the Apps Script editor.
4. Save and run the necessary functions.

## 📖 Usage
### ▶️ Fetch product details
Run the following function in the Apps Script editor:
```javascript
pobierzEANdlaWszystkich_v2();
```
This will scrape data and populate the spreadsheet.

### 🔄 Reset last processed row
If you need to restart the process from the first row, run:
```javascript
resetLastProcessedRow();
```

## 📂 File Structure
```
/your-repository
│── fetch_product_data.gs      # Fetches product details from Gamefinity
│── reset_processed_row.gs     # Resets the last processed row for reprocessing
│── utils.gs                   # Utility functions for extracting product details
│── README.md                  # Documentation for setup and usage
```

## ⚠️ Notes
⚡ **Ensure your Google Sheets has the necessary column structure before running the script.**
⚡ **Google Apps Script has execution time limits**, so consider running the scraper in batches if needed.

## 📜 License
**MIT License**

