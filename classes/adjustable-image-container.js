export function defineAdjustableImageContainer(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      class AdjustableImageContainer {
        constructor(parentElement, imageUrl, options = {}) {
          // Default options
          this.options = {
            width: options.width || 'auto',
            height: options.height || 'auto',
            ...options
          };
      
          // Create container
          this.container = document.createElement('div');
          this.container.classList.add('chrome-ad-preview-replacement-container');
          this.container.style.position = 'relative';
          this.container.style.width = this.options.width;
          this.container.style.height = this.options.height;
          this.container.style.overflow = 'hidden';
          this.container.style.setProperty('margin-left', 'auto', 'important');
          this.container.style.setProperty('margin-right', 'auto', 'important');
          
          // Create image element
          this.image = document.createElement('img');
          this.image.src = imageUrl;
          this.image.classList.add('chrome-ad-preview-replacement');
          this.image.style.position = 'absolute';
          this.image.style.objectFit = 'cover';
          this.image.style.width = '100%';
          this.image.style.height = '100%';
          this.image.style.top = '0';
          this.image.style.left = '0';
          
          // Create controls container
          this.controlsOverlay = document.createElement('div');
          this.controlsOverlay.style.position = 'absolute';
          this.controlsOverlay.style.top = '0';
          this.controlsOverlay.style.left = '0';
          this.controlsOverlay.style.width = '100%';
          this.controlsOverlay.style.height = '100%';
          this.controlsOverlay.style.display = 'none';
          this.controlsOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
          this.controlsOverlay.style.zIndex = '10';
          
          // Reposition button
          this.repositionBtn = document.createElement('button');
          this.repositionBtn.textContent = 'Reposition';
          this.repositionBtn.style.position = 'absolute';
          this.repositionBtn.style.top = '10px';
          this.repositionBtn.style.left = '10px';
          
          // Scale slider
          this.scaleSlider = document.createElement('input');
          this.scaleSlider.type = 'range';
          this.scaleSlider.min = '50';
          this.scaleSlider.max = '200';
          this.scaleSlider.value = '100';
          this.scaleSlider.style.position = 'absolute';
          this.scaleSlider.style.bottom = '10px';
          this.scaleSlider.style.left = '10px';
          this.scaleSlider.style.width = 'calc(100% - 20px)';
          
          // Add elements
          this.controlsOverlay.appendChild(this.repositionBtn);
          this.controlsOverlay.appendChild(this.scaleSlider);
          this.container.appendChild(this.image);
          this.container.appendChild(this.controlsOverlay);
          
          // Add event listeners
          this.setupEventListeners();
          
          // Append to parent
          parentElement.appendChild(this.container);
        }
        
        setupEventListeners() {
          // Hover effects
          this.container.addEventListener('mouseenter', () => {
            this.controlsOverlay.style.display = 'block';
          });
          
          this.container.addEventListener('mouseleave', () => {
            this.controlsOverlay.style.display = 'none';
            this.disableRepositioning();
          });
          
          // Reposition functionality
          let isDragging = false;
          let startX, startY;
          
          this.repositionBtn.addEventListener('click', () => {
            this.repositionBtn.textContent = isDragging ? 'Reposition' : 'Save Position';
            isDragging = !isDragging;
            
            if (isDragging) {
              this.image.style.cursor = 'move';
            } else {
              this.image.style.cursor = 'default';
            }
          });
          
          this.image.addEventListener('mousedown', (e) => {
            if (!isDragging) return;
            
            startX = e.clientX - this.image.offsetLeft;
            startY = e.clientY - this.image.offsetTop;
            
            const moveHandler = (moveEvent) => {
              if (!isDragging) return;
              
              const newX = moveEvent.clientX - startX;
              const newY = moveEvent.clientY - startY;
              
              // Constrain movement within container
              const maxX = this.container.offsetWidth - this.image.offsetWidth;
              const maxY = this.container.offsetHeight - this.image.offsetHeight;
              
              this.image.style.left = `${Math.max(Math.min(newX, 0), maxX)}px`;
              this.image.style.top = `${Math.max(Math.min(newY, 0), maxY)}px`;
            };
            
            const upHandler = () => {
              document.removeEventListener('mousemove', moveHandler);
              document.removeEventListener('mouseup', upHandler);
            };
            
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
          });
          
          // Scale functionality
          this.scaleSlider.addEventListener('input', () => {
            const scale = this.scaleSlider.value / 100;
            this.image.style.transform = `scale(${scale})`;
          });
        }
        
        disableRepositioning() {
          this.repositionBtn.textContent = 'Reposition';
          this.image.style.cursor = 'default';
        }
      }
      
      console.log('AdjustableImageContainer defined');
      window.AdjustableImageContainer = AdjustableImageContainer;
    }
  });
}
