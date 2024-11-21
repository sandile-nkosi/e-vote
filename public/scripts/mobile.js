const mobileMenuBtnElement = document.getElementById("mobile-menu-btn");
const mobileMenuElement = document.getElementById("mobile-menu");

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle('open');
}

function closeMobileMenu() {
  mobileMenuElement.classList.remove('open');
}


window.addEventListener('scroll', () => {
  if (mobileMenuElement.classList.contains('open')) {
    closeMobileMenu();
  }
});


document.addEventListener('click', (event) => {
  const isClickInsideMenu = mobileMenuElement.contains(event.target);
  const isClickOnToggleBtn = mobileMenuBtnElement.contains(event.target);
  
  if (!isClickInsideMenu && !isClickOnToggleBtn && 
      mobileMenuElement.classList.contains('open')) {
    closeMobileMenu();
  }
});

mobileMenuBtnElement.addEventListener('click', (event) => {
  event.stopPropagation(); 
  toggleMobileMenu();
});