import * as XLSX from 'xlsx';

export const ExcelRenderer = (file, sheet_name, callback) => {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        var rABS = !!reader.readAsBinaryString;
        reader.onload = function(e) {
            /* Parse data */
            var bstr = e.target.result;
            var wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });

            let wsname;
            const filtered_names = wb.SheetNames.filter(name => name.trim() === sheet_name.trim())
            if (filtered_names.length > 0) {
                wsname = filtered_names[0]
            } else {
                wsname = wb.SheetNames[0]
            }

            var ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            var json = XLSX.utils.sheet_to_json(ws, { header: 1 });
            var cols = make_cols(ws["!ref"]);

            var data = { rows: json, cols: cols };

            resolve(data);
            return callback(null, data);
        };
        if (file && rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    });
}

const make_cols = (refstr) => {
    var o = [],
        C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) {
        o[i] = { name: XLSX.utils.encode_col(i), key: i };
    }
    return o;
}