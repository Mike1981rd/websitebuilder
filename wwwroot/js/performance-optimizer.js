// Performance Optimizer for Hotel23
// Implements lazy loading and non-blocking rendering

window.PerformanceOptimizer = {
    // Use requestIdleCallback for non-critical tasks
    scheduleIdleTask: function(callback, options = {}) {
        if ('requestIdleCallback' in window) {
            return requestIdleCallback(callback, options);
        } else {
            // Fallback for browsers that don't support requestIdleCallback
            return setTimeout(callback, 1);
        }
    },

    // Break large rendering tasks into chunks
    renderInChunks: function(items, renderFunction, chunkSize = 10) {
        return new Promise((resolve) => {
            let index = 0;
            
            function processChunk() {
                const chunk = items.slice(index, index + chunkSize);
                chunk.forEach(item => renderFunction(item));
                index += chunkSize;
                
                if (index < items.length) {
                    // Schedule next chunk
                    requestAnimationFrame(processChunk);
                } else {
                    resolve();
                }
            }
            
            processChunk();
        });
    },

    // Lazy load images with Intersection Observer
    lazyLoadImages: function() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before visible
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    },

    // Virtual scrolling for large lists
    virtualScroll: function(container, items, itemHeight, renderItem) {
        const visibleHeight = container.clientHeight;
        const totalHeight = items.length * itemHeight;
        const visibleItems = Math.ceil(visibleHeight / itemHeight) + 1;
        
        // Create scrollable container
        const scrollContainer = document.createElement('div');
        scrollContainer.style.height = totalHeight + 'px';
        scrollContainer.style.position = 'relative';
        
        const itemsContainer = document.createElement('div');
        itemsContainer.style.position = 'absolute';
        itemsContainer.style.top = '0';
        itemsContainer.style.left = '0';
        itemsContainer.style.right = '0';
        
        scrollContainer.appendChild(itemsContainer);
        container.appendChild(scrollContainer);
        
        let lastScrollTop = 0;
        
        function updateVisibleItems() {
            const scrollTop = container.scrollTop;
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleItems, items.length);
            
            // Clear existing items
            itemsContainer.innerHTML = '';
            itemsContainer.style.transform = `translateY(${startIndex * itemHeight}px)`;
            
            // Render only visible items
            for (let i = startIndex; i < endIndex; i++) {
                const itemElement = renderItem(items[i], i);
                itemsContainer.appendChild(itemElement);
            }
            
            lastScrollTop = scrollTop;
        }
        
        // Initial render
        updateVisibleItems();
        
        // Throttle scroll updates
        let scrollTimeout;
        container.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = requestAnimationFrame(() => {
                    updateVisibleItems();
                    scrollTimeout = null;
                });
            }
        });
        
        return {
            update: updateVisibleItems,
            destroy: () => {
                container.innerHTML = '';
            }
        };
    },

    // Debounce function for expensive operations
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Progressive enhancement for collections page
    optimizeCollectionsPage: function() {
        console.log('[OPTIMIZER] Optimizing collections page...');
        
        // Defer non-critical scripts
        const deferredScripts = document.querySelectorAll('script[data-defer]');
        deferredScripts.forEach(script => {
            this.scheduleIdleTask(() => {
                const newScript = document.createElement('script');
                newScript.src = script.dataset.src;
                document.body.appendChild(newScript);
            });
        });
        
        // Lazy load images
        this.lazyLoadImages();
        
        // If there are many collection items, render them progressively
        const collectionsContainer = document.getElementById('collections-content');
        if (collectionsContainer) {
            const items = collectionsContainer.querySelectorAll('.collection-item');
            if (items.length > 20) {
                // Hide all items initially
                items.forEach(item => item.style.display = 'none');
                
                // Show items progressively
                this.renderInChunks(Array.from(items), (item) => {
                    item.style.display = '';
                }, 5);
            }
        }
    },

    // Optimize product page
    optimizeProductPage: function() {
        console.log('[OPTIMIZER] Optimizing product page...');
        
        // Lazy load gallery images
        this.lazyLoadImages();
        
        // Defer loading of non-critical sections
        const deferredSections = document.querySelectorAll('[data-defer-section]');
        
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        // Load section content
                        if (section.dataset.loadFunction && window[section.dataset.loadFunction]) {
                            window[section.dataset.loadFunction](section);
                        }
                        observer.unobserve(section);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.01
            });
            
            deferredSections.forEach(section => sectionObserver.observe(section));
        }
    }
};

// Auto-initialize based on page type
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('/collections')) {
        window.PerformanceOptimizer.optimizeCollectionsPage();
    } else if (path.includes('/products/')) {
        window.PerformanceOptimizer.optimizeProductPage();
    }
});