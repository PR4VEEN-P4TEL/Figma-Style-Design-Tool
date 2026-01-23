// Phase 1 : Core State & Factory Logic  

// 1. Define the Global State

const appState = {
    selectedElementId: null, // Stores the ID of the currently active item
    elements: []             // Array to hold all shapes and text
};

// 2. Define the Factory Function for New Elements

function createNewElement(type) {
    return {
        id: Date.now().toString(),        // Unique ID based on current timestamp
        type: type,                      // Either 'rectangle' or 'text'
        x: 50, y: 50,                    // Default position coordinates
        width: 100, height: 100,         // Default dimensions
        backgroundColor: "#00f0ff",      // Antigravity Neon Cyan color
        text: type === 'text' ? "New Text" : "",
        rotation: 0,                     // Initial rotation angle
        zIndex: appState.elements.length + 1 // Determines stacking order
    };
}

// Phase 2: The Rendering Engine

/*
  Renders the canvas based on the current appState.
  Clears the board and re-creates DOM elements for each item.
 */

function renderCanvas() {
    const canvas = document.getElementById('canvas-container');
    canvas.innerHTML = ''; // 1. Clear the board completely

    // 2. Loop through every element in our data array
    appState.elements.forEach(elementData => {
        // A. Create the DOM node
        const elNode = document.createElement('div');
        elNode.id = elementData.id;

        // B. Apply styles (Mapping Data → CSS)
        elNode.style.position = 'absolute';
        elNode.style.left = elementData.x + 'px';
        elNode.style.top = elementData.y + 'px';
        elNode.style.width = elementData.width + 'px';
        elNode.style.height = elementData.height + 'px';
        elNode.style.backgroundColor = elementData.backgroundColor;
        elNode.style.transform = `rotate(${elementData.rotation}deg)`;
        elNode.style.color = '#ffffff'; // Ensure text is visible
        elNode.style.display = 'flex';
        elNode.style.alignItems = 'center';
        elNode.style.justifyContent = 'center';
        elNode.style.userSelect = 'none'; // Prevent text selection while dragging

        // Render styles based on type
        if (elementData.type === 'circle') {
            elNode.style.borderRadius = '50%';
        }

        // Render text content if it exists
        if (elementData.type === 'text') {
            elNode.innerText = elementData.text;
            elNode.style.backgroundColor = 'transparent'; // Text usually doesn't have a bg
            elNode.style.fontSize = '16px';
            elNode.style.border = '1px dashed transparent'; // Invisible border for sizing
            if (appState.selectedElementId === elementData.id) {
                elNode.style.border = "1px solid #00f0ff";
            }
        }

        // C. Highlight if selected
        if (appState.selectedElementId === elementData.id && elementData.type !== 'text') {
            elNode.style.boxShadow = "0 0 10px #00f0ff"; // Neon glow for selection
            elNode.style.border = "2px solid #fff";

            // Phase 4: Resize Handle
            const handle = document.createElement('div');
            handle.className = 'resize-handle';

            // Prevent dragging when clicking handle
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // Don't trigger drag
                e.preventDefault(); // Prevent text selection

                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = elementData.width;
                startHeight = elementData.height;

                console.log("Resize Started");
            });

            elNode.appendChild(handle);
        }

        // D. Attach event listeners (for selection)
        elNode.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Prevent background canvas selection
            appState.selectedElementId = elementData.id;
            renderCanvas(); // Re-render to reflect selection visually
        });

        // E. Add to DOM
        canvas.appendChild(elNode);
    });

    // Phase 5: Update Panels
    renderPropertiesPanel();
    renderLayersPanel();
}


//   Update Properties Panel
//   Syncs input values with selected element data.

