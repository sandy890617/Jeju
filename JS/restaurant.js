document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".restaurant-card");

  // 初始化：預設僅顯示「北區」
  filterRestaurants("north");

  // 為每個按鈕綁定點擊事件
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. 切換按鈕 active 狀態
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 2. 取得點擊的地區 data-region 屬性
      const targetRegion = button.dataset.region;

      // 3. 執行篩選
      filterRestaurants(targetRegion);
    });
  });

  /**
   * 根據地區代碼切換顯示/隱藏卡片
   * @param {string} region
   */
  function filterRestaurants(region) {
    cards.forEach((card) => {
      const cardRegion = card.dataset.region;

      if (cardRegion === region) {
        card.classList.remove("is-hidden");
      } else {
        card.classList.add("is-hidden");
      }
    });
  }
});