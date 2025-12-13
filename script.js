document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('numbersInput');
  const resultDiv = document.getElementById('result');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');

  let timeoutId;

  input.addEventListener('input', () => {
    clearTimeout(timeoutId);

    if (input.value.trim() === '') {
      hideResults();
      return;
    }

    resultDiv.innerHTML = '<div class="loading">Processing numbers...</div>';
    resultDiv.classList.add('visible');

    timeoutId = setTimeout(() => {
      processNumbers();
    }, 300);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    hideResults();
    input.focus();

    clearBtn.classList.add('highlight');
    setTimeout(() => clearBtn.classList.remove('highlight'), 500);
  });

  copyBtn.addEventListener('click', () => {
    if (
      resultDiv.innerHTML.trim() === '' ||
      !resultDiv.classList.contains('visible')
    ) {
      showNotification('There are no results to copy.');
      return;
    }

    const tempEl = document.createElement('div');
    tempEl.innerHTML = resultDiv.innerHTML;

    const textToCopy = tempEl.textContent
      .replace('Unique numbers (no duplicates):', '')
      .trim();

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showNotification('Unique numbers copied successfully.');

        copyBtn.classList.add('highlight');
        setTimeout(() => copyBtn.classList.remove('highlight'), 500);
      })
      .catch(() => {
        showNotification('Failed to copy.');
      });
  });

  function processNumbers() {
    const value = input.value.trim();

    if (value === '') {
      hideResults();
      return;
    }

    const lines = value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    const countMap = {};

    for (let number of lines) {
      countMap[number] = (countMap[number] || 0) + 1;
    }

    const uniqueNumbers = Object.keys(countMap).filter(
      number => countMap[number] === 1
    );

    if (uniqueNumbers.length > 0) {
      let html = '<strong>Unique numbers (no duplicates):</strong>';

      uniqueNumbers.forEach((number, index) => {
        html += `
          <div class="duplicate-item" style="animation-delay:${index * 50}ms">
            ${number}
          </div>
        `;
      });

      resultDiv.innerHTML = html;
    } else {
      resultDiv.innerHTML = 'There are no unique numbers.';
    }

    resultDiv.classList.add('visible');
  }

  function hideResults() {
    resultDiv.classList.remove('visible');
    setTimeout(() => {
      if (!resultDiv.classList.contains('visible')) {
        resultDiv.innerHTML = '';
      }
    }, 500);
  }

  function showNotification(message) {
    const existing = document.querySelector('.copy-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    },
