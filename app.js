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
            // TODO: Append resize handles here (Phase 4)
        }

        // D. Attach event listeners (for selection)
        elNode.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Prevent background canvas selection
            appState.selectedElementId = elementData.id;
            renderCanvas(); // Re-render to reflect selection visually
            renderPropertiesPanel(); // Refresh sidebar (Phase 5)
        });

        // E. Add to DOM
        canvas.appendChild(elNode);
    });
}

// Stub for Phase 5 to prevent errors
function renderPropertiesPanel() {
    console.log("Properties Panel Updated (Phase 5 Feature)");
}

// Initialization
// Add some dummy data to verify Phase 2 immediately
const initElement = createNewElement('rectangle');
appState.elements.push(initElement);

// Render initial state
renderCanvas();
