// Modal state
let pendingMarkerLocation = null;
let currentStep = 1;
let selectedGroup = null;
let selectedGrade = null;
let selectedResource = null;

// Modal functions
function openModal() {
    const modal = document.getElementById('markerModal');
    modal.style.display = 'block';
    currentStep = 1;
    selectedGroup = null;
    selectedGrade = null;
    selectedResource = null;
    initializeModal();
}

function closeModal() {
    const modal = document.getElementById('markerModal');
    modal.style.display = 'none';
    pendingMarkerLocation = null;
}

function initializeModal() {
    showStep(1);
    loadGroupOptions();
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    
    // Show current step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update modal title
    const titles = {
        1: 'Select Resource Type',
        2: `Select Grade - ${selectedGroup || ''}`,
        3: `Select Resource - ${selectedGroup || ''} ${selectedGrade || ''}`
    };
    document.getElementById('modalTitle').textContent = titles[step] || 'Select Resource Type';
    
    // Update buttons
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    
    btnBack.style.display = step > 1 ? 'inline-block' : 'none';
    // Hide Next button since we auto-advance
    btnNext.style.display = 'none';
}

function loadGroupOptions() {
    const container = document.getElementById('groupOptions');
    container.innerHTML = '';
    
    Object.keys(RESOURCES).forEach(group => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = group;
        btn.onclick = () => selectGroup(group);
        container.appendChild(btn);
    });
}

function selectGroup(group) {
    selectedGroup = group;
    selectedGrade = null;
    selectedResource = null;
    
    // Update UI
    document.querySelectorAll('#groupOptions .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === group) {
            btn.classList.add('selected');
        }
    });
    
    // Auto-advance to next step
    setTimeout(() => {
        currentStep = 2;
        loadGradeOptions();
        showStep(2);
    }, 50); // Small delay for visual feedback
}

function nextStep() {
    if (currentStep === 1 && selectedGroup) {
        currentStep = 2;
        loadGradeOptions();
        showStep(2);
    } else if (currentStep === 2 && selectedGrade) {
        currentStep = 3;
        loadResourceOptions();
        showStep(3);
    } else if (currentStep === 3 && selectedResource) {
        createMarkerFromSelection();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        if (currentStep === 1) {
            loadGroupOptions();
        } else if (currentStep === 2) {
            loadGradeOptions();
        }
        showStep(currentStep);
    }
}

function loadGradeOptions() {
    const container = document.getElementById('gradeOptions');
    container.innerHTML = '';
    
    if (selectedGroup && RESOURCES[selectedGroup]) {
        // Sort grades: T1, T2, T3 (or T0 if exists)
        const grades = Object.keys(RESOURCES[selectedGroup]).sort((a, b) => {
            const numA = parseInt(a.replace('T', ''));
            const numB = parseInt(b.replace('T', ''));
            return numA - numB;
        });
        
        grades.forEach(grade => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = grade;
            btn.onclick = () => selectGrade(grade);
            container.appendChild(btn);
        });
    }
}

function selectGrade(grade) {
    selectedGrade = grade;
    selectedResource = null;
    
    // Update UI
    document.querySelectorAll('#gradeOptions .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === grade) {
            btn.classList.add('selected');
        }
    });
    
    // Auto-advance to next step
    setTimeout(() => {
        currentStep = 3;
        loadResourceOptions();
        showStep(3);
    }, 50); // Small delay for visual feedback
}

function loadResourceOptions() {
    const container = document.getElementById('resourceOptions');
    container.innerHTML = '';
    
    if (selectedGroup && selectedGrade && RESOURCES[selectedGroup][selectedGrade]) {
        // Sort resources alphabetically
        const resources = [...RESOURCES[selectedGroup][selectedGrade]].sort();
        
        resources.forEach(resource => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = resource;
            btn.onclick = () => selectResource(resource);
            container.appendChild(btn);
        });
    }
}

function selectResource(resource) {
    selectedResource = resource;
    
    // Update UI
    document.querySelectorAll('#resourceOptions .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === resource) {
            btn.classList.add('selected');
        }
    });
    
    // Auto-create marker after selection
    setTimeout(() => {
        createMarkerFromSelection();
    }, 50); // Small delay for visual feedback
}

function createMarkerFromSelection() {
    if (pendingMarkerLocation && selectedGroup && selectedGrade && selectedResource) {
        const resourceData = {
            group: selectedGroup,
            grade: selectedGrade,
            resource: selectedResource
        };
        
        addMarker(pendingMarkerLocation.lat, pendingMarkerLocation.lng, resourceData);
        closeModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('markerModal');
    if (event.target === modal) {
        closeModal();
    }
}
