const CSV_QUOTE = '"';
const CSV_DELIMITER = ',';
const CSV_ROW_BREAK = '\r\n';

export function escapeCsvValue(value) {
  const stringValue = String(value ?? '');

  if (/[",\r\n]/.test(stringValue)) {
    return `${CSV_QUOTE}${stringValue.replace(/"/g, '""')}${CSV_QUOTE}`;
  }

  return stringValue;
}

export function serializeCsv(rows) {
  return rows
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(CSV_DELIMITER))
    .join(CSV_ROW_BREAK);
}

export function parseCsv(content) {
  const normalizedContent = content.replace(/^\uFEFF/, '');
  const rows = [];
  let currentRow = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let index = 0; index < normalizedContent.length; index += 1) {
    const character = normalizedContent[index];

    if (character === CSV_QUOTE) {
      const isEscapedQuote = insideQuotes && normalizedContent[index + 1] === CSV_QUOTE;

      if (isEscapedQuote) {
        currentValue += CSV_QUOTE;
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === CSV_DELIMITER && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((character === '\n' || character === '\r') && !insideQuotes) {
      if (character === '\r' && normalizedContent[index + 1] === '\n') {
        index += 1;
      }

      currentRow.push(currentValue);
      currentValue = '';

      if (currentRow.some((cell) => cell.length > 0) || currentRow.length > 0) {
        rows.push(currentRow);
      }

      currentRow = [];
      continue;
    }

    currentValue += character;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows;
}
