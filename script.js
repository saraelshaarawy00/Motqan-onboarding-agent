// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const floatingTrigger = document.getElementById('floating-trigger');
    const aiPanel = document.getElementById('ai-panel');
    const closeBtn = document.getElementById('close-panel');
    
    const steps = [
        document.getElementById('step-0'),
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];
    
    const dots = [
        document.getElementById('dot-0'),
        document.getElementById('dot-1'),
        document.getElementById('dot-2'),
        document.getElementById('dot-3')
    ];
    
    const progressBar = document.getElementById('progress-bar');
    const btnPrimary = document.getElementById('btn-primary');
    const btnSecondary = document.getElementById('btn-secondary');
    const loadingState = document.getElementById('loading-state');
    
    // Inputs Step 0
    const serviceCards = document.querySelectorAll('.service-card');

    // Inputs Step 1
    const textInput = document.getElementById('text-input');
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const fileNameDisplay = document.getElementById('file-name-display');
    const removeFileBtn = document.getElementById('remove-file');

    // TM Section
    const tmToggle = document.getElementById('tm-toggle');
    const tmUploadArea = document.getElementById('tm-upload-area');
    const tmUploadBox = document.getElementById('tm-upload-box');
    const tmFileInput = document.getElementById('tm-file-input');
    const tmFilePreview = document.getElementById('tm-file-preview');
    const tmFileName = document.getElementById('tm-file-name');
    const removeTmFileBtn = document.getElementById('remove-tm-file');
    
    // Inputs Step 2
    const languageChips = document.querySelectorAll('.chip');
    const languageSelect = document.getElementById('language-select');
    
    // Inputs Step 3
    const toneCards = document.querySelectorAll('.tone-card');

    // State
    let currentStepIndex = 0;
    let hasService = false;
    let hasContent = false;
    let hasLanguage = false;
    let hasTone = true; // Pre-selected default

    // ==========================================
    // Panel Toggle Logic
    // ==========================================
    floatingTrigger.addEventListener('click', () => {
        aiPanel.classList.remove('hidden');
        floatingTrigger.classList.add('hidden');
    });

    closeBtn.addEventListener('click', () => {
        aiPanel.classList.add('hidden');
        floatingTrigger.classList.remove('hidden');
    });

    // ==========================================
    // Progression Logic
    // ==========================================
    function updateProgress() {
        // Update dots
        dots.forEach((dot, index) => {
            if (index < currentStepIndex) {
                dot.classList.add('completed');
                dot.classList.remove('active');
            } else if (index === currentStepIndex) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });

        // Update width
        const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Update view
        steps.forEach((step, index) => {
            if (index === currentStepIndex) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });

        // Button state logic
        if (currentStepIndex === 0) {
            btnSecondary.classList.add('hidden');
            btnPrimary.textContent = "Continue";
            btnPrimary.disabled = !hasService;
        } else if (currentStepIndex === 1) {
            btnSecondary.classList.remove('hidden');
            btnSecondary.textContent = "Back";
            btnPrimary.textContent = "Continue";
            btnPrimary.disabled = !hasContent;
        } else if (currentStepIndex === 2) {
            btnSecondary.classList.remove('hidden');
            btnSecondary.textContent = "Back";
            btnPrimary.textContent = "Continue";
            btnPrimary.disabled = !hasLanguage;
        } else if (currentStepIndex === 3) {
            btnSecondary.classList.remove('hidden');
            btnSecondary.textContent = "Back";
            btnPrimary.textContent = "Translate Now";
            btnPrimary.disabled = !hasTone;
        }
    }

    btnPrimary.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) {
            simulateAIProcessing(() => {
                currentStepIndex++;
                updateProgress();
            });
        } else {
            // Final submission
            simulateAIProcessing(() => {
                // Done - Hide everything and show completion or reset
                steps.forEach(s => s.classList.add('hidden'));
                loadingState.innerHTML = `
                    <div style="text-align:center; color: var(--success); font-size: 3rem; margin-bottom:10px;">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <h3 style="color:var(--text-main); font-weight:600; text-align:center;">Translation Ready!</h3>
                    <p style="text-align:center; font-size: 0.9rem; margin-bottom: 20px;">Your content has been processed efficiently.</p>
                    
                    <div class="result-actions">
                        <button class="btn-primary" id="go-to-order">
                            <i class="fa-solid fa-cart-shopping"></i> Go to Order
                        </button>
                        <button class="btn-primary btn-download" id="download-btn">
                            <i class="fa-solid fa-download"></i> Download Result
                        </button>
                    </div>
                `;
                btnPrimary.classList.add('hidden');
                btnSecondary.textContent = "Close";
                btnSecondary.onclick = () => {
                    closeBtn.click();
                    setTimeout(() => location.reload(), 300);
                };

                // Add listeners to new result buttons
                document.getElementById('go-to-order').onclick = () => alert('Redirecting to order page...');
                document.getElementById('download-btn').onclick = () => alert('Starting download...');
            });
        }
    });

    btnSecondary.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateProgress();
        }
    });

    function simulateAIProcessing(callback) {
        steps[currentStepIndex].classList.add('hidden');
        loadingState.classList.remove('hidden');
        btnPrimary.disabled = true;
        btnSecondary.disabled = true;

        setTimeout(() => {
            loadingState.classList.add('hidden');
            btnPrimary.disabled = false;
            btnSecondary.disabled = false;
            callback();
        }, 800); // 800ms of fake processing
    }

    // ==========================================
    // Step 0 Logic (Services)
    // ==========================================
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            hasService = true;
            btnPrimary.disabled = false;
        });
    });

    // ==========================================
    // Step 1 Logic (Content)
    // ==========================================
    textInput.addEventListener('input', (e) => {
        hasContent = e.target.value.trim().length > 0;
        btnPrimary.disabled = !hasContent;
        if(hasContent) {
            uploadBox.style.opacity = '0.5';
            uploadBox.style.pointerEvents = 'none';
        } else {
            uploadBox.style.opacity = '1';
            uploadBox.style.pointerEvents = 'auto';
        }
    });

    uploadBox.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileNameDisplay.textContent = file.name;
            filePreview.classList.remove('hidden');
            uploadBox.classList.add('hidden');
            textInput.classList.add('hidden');
            document.querySelector('.divider').classList.add('hidden');
            
            hasContent = true;
            btnPrimary.disabled = false;
        }
    });

    removeFileBtn.addEventListener('click', () => {
        fileInput.value = '';
        filePreview.classList.add('hidden');
        uploadBox.classList.remove('hidden');
        textInput.classList.remove('hidden');
        document.querySelector('.divider').classList.remove('hidden');
        
        hasContent = textInput.value.trim().length > 0;
        btnPrimary.disabled = !hasContent;
    });

    // TM Logic
    tmToggle.addEventListener('change', () => {
        if (tmToggle.checked) {
            tmUploadArea.classList.remove('hidden');
        } else {
            tmUploadArea.classList.add('hidden');
        }
    });

    tmUploadBox.addEventListener('click', () => tmFileInput.click());

    tmFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            tmFileName.textContent = e.target.files[0].name;
            tmFilePreview.classList.remove('hidden');
            tmUploadBox.classList.add('hidden');
        }
    });

    removeTmFileBtn.addEventListener('click', () => {
        tmFileInput.value = '';
        tmFilePreview.classList.add('hidden');
        tmUploadBox.classList.remove('hidden');
    });

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => uploadBox.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => uploadBox.classList.remove('dragover'), false);
    });

    uploadBox.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            fileInput.files = files;
            // trigger change
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });

    // ==========================================
    // Step 2 Logic (Language)
    // ==========================================
    languageChips.forEach(chip => {
        chip.addEventListener('click', () => {
            languageChips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            languageSelect.value = ""; // clear select
            hasLanguage = true;
            btnPrimary.disabled = false;
        });
    });

    languageSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            languageChips.forEach(c => c.classList.remove('selected'));
            hasLanguage = true;
            btnPrimary.disabled = false;
        } else {
            hasLanguage = document.querySelector('.chip.selected') !== null;
            btnPrimary.disabled = !hasLanguage;
        }
    });

    // ==========================================
    // Step 3 Logic (Tone)
    // ==========================================
    toneCards.forEach(card => {
        card.addEventListener('click', () => {
            toneCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            hasTone = true;
            btnPrimary.disabled = false;
        });
    });

    // Set initial custom state for tone (business recommended is pre-selected visually in CSS, let's sync state)
    document.querySelector('.tone-card.recommended').classList.add('selected');
    hasTone = true;

    // Initialize progress
    updateProgress();
});

