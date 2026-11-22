/**
 * WEB DEVELOPMENT AGENCY — Portfolio Filtering & Project Gallery Interactions
 * Vanilla JavaScript: Multi-Category Filter, Search Filter
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const projectSearchInput = document.getElementById('projectSearchInput');

  let activeCategory = 'all';
  let searchTerm = '';

  const filterProjects = () => {
    let matchCount = 0;

    portfolioItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category') || '';
      const itemTitle = (item.querySelector('.portfolio-title')?.textContent || '').toLowerCase();
      const itemDesc = (item.querySelector('.portfolio-desc')?.textContent || '').toLowerCase();

      const matchesCat = activeCategory === 'all' || itemCategory.includes(activeCategory);
      const matchesSearch = !searchTerm || itemTitle.includes(searchTerm) || itemDesc.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        item.style.display = 'flex';
        // Add subtle entrance animation
        item.style.animation = 'fadeIn 0.35s ease forwards';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const noResultsMsg = document.getElementById('noResultsMsg');
    if (noResultsMsg) {
      noResultsMsg.style.display = matchCount === 0 ? 'block' : 'none';
    }
  };

  // Filter Buttons Click
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter') || 'all';
        filterProjects();
      });
    });
  }

  // Project Search Input
  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterProjects();
    });
  }
});
