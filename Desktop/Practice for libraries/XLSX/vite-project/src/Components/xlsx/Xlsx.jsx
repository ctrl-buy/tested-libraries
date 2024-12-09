import React, { useState } from 'react';
import { ExcelRenderer } from '../../util/fileReader';
export default function Xlsx() {
    let [fileData, setFileData] = useState();
    let [error, setError] = useState();

    // Functions
    let handleFileInput = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (!file) {
            setError('please upload a file');
            return
        }
        ExcelRenderer(file, 'SalesOrders', (err, data) => {
            if (err) {
                console.error("Error reading Excel file:", err);
                setError("Error reading the file.");
            } else {
                console.log("Excel data:", data);
                setFileData(data);
                setError(null);
            }
        })
    }

    return (

        <div>
            <h2>Excel File Upload</h2>
            <input
                type="file"
                accept=".xls, .xlsx"
                onChange={handleFileInput}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {fileData && (
                <div>
                    <h3>Extracted Data:</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                {fileData.cols.map((col) => (
                                    <th key={col.key}>{col.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {fileData.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell || ''}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
