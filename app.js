// Basic JavaScript to handle menu tab switching, "See More/Less" functionality, Room Card Expansion, and Theme Toggling
document.addEventListener('DOMContentLoaded', () => {
  // --- Menu Tab Switching and See More/Less (for main menu) ---
  const tabs = document.querySelectorAll('.menu-tab');
  const menuCategories = document.querySelectorAll('.menu-category');
  const seeMoreBtn = document.getElementById('see-more-menu-btn'); // This is for the main menu items
  const seeMoreIcon = seeMoreBtn ? seeMoreBtn.querySelector('i') : null;

  // Keep track of whether extra items are shown in the main menu
  let extraItemsShown = false;

  // Function to show the active menu and hide others
  const showActiveMenu = (activeMenuId) => {
    menuCategories.forEach(category => {
      if (category.id === activeMenuId) {
        category.style.display = 'flex'; // Use flex to maintain row layout

        // Reset "See More" button state for the new category
        extraItemsShown = false;
        const hiddenItems = category.querySelectorAll('.hidden-menu-item');
        if (hiddenItems.length > 0) {
          if (seeMoreBtn) { // Check if the button exists
            seeMoreBtn.style.display = 'block'; // Show the See More button
            seeMoreBtn.innerHTML = 'See More Menu Items <i class="fas fa-arrow-down"></i>'; // Reset button text and icon
          }
          // Ensure hidden items are actually hidden when switching categories
          hiddenItems.forEach(item => item.style.display = 'none');
        } else {
           if (seeMoreBtn) { // Check if the button exists
             seeMoreBtn.style.display = 'none'; // Hide the See More button if no hidden items
           }
        }
      } else {
        category.style.display = 'none';
      }
    });
  };

  // Initial display: show the breakfast menu
  showActiveMenu('breakfast-menu');


  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to the clicked tab
      tab.classList.add('active');

      // Show the selected menu category
      const targetMenuId = tab.getAttribute('data-menu') + '-menu';
      showActiveMenu(targetMenuId);
    });
  });

  // Event listener for the See More/Less button (for main menu)
  if (seeMoreBtn) { // Check if the button exists
    seeMoreBtn.addEventListener('click', () => {
      // Find the currently active menu category
      const activeMenu = document.querySelector('.menu-category[style*="display: flex"]'); // Find the one with display: flex

      if (activeMenu) {
        const hiddenItems = activeMenu.querySelectorAll('.hidden-menu-item');

        if (extraItemsShown) {
          // Hide extra items
          hiddenItems.forEach(item => {
            item.style.display = 'none';
          });
          seeMoreBtn.innerHTML = 'See More Menu Items <i class="fas fa-arrow-down"></i>'; // Change text and icon
          extraItemsShown = false;
        } else {
          // Show extra items
          hiddenItems.forEach(item => {
            item.style.display = 'block'; // Or 'flex' depending on desired layout
            // No need to remove the class, we use it to identify items to toggle
          });
          seeMoreBtn.innerHTML = 'See Less Menu Items <i class="fas fa-arrow-up"></i>'; // Change text and icon
          extraItemsShown = true;
        }
      }
    });
  }

  // --- Room Card Expansion ---
  const roomCards = document.querySelectorAll('.room-card');
  const roomExpansionPanel = document.getElementById('room-expansion-panel');
  const viewDetailsButtons = document.querySelectorAll('.view-details-btn'); // Select all "View Details" buttons

  const handleRoomExpansion = (card) => {
       // Check if the clicked card is already the source of the currently expanded panel
      const isCurrentlyExpanded = roomExpansionPanel.classList.contains('expanded') &&
                                  roomExpansionPanel.dataset.sourceCardId === card.id;

      // Close any currently expanded card and the expansion panel
      roomCards.forEach(otherCard => {
        otherCard.classList.remove('expanded');
      });
      roomExpansionPanel.classList.remove('expanded');
      // Clear the content after transition for smoother collapse
      roomExpansionPanel.addEventListener('transitionend', function handler() {
           if (!roomExpansionPanel.classList.contains('expanded')) {
               roomExpansionPanel.innerHTML = ''; // Clear content only when collapsing
               roomExpansionPanel.dataset.sourceCardId = ''; // Clear the source card ID
               roomExpansionPanel.removeEventListener('transitionend', handler);
           }
      });


      if (!isCurrentlyExpanded) {
        // If the clicked card was not the source of the currently expanded panel, expand it
        card.classList.add('expanded');

        // Get the details content from the clicked card
        const roomDetails = card.querySelector('.room-details');

        // Populate the external expansion panel with the details content
        if (roomDetails) {
          roomExpansionPanel.innerHTML = roomDetails.innerHTML;
          roomExpansionPanel.dataset.sourceCardId = card.id; // Store the source card ID
          // Use a small delay to allow the DOM update before starting the transition
          setTimeout(() => {
             roomExpansionPanel.classList.add('expanded');
             // Optional: Scroll to the expansion panel
             roomExpansionPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 10); // Small delay
        }
      }
       // If it was the currently expanded card, clicking again already collapsed it above.
  };


  roomCards.forEach(card => {
    // Add event listener to the card itself
    card.addEventListener('click', () => {
        handleRoomExpansion(card);
    });
  });

  // Add event listeners to the "View Details" buttons
  viewDetailsButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent default link behavior
          const card = button.closest('.room-card'); // Find the parent room card
          if (card) {
              handleRoomExpansion(card);
          }
      });
  });

  // --- Wine and Liquor Menu Expansion (in Special Events section) ---
  const wineBottleListContainer = document.getElementById('wine-bottle-list-container');
  const liquorListContainer = document.getElementById('liquor-list-container'); // Get the new liquor list container
  const seeFullWineMenuBtn = document.getElementById('see-full-wine-menu-btn');

  if (wineBottleListContainer && liquorListContainer && seeFullWineMenuBtn) {
      // Initially collapse both lists
      wineBottleListContainer.style.maxHeight = '0';
      wineBottleListContainer.style.opacity = '0';
      liquorListContainer.style.maxHeight = '0'; // Collapse liquor list initially
      liquorListContainer.style.opacity = '0'; // Hide liquor list initially


      seeFullWineMenuBtn.addEventListener('click', () => {
          const isCollapsed = wineBottleListContainer.style.maxHeight === '0px'; // Check collapse state based on wine list

          if (isCollapsed) {
              // Expand both lists
              wineBottleListContainer.style.maxHeight = '1000px'; // Sufficient height
              wineBottleListContainer.style.opacity = '1';
              liquorListContainer.style.maxHeight = '1000px'; // Expand liquor list
              liquorListContainer.style.opacity = '1'; // Show liquor list
              seeFullWineMenuBtn.innerHTML = 'See Less Menu <i class="fas fa-arrow-up"></i>';
          } else {
              // Collapse both lists
              wineBottleListContainer.style.maxHeight = '0';
              wineBottleListContainer.style.opacity = '0';
              liquorListContainer.style.maxHeight = '0'; // Collapse liquor list
              liquorListContainer.style.opacity = '0'; // Hide liquor list

              // Clear content after transition for smoother collapse (optional, but good practice)
              wineBottleListContainer.addEventListener('transitionend', function handler() {
                  if (wineBottleListContainer.style.maxHeight === '0px') {
                      // No need to clear innerHTML here, as content is always present but hidden/collapsed
                      wineBottleListContainer.removeEventListener('transitionend', handler);
                  }
              });
               liquorListContainer.addEventListener('transitionend', function handler() {
                  if (liquorListContainer.style.maxHeight === '0px') {
                      // No need to clear innerHTML here
                      liquorListContainer.removeEventListener('transitionend', handler);
                  }
              });

              seeFullWineMenuBtn.innerHTML = 'See Full Menu <i class="fas fa-arrow-down"></i>';
          }
      });
  }

  // --- Theme Toggler Logic ---
  const themeToggler = document.getElementById('theme-toggler');
  const body = document.body;
  const togglerIcon = themeToggler ? themeToggler.querySelector('i') : null;

  // Check for saved theme preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark-mode') {
      body.classList.add('dark-mode');
      if (togglerIcon) {
          togglerIcon.classList.remove('fa-moon');
          togglerIcon.classList.add('fa-sun');
      }
  } else {
       // Ensure light mode is the default if no preference or preference is not dark-mode
       body.classList.remove('dark-mode');
       if (togglerIcon) {
           togglerIcon.classList.remove('fa-sun');
           togglerIcon.classList.add('fa-moon');
       }
  }


  if (themeToggler && togglerIcon) {
      themeToggler.addEventListener('click', () => {
          body.classList.toggle('dark-mode');

          // Update icon and save preference to localStorage
          if (body.classList.contains('dark-mode')) {
              togglerIcon.classList.remove('fa-moon');
              togglerIcon.classList.add('fa-sun');
              localStorage.setItem('theme', 'dark-mode');
          } else {
              togglerIcon.classList.remove('fa-sun');
              togglerIcon.classList.add('fa-moon');
              localStorage.setItem('theme', 'light-mode');
          }
      });
  }
});