function renderPropertiesPanel() {
    const selectedEl = appState.elements.find(el => el.id === appState.selectedElementId);

    // Get Inputs
    const inputs = {
        x: document.getElementById('prop-x'),
        y: document.getElementById('prop-y'),
        width: document.getElementById('prop-width'),
        height: document.getElementById('prop-height'),
        color: document.getElementById('prop-color'),
        rotation: document.getElementById('prop-rotation'),
        text: document.getElementById('prop-text'),
        textGroup: document.getElementById('text-prop-group')
    };

    if (selectedEl) {
        // 1. Sync input values with data
        inputs.x.value = Math.round(selectedEl.x);
        inputs.y.value = Math.round(selectedEl.y);
        inputs.width.value = Math.round(selectedEl.width);
        inputs.height.value = Math.round(selectedEl.height);
        inputs.color.value = selectedEl.backgroundColor;
        inputs.rotation.value = selectedEl.rotation;

        // Show/Hide Text input
        if (selectedEl.type === 'text') {
            inputs.textGroup.style.display = 'flex';
            inputs.text.value = selectedEl.text;
        } else {
            inputs.textGroup.style.display = 'none';
        }

        // 2. Enable inputs
        Object.values(inputs).forEach(inp => {
            if (inp && inp !== inputs.textGroup) inp.disabled = false;
        });

        // 3. Bind Events (Use helper to avoid closure loops or redefining weirdly)
        // Note: In a real app, we'd remove old listeners. Here we just overwrite 'oninput' property.

        inputs.x.oninput = (e) => updateProperty('x', parseInt(e.target.value));
        inputs.y.oninput = (e) => updateProperty('y', parseInt(e.target.value));
        inputs.width.oninput = (e) => updateProperty('width', parseInt(e.target.value));
        inputs.height.oninput = (e) => updateProperty('height', parseInt(e.target.value));
        inputs.rotation.oninput = (e) => updateProperty('rotation', parseInt(e.target.value));
        inputs.color.oninput = (e) => updateProperty('backgroundColor', e.target.value);
        inputs.text.oninput = (e) => updateProperty('text', e.target.value);

    } else {
        // Disable inputs if nothing is selected
        Object.values(inputs).forEach(inp => {
            if (inp && inp !== inputs.textGroup) {
                inp.value = '';
                inp.disabled = true;
            }
        });
        inputs.textGroup.style.display = 'none';
    }
}

function updateProperty(key, value) {
    const selectedEl = appState.elements.find(el => el.id === appState.selectedElementId);
    if (selectedEl) {
        selectedEl[key] = value;
        saveState(); // Persist changes
        renderCanvas();
    }
}

// Update Layers Panel

function renderLayersPanel() {
    const list = document.getElementById('layers-list');
    list.innerHTML = '';

    // Loop REVERSED so top elements appear at top of list
    // Copy array to not mutate original during reverse
    [...appState.elements].reverse().forEach((el, index) => {
        // Real index in the original array (since we reversed loop)
        const realIndex = appState.elements.length - 1 - index;

        const li = document.createElement('li');
        li.className = 'layer-item';
        if (appState.selectedElementId === el.id) li.classList.add('active');

        const label = document.createElement('span');
        label.innerText = `${el.type} ${realIndex}`;

        const btn = document.createElement('button');
        btn.className = 'layer-btn';
        btn.innerText = '▲';
        btn.title = 'Move Up';
        btn.onclick = (e) => {
            e.stopPropagation();
            moveLayerUp(realIndex);
        };

        li.onclick = () => {
            appState.selectedElementId = el.id;
            renderCanvas();
        };

        li.appendChild(label);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

function moveLayerUp(index) {
    if (index >= appState.elements.length - 1) return; // Already at top

    // Swap with next element
    const temp = appState.elements[index];
    appState.elements[index] = appState.elements[index + 1];
    appState.elements[index + 1] = temp;

    renderCanvas();
}

// Phase 3: Dragging Logic & Feature: Keyboard/Boundaries

let isDragging = false;
let isResizing = false; // Phase 4
let startX, startY;
let initialElementX, initialElementY;
let startWidth, startHeight; // Phase 4

// Boundary Helper
function getConstrainedPosition(x, y, width, height) {
    const canvas = document.getElementById('canvas-container');
    if (!canvas) return { x, y };
    const maxX = canvas.clientWidth - width;
    const maxY = canvas.clientHeight - height;
    return {
        x: Math.max(0, Math.min(x, maxX < 0 ? 0 : maxX)),
        y: Math.max(0, Math.min(y, maxY < 0 ? 0 : maxY))
    };
}

// Boundary Helper
function getConstrainedPosition(x, y, width, height) {
    const canvas = document.getElementById('canvas-container');
    if (!canvas) return { x, y };
    const maxX = canvas.clientWidth - width;
    const maxY = canvas.clientHeight - height;
    return {
        x: Math.max(0, Math.min(x, maxX < 0 ? 0 : maxX)),
        y: Math.max(0, Math.min(y, maxY < 0 ? 0 : maxY))
    };
}

// 1. Start Dragging
document.getElementById('canvas-container').addEventListener('mousedown', (e) => {
    // Phase 4: If clicking the resize handle, do NOT start dragging
    if (e.target.classList.contains('resize-handle')) return;

    // Only drag if we clicked a valid element
    if (!appState.selectedElementId) return;

    const selectedEl = appState.elements.find(el => el.id === appState.selectedElementId);
    if (!selectedEl) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialElementX = selectedEl.x;
    initialElementY = selectedEl.y;
});

// 2. Move (The Physics)
window.addEventListener('mousemove', (e) => {
    // A. Resizing Logic (Phase 4)
    if (isResizing) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        const selectedEl = appState.elements.find(el => el.id === appState.selectedElementId);
        if (!selectedEl) return;

        let newWidth = startWidth + deltaX;
        let newHeight = startHeight + deltaY;

        // Constraint: Minimum 10px
        if (newWidth < 10) newWidth = 10;
        if (newHeight < 10) newHeight = 10;

        selectedEl.width = newWidth;
        selectedEl.height = newHeight;

        renderCanvas();
        return; // Don't drag if resizing
    }

    // B. Dragging Logic
    if (isDragging) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        // Calculate movement delta
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // Update the data
        const selectedEl = appState.elements.find(el => el.id === appState.selectedElementId);
        if (!selectedEl) return; // Safety check

        // Apply new position (initial position + delta)
        let newX = initialElementX + deltaX;
        let newY = initialElementY + deltaY;

        // Feature: Boundary Checks (Strict)
        const constrained = getConstrainedPosition(newX, newY, selectedEl.width, selectedEl.height);
        selectedEl.x = constrained.x;
        selectedEl.y = constrained.y;

        renderCanvas(); // Instantly update the screen
    }
});

// Feature: Keyboard Interaction
window.addEventListener('keydown', (e) => {
    // Only if an element is selected
    if (!appState.selectedElementId) return;

    // Ignore if user is typing in an input field (e.g. Properties panel)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const selectedEl = appState.elements.find(el => el.id === appState.selectedElementId);
    if (!selectedEl) return;

    let newX = selectedEl.x;
    let newY = selectedEl.y;
    let changed = false;

    if (e.key === "ArrowRight") { newX += 5; changed = true; }
    if (e.key === "ArrowLeft") { newX -= 5; changed = true; }
    if (e.key === "ArrowUp") { newY -= 5; changed = true; }
    if (e.key === "ArrowDown") { newY += 5; changed = true; }

    if (changed) {
        e.preventDefault(); // Prevent scrolling

        // Apply Boundaries
        const constrained = getConstrainedPosition(newX, newY, selectedEl.width, selectedEl.height);
        selectedEl.x = constrained.x;
        selectedEl.y = constrained.y;

        renderCanvas();
        saveState(); // Persist changes from keyboard
    }

    // Deletion Interactions
    if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelectedElement();
    }
});

