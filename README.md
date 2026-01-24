# Figma Style Design Tool

A modern, browser-based design tool inspired by Figma, built with vanilla JavaScript, HTML, and CSS. Create and manipulate design elements on a canvas with an intuitive interface featuring layers, properties panels, and export capabilities.

## Features

### 🎨 Design Elements
- **Rectangle Tool**: Create rectangular shapes with customizable dimensions and colors
- **Circle Tool**: Create circular shapes with full customization
- **Text Tool**: Add and edit text elements with custom styling

### 🖱️ Interaction & Manipulation
- **Drag & Drop**: Click and drag elements to reposition them on the canvas
- **Resize Handles**: Resize selected elements using the corner handle
- **Keyboard Navigation**: Use arrow keys to move selected elements with precision (5px increments)
- **Boundary Constraints**: Elements are automatically constrained within the canvas boundaries

### 🎛️ Properties Panel
- **Position Controls**: Adjust X and Y coordinates
- **Size Controls**: Modify width and height
- **Color Picker**: Change background color of shapes
- **Rotation**: Rotate elements by degrees
- **Text Editing**: Edit text content for text elements

### 📋 Layers Panel
- **Layer List**: View all elements in reverse order (top elements first)
- **Layer Selection**: Click layers to select and edit elements
- **Layer Reordering**: Move layers up in the stacking order
- **Layer Deletion**: Delete individual layers

### 💾 Persistence & Export
- **Auto-Save**: All changes are automatically saved to browser localStorage
- **Export JSON**: Download your design as a JSON file for backup or sharing
- **Export HTML**: Generate a standalone HTML file with your design
- **Clear Canvas**: Reset the canvas with confirmation

### 🎯 User Experience
- **Visual Selection**: Selected elements are highlighted with a neon cyan glow
- **Dark Theme**: Modern dark UI with premium aesthetics
- **Responsive Layout**: Three-panel layout (Toolbox/Layers, Canvas, Properties)
- **Grid Background**: Visual grid pattern for better alignment

### Usage

#### Creating Elements
1. Click on a tool button in the **Toolbox** panel (Rectangle, Circle, or Text)
2. A new element will appear on the canvas at a default position
3. The element is automatically selected for editing

#### Selecting Elements
- **Click** on an element in the canvas
- **Click** on a layer in the Layers panel

#### Moving Elements
- **Mouse**: Click and drag the selected element
- **Keyboard**: Use arrow keys (↑ ↓ ← →) to move in 5px increments

#### Resizing Elements
1. Select an element
2. Click and drag the **resize handle** (white square) in the bottom-right corner
3. Minimum size is 10px × 10px

#### Editing Properties
1. Select an element
2. Use the **Properties Panel** on the right to adjust:
   - Position (X, Y)
   - Dimensions (Width, Height)
   - Background Color
   - Rotation (degrees)
   - Text content (for text elements)

#### Managing Layers
- **Select Layer**: Click on a layer name in the Layers panel
- **Move Up**: Click the ▲ button to bring a layer forward
- **Delete Layer**: Click the 🗑️ button to remove a layer

#### Exporting Your Design
- **Export JSON**: Click "Export JSON" to download your design data
- **Export HTML**: Click "Export HTML" to generate a standalone HTML file
- **Delete**: Click "Delete" to remove the selected element
- **Clear Canvas**: Click "Clear Canvas" to remove all elements (with confirmation)

#### Keyboard Shortcuts
- **Arrow Keys**: Move selected element (5px increments)
- **Delete/Backspace**: Delete selected element

## Project Structure

```
Figma Style Design Tool/
├── index.html          # Main HTML structure
├── style.css           # Styling and theme
├── app.js              # Core application logic
└── README.md           # This file
```

## Technical Details

### Architecture
- **State Management**: Centralized `appState` object manages all application data
- **Rendering Engine**: `renderCanvas()` function updates the DOM based on state
- **Event-Driven**: Mouse and keyboard events drive user interactions
- **LocalStorage**: Automatic persistence of design state

### Key Functions
- `createNewElement(type)`: Factory function for creating new design elements
- `renderCanvas()`: Main rendering function that updates the visual canvas
- `renderPropertiesPanel()`: Syncs property inputs with selected element
- `renderLayersPanel()`: Updates the layers list
- `saveState()` / `loadState()`: Persistence functions using localStorage
- `exportState()` / `exportToHTML()`: Export functionality

### Data Structure
Each element in the design has the following structure:
```javascript
{
    id: "unique-timestamp-id",
    type: "rectangle" | "circle" | "text",
    x: 50,              // X position
    y: 50,              // Y position
    width: 100,         // Width in pixels
    height: 100,        // Height in pixels
    backgroundColor: "#00f0ff",  // Hex color
    text: "New Text",   // Text content (for text elements)
    rotation: 0,        // Rotation in degrees
    zIndex: 1          // Stacking order
}
```

## Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Edge, Safari)
- Uses vanilla JavaScript (ES6+)
- No external dependencies
- Responsive design

## Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --accent-primary: #00f0ff;  /* Change accent color */
    --bg-dark: #1e1e1e;         /* Change background */
    /* ... */
}
```

### Adding New Element Types
1. Add a button in the Toolbox section of `index.html`
2. Update `createNewElement()` in `app.js` to handle the new type
3. Add rendering logic in `renderCanvas()` for the new type

## Future Enhancements

Potential features for future versions:
- [ ] Undo/Redo functionality
- [ ] Copy/Paste elements
- [ ] Grouping elements
- [ ] Image import
- [ ] More shape types (polygons, lines, etc.)
- [ ] Text styling options (font size, family, weight)
- [ ] Alignment tools
- [ ] Zoom and pan controls
- [ ] Multiple selection
- [ ] Export to PNG/SVG

## License

This project is open source and available for personal and commercial use.Developed for the Sheryians Coding School Inter Batch Showdown. Use for educational purposes is encouraged.

## Acknowledgments

- Inspired by Figma's design tool interface
- Uses Inter font from Google Fonts
- Built with vanilla JavaScript for simplicity and performance

---

**Enjoy designing!** 🎨
