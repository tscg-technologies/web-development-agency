/**
 * WEB DEVELOPMENT AGENCY — User Interactions & Form Handlers
 * Vanilla JavaScript: FAQ Accordion, Multi-Step Form, Contact Validation, Demo Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. FAQ & Accordion Interaction
  // ==========================================================================
  const accordionButtons = document.querySelectorAll('.faq-question, .accordion-header, .accordion-toggle');

  accordionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.faq-item, .accordion-item');
      if (!parent) return;

      const isOpen = parent.classList.contains('active');

      // Close all other accordions in the same list/container
      const container = parent.closest('.faq-list, .accordion') || parent.parentElement;
      if (container) {
        const siblingItems = container.querySelectorAll('.faq-item, .accordion-item');
        siblingItems.forEach(item => {
          if (item !== parent) {
            item.classList.remove('active');
            const siblingBtn = item.querySelector('.faq-question, .accordion-header, .accordion-toggle');
            if (siblingBtn) siblingBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Toggle current
      if (isOpen) {
        parent.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        parent.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================================================
  // 2. Contact Form & Service Pills (contact.html)
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const demoSuccessModal = document.getElementById('demoSuccessModal');

  // Interactive Service Selection Pills
  const servicePills = document.querySelectorAll('.service-pill-btn');
  const serviceInput = document.getElementById('serviceRequired') || document.getElementById('contactService');

  if (servicePills.length > 0 && serviceInput) {
    servicePills.forEach(pill => {
      pill.addEventListener('click', () => {
        servicePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const selectedVal = pill.getAttribute('data-service') || pill.textContent.trim();
        serviceInput.value = selectedVal;
        
        // Remove error if any
        const group = serviceInput.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  }

  // Global Modal Close Handlers
  if (demoSuccessModal) {
    const closeBtns = demoSuccessModal.querySelectorAll('#modalCloseBtn, .modal-close-btn, [data-close-modal]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        demoSuccessModal.classList.remove('active');
      });
    });

    demoSuccessModal.addEventListener('click', (e) => {
      if (e.target === demoSuccessModal) {
        demoSuccessModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoSuccessModal.classList.contains('active')) {
        demoSuccessModal.classList.remove('active');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fullName = document.getElementById('fullName') || document.getElementById('contactFullName');
      const email = document.getElementById('email') || document.getElementById('contactEmail');
      const phone = document.getElementById('phone') || document.getElementById('contactPhone');
      const service = document.getElementById('serviceRequired') || document.getElementById('contactService');
      const message = document.getElementById('projectMessage') || document.getElementById('contactMessage');
      const budgetRadio = document.querySelector('input[name="budget"]:checked');

      const validateField = (field, condition) => {
        if (!field) return;
        const group = field.closest('.form-group');
        if (!condition) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9+\s\-()]{7,20}$/;

      if (fullName) validateField(fullName, fullName.value.trim().length >= 2);
      if (email) validateField(email, emailRegex.test(email.value.trim()));
      if (phone) validateField(phone, phoneRegex.test(phone.value.trim()));
      if (service) validateField(service, service.value !== '');
      if (message) validateField(message, message.value.trim().length >= 8);

      if (isValid) {
        // Populate modal summary data if element exists
        const modalSummary = document.getElementById('modalSummaryData');
        if (modalSummary) {
          const serviceName = service ? service.value : 'Custom Web Development';
          const budgetVal = budgetRadio ? budgetRadio.value : 'Standard Scope';
          modalSummary.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div><strong>Client:</strong> ${fullName ? fullName.value.trim() : 'Prospective Client'}</div>
              <div><strong>Contact:</strong> ${email ? email.value.trim() : ''} • ${phone ? phone.value.trim() : ''}</div>
              <div><strong>Service:</strong> <span style="color: var(--accent-secondary);">${serviceName}</span></div>
              <div><strong>Budget Range:</strong> ${budgetVal}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Status: Inquiry logged & routed to technical strategy team</div>
            </div>
          `;
        }

        // Trigger Demo Success Modal
        if (demoSuccessModal) {
          demoSuccessModal.classList.add('active');
        } else {
          alert('Thank you! This is a demonstration form. In a live production environment, your enquiry would be securely transmitted.');
        }

        contactForm.reset();
        servicePills.forEach(p => p.classList.remove('active'));
      }
    });
  }

  // ==========================================================================
  // 3. Multi-Step Project Form (start-project.html)
  // ==========================================================================
  const multiStepForm = document.getElementById('multiStepForm');

  if (multiStepForm) {
    let currentStep = 1;
    const totalSteps = 5;

    const formSteps = document.querySelectorAll('.form-step');
    const stepNodes = document.querySelectorAll('.step-node');
    const progressBar = document.querySelector('.stepper-progress-bar');
    const nextBtn = document.getElementById('stepNextBtn');
    const prevBtn = document.getElementById('stepPrevBtn');
    const submitBtn = document.getElementById('stepSubmitBtn');

    // Collect Data for Step 5 Summary
    const summaryData = {
      name: '',
      email: '',
      phone: '',
      businessType: '',
      websiteType: '',
      pageCount: '',
      features: [],
      budget: '',
      timeline: ''
    };

    const updateStepView = () => {
      // Update form step visibility
      formSteps.forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'), 10);
        step.classList.toggle('active', stepNum === currentStep);
      });

      // Update step nodes indicator
      stepNodes.forEach(node => {
        const stepNum = parseInt(node.getAttribute('data-step'), 10);
        node.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
          node.classList.add('active');
        } else if (stepNum < currentStep) {
          node.classList.add('completed');
        }
      });

      // Update progress line
      if (progressBar) {
        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercent}%`;
      }

      // Button controls
      if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
      if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
      if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

      // If at step 5, populate summary
      if (currentStep === 5) {
        renderReviewSummary();
      }

      // Scroll form into view if needed
      multiStepForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const validateCurrentStep = () => {
      let valid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9+\s\-()]{7,20}$/;

      if (currentStep === 1) {
        const nameInput = document.getElementById('briefName');
        const emailInput = document.getElementById('briefEmail');
        const phoneInput = document.getElementById('briefPhone');

        const checkField = (input, cond) => {
          if (!input) return;
          const group = input.closest('.form-group');
          if (!cond) {
            valid = false;
            if (group) group.classList.add('has-error');
          } else {
            if (group) group.classList.remove('has-error');
          }
        };

        if (nameInput) checkField(nameInput, nameInput.value.trim().length >= 2);
        if (emailInput) checkField(emailInput, emailRegex.test(emailInput.value.trim()));
        if (phoneInput) checkField(phoneInput, phoneRegex.test(phoneInput.value.trim()));

        if (valid) {
          summaryData.name = nameInput.value.trim();
          summaryData.email = emailInput.value.trim();
          summaryData.phone = phoneInput.value.trim();
        }
      } else if (currentStep === 2) {
        const businessType = document.getElementById('briefBusinessType');
        const websiteType = document.querySelector('input[name="websiteType"]:checked');

        const busGroup = businessType ? businessType.closest('.form-group') : null;
        if (!businessType || businessType.value === '') {
          valid = false;
          if (busGroup) busGroup.classList.add('has-error');
        } else {
          if (busGroup) busGroup.classList.remove('has-error');
          summaryData.businessType = businessType.value;
        }

        if (websiteType) {
          summaryData.websiteType = websiteType.value;
        } else {
          valid = false;
          alert('Please select a website type to proceed.');
        }
      } else if (currentStep === 3) {
        const pages = document.getElementById('briefPages');
        if (pages) summaryData.pageCount = pages.value;

        const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
        summaryData.features = Array.from(featureCheckboxes).map(cb => cb.value);
      } else if (currentStep === 4) {
        const budget = document.querySelector('input[name="budgetRange"]:checked');
        const timeline = document.querySelector('input[name="timeline"]:checked');

        if (!budget || !timeline) {
          valid = false;
          alert('Please select both a budget estimate and preferred timeframe.');
        } else {
          summaryData.budget = budget.value;
          summaryData.timeline = timeline.value;
        }
      }

      return valid;
    };

    const renderReviewSummary = () => {
      const summaryBox = document.getElementById('briefReviewSummary');
      if (!summaryBox) return;

      summaryBox.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; text-align: left;">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Contact Details</span>
            <p style="color: var(--text-main); font-weight: 600; margin-top: 0.25rem;">${summaryData.name || 'Not provided'}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${summaryData.email || ''}<br>${summaryData.phone || ''}</p>
          </div>
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Project Type</span>
            <p style="color: var(--text-main); font-weight: 600; margin-top: 0.25rem;">${summaryData.websiteType || 'Custom Website'}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Industry: ${summaryData.businessType || 'General'}</p>
          </div>
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Scope & Requirements</span>
            <p style="color: var(--text-main); font-weight: 600; margin-top: 0.25rem;">${summaryData.pageCount || 'Multi-page'}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Features: ${summaryData.features.length > 0 ? summaryData.features.join(', ') : 'Standard features'}</p>
          </div>
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Timeline & Budget</span>
            <p style="color: var(--text-main); font-weight: 600; margin-top: 0.25rem;">Target: ${summaryData.timeline || 'Flexible'}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Range: ${summaryData.budget || 'Custom scope'}</p>
          </div>
        </div>
      `;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
          if (currentStep < totalSteps) {
            currentStep++;
            updateStepView();
          }
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepView();
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (demoSuccessModal) {
          demoSuccessModal.classList.add('active');
        } else {
          alert('Demo Brief Received! In live production, this brief would be queued for agency discovery.');
        }
        // Reset to Step 1
        multiStepForm.reset();
        currentStep = 1;
        updateStepView();
      });
    }

    // Option cards selection styling
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const input = card.querySelector('input');
        if (!input) return;

        if (e.target !== input) {
          input.checked = input.type === 'radio' ? true : !input.checked;
        }

        if (input.type === 'radio') {
          const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
          radioGroup.forEach(r => {
            const parentCard = r.closest('.option-card');
            if (parentCard) parentCard.classList.toggle('selected', r.checked);
          });
        } else {
          card.classList.toggle('selected', input.checked);
        }
      });
    });

    // Initial setup
    updateStepView();
  }

  // ==========================================================================
  // 4. Before / After Toggle (website-redesign.html)
  // ==========================================================================
  const redesignToggleBtns = document.querySelectorAll('.redesign-toggle-btn');
  const previewBefore = document.getElementById('previewBefore');
  const previewAfter = document.getElementById('previewAfter');

  if (redesignToggleBtns.length > 0 && previewBefore && previewAfter) {
    redesignToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        redesignToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-mode');
        if (mode === 'before') {
          previewBefore.style.display = 'block';
          previewAfter.style.display = 'none';
        } else {
          previewBefore.style.display = 'none';
          previewAfter.style.display = 'block';
        }
      });
    });
  }

  // ==========================================================================
  // 5. Careers General Application Demo Form (careers.html)
  // ==========================================================================
  const careersForm = document.getElementById('careersForm');
  if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (demoSuccessModal) {
        demoSuccessModal.classList.add('active');
      } else {
        alert('Thank you for submitting your profile. This is an illustrative demonstration form.');
      }
      careersForm.reset();
    });
  }
});