// 3. Stop Dragging / Resizing
window.addEventListener('mouseup', () => {
    if (isDragging || isResizing) {
        if (isDragging || isResizing) {
            // Only save if we actually did something
            saveState();
        }
        isDragging = false;
        isResizing = false;
        console.log("Action Ended. State Saved.");
    }
});


// Initialization & Persistence

function saveState() {
    const jsonString = JSON.stringify(appState.elements);
    localStorage.setItem('canvasDesign', jsonString);
    console.log("State Saved to LocalStorage");
}

function loadState() {
    const savedData = localStorage.getItem('canvasDesign');
    if (savedData) {
        try {
            appState.elements = JSON.parse(savedData);
            console.log("State Loaded from LocalStorage");
        } catch (e) {
            console.error("Failed to load state", e);
        }
    } else {
        // Default init if empty
        const initElement = createNewElement('rectangle');
        appState.elements.push(initElement);
    }
    renderCanvas();
}

function exportState() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.elements, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "design.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function clearCanvas() {
    if (confirm("Are you sure you want to clear the canvas?")) {
        appState.elements = [];
        appState.selectedElementId = null;
        saveState();
        renderCanvas();
        renderPropertiesPanel();
    }
}

function deleteSelectedElement() {
    if (!appState.selectedElementId) return;

    appState.elements = appState.elements.filter(el => el.id !== appState.selectedElementId);
    appState.selectedElementId = null;

    saveState();
    renderCanvas();
    renderPropertiesPanel();
    renderLayersPanel();
}


// Hook up Buttons
document.getElementById('btn-export')?.addEventListener('click', exportState);
document.getElementById('btn-clear')?.addEventListener('click', clearCanvas);
document.getElementById('btn-delete')?.addEventListener('click', deleteSelectedElement);

// Initial Load
loadState();

// Phase 6: Toolbox Logic
function addElement(type) {
    const newEl = createNewElement(type);

    // Optional: Offset slightly so they don't stack perfectly
    const offset = appState.elements.length * 10;
    newEl.x += offset % 100;
    newEl.y += offset % 100;

    appState.elements.push(newEl);
    appState.selectedElementId = newEl.id; // Auto-select

    renderCanvas();
    renderPropertiesPanel(); // Show properties for new item
    renderLayersPanel();     // Update list
    saveState();             // Persist immediately
}

document.getElementById('btn-add-rect')?.addEventListener('click', () => addElement('rectangle'));
document.getElementById('btn-add-circle')?.addEventListener('click', () => addElement('circle'));
document.getElementById('btn-add-text')?.addEventListener('click', () => addElement('text'));
