function showPopup() {

    const totalElement = document.getElementById("total");
    const modalTotalElement = document.getElementById("modalTotal");
    modalTotalElement.textContent = totalElement.textContent;
  

    document.getElementById('popupModal').style.display = 'block';
  }
  
  function closePopup() {

    document.getElementById('popupModal').style.display = 'none';
  }