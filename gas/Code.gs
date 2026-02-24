// ============================================================
// Signal App - Google Apps Script バックエンド
// ============================================================

var SHEET_NAME = 'daily_check';
var CONFIG_SHEET = 'config';

// ヘッダー列の定義（順序通り）
var HEADERS = [
  'date', 'timestamp', 'q_sleep', 'q_appetite', 'q_social',
  'q_motivation', 'q_body', 'q_self_eval', 'total_score',
  'c_count', 'alerts', 'memo'
];

/**
 * CORS対応レスポンスヘッダーを付与してJSONを返す
 */
function jsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * GETリクエスト: データ読み出し
 * ?action=read&pin=XXXX&days=30
 */
function doGet(e) {
  try {
    var params = e.parameter;
    var action = params.action;
    var pin = params.pin;
    var days = parseInt(params.days || '30', 10);

    if (!verifyPin(pin)) {
      return jsonResponse({ error: 'Unauthorized' });
    }

    if (action === 'read') {
      var records = readRecords(days);
      return jsonResponse({ data: records });
    }

    return jsonResponse({ error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

/**
 * POSTリクエスト: データ書き込み
 * body: { action: "write", pin: "XXXX", data: {...} }
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var pin = body.pin;
    var data = body.data;

    if (!verifyPin(pin)) {
      return jsonResponse({ error: 'Unauthorized' });
    }

    if (action === 'write') {
      writeRecord(data);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

/**
 * PIN検証
 * configシートのA2セルに保存されたPINと比較
 */
function verifyPin(pin) {
  if (!pin) return false;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName(CONFIG_SHEET);
  if (!configSheet) return false;
  var storedPin = configSheet.getRange('B2').getValue().toString();
  return pin === storedPin;
}

/**
 * レコードを書き込む（同日は上書き）
 */
function writeRecord(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }

  // ヘッダー行チェック
  var headerRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (headerRow[0] !== 'date') {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  var targetDate = data.date;
  var lastRow = sheet.getLastRow();
  var existingRow = -1;

  // 同日レコードの検索
  if (lastRow > 1) {
    var dates = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < dates.length; i++) {
      var cellDate = (dates[i][0] instanceof Date)
        ? Utilities.formatDate(dates[i][0], Session.getScriptTimeZone(), 'yyyy-MM-dd')
        : dates[i][0].toString();
      if (cellDate === targetDate) {
        existingRow = i + 2; // 1-indexed + ヘッダー行
        break;
      }
    }
  }

  var row = HEADERS.map(function(key) {
    return data[key] !== undefined ? data[key] : '';
  });

  if (existingRow > 0) {
    // 上書き
    sheet.getRange(existingRow, 1, 1, HEADERS.length).setValues([row]);
  } else {
    // 新規追加
    sheet.appendRow(row);
  }
}

/**
 * 直近N日分のレコードを読み出す
 */
function readRecords(days) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet || sheet.getLastRow() <= 1) return [];

  var lastRow = sheet.getLastRow();
  var numRows = lastRow - 1;
  var rawData = sheet.getRange(2, 1, numRows, HEADERS.length).getValues();

  var cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  var cutoffStr = Utilities.formatDate(cutoffDate, 'Asia/Tokyo', 'yyyy-MM-dd');

  var records = [];
  for (var i = 0; i < rawData.length; i++) {
    var row = rawData[i];
    if (!row[0]) continue; // 日付が空の行はスキップ
    var dateStr = (row[0] instanceof Date)
      ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'yyyy-MM-dd')
      : row[0].toString();
    if (dateStr >= cutoffStr) {
      var record = {};
      for (var j = 0; j < HEADERS.length; j++) {
        var key = HEADERS[j];
        var val = row[j];
        // SpreadsheetのDateオブジェクトを文字列に変換
        if (key === 'date' && val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        } else if (key === 'timestamp' && val instanceof Date) {
          val = val.toISOString();
        }
        record[key] = val;
      }
      records.push(record);
    }
  }

  // 日付昇順でソート
  records.sort(function(a, b) {
    return a.date > b.date ? 1 : -1;
  });

  return records;
}

/**
 * 初期セットアップ: シートと設定を作成する
 * スクリプトエディタから手動実行してください
 */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // daily_checkシート
  var dataSheet = ss.getSheetByName(SHEET_NAME);
  if (!dataSheet) {
    dataSheet = ss.insertSheet(SHEET_NAME);
  }
  dataSheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  dataSheet.setFrozenRows(1);

  // configシート
  var configSheet = ss.getSheetByName(CONFIG_SHEET);
  if (!configSheet) {
    configSheet = ss.insertSheet(CONFIG_SHEET);
  }
  configSheet.getRange('A1').setValue('設定項目');
  configSheet.getRange('B1').setValue('値');
  configSheet.getRange('A2').setValue('PIN');
  configSheet.getRange('B2').setValue('1234'); // ← ここを変更してください

  SpreadsheetApp.getUi().alert('セットアップ完了！configシートのB2セルでPINを変更してください。');
}
