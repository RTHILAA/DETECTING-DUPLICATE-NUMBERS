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
      
      resultDiv.innerHTML = '<div class="loading">Searching for duplicate numbers...</div>';
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
      setTimeout(() => {
        clearBtn.classList.remove('highlight');
      }, 500);
    });
    
    copyBtn.addEventListener('click', () => {
      if (resultDiv.innerHTML.trim() === '' || !resultDiv.classList.contains('visible')) {
        showNotification('There are no results to copy.');
        return;
      }
      
      const tempEl = document.createElement('div');
      tempEl.innerHTML = resultDiv.innerHTML;
      
      const textToCopy = tempEl.textContent.trim();
      
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          showNotification('Results copied successfully.');
          
          copyBtn.classList.add('highlight');
          setTimeout(() => {
            copyBtn.classList.remove('highlight');
          }, 500);
        })
        .catch(err => {
          showNotification('An error occurred while copying.');
          console.error('Failed to copy: ', err);
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
      const duplicates = [];
      
      for (let number of lines) {
        countMap[number] = (countMap[number] || 0) + 1;
      }
      
      for (let number in countMap) {
        if (countMap[number] > 1) {
          duplicates.push({
            number: number,
            count: countMap[number]
          });
        }
      }
      
      duplicates.sort((a, b) => b.count - a.count);
      
      if (duplicates.length > 0) {
        let html = '<strong>Duplicate numbers :</strong>';
        
        duplicates.forEach((item, index) => {
          const delay = index * 100;
          html += `<div class="duplicate-item" style="animation-delay: ${delay}ms">
            <span class="count-badge">${item.count}</span>
            ${item.number}
          </div>`;
        });
        
        resultDiv.innerHTML = html;
      } else {
        resultDiv.innerHTML = "There are no duplicate numbers.";
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
      const existingNotification = document.querySelector('.copy-notification');
      if (existingNotification) {
        document.body.removeChild(existingNotification);
      }
      
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 2000);
    }
  });