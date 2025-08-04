// Lazy Rendering Module for Collections and Product pages
// Prevents UI blocking by rendering content progressively

(function() {
    'use strict';

    window.LazyRender = {
        // Render collections with progressive enhancement
        renderCollections: function(collections) {
            const container = document.getElementById('collections-content');
            if (!container) return;

            // Clear container and add loading state
            container.innerHTML = '';
            
            // Create document fragment for better performance
            const fragment = document.createDocumentFragment();
            
            // Render collections in batches
            const batchSize = 4;
            let currentBatch = 0;
            
            function renderBatch() {
                const start = currentBatch * batchSize;
                const end = Math.min(start + batchSize, collections.length);
                
                for (let i = start; i < end; i++) {
                    const collection = collections[i];
                    const collectionEl = createCollectionElement(collection);
                    fragment.appendChild(collectionEl);
                }
                
                // Append batch to DOM
                container.appendChild(fragment.cloneNode(true));
                fragment.innerHTML = '';
                
                currentBatch++;
                
                // Schedule next batch
                if (end < collections.length) {
                    requestAnimationFrame(renderBatch);
                }
            }
            
            // Start rendering
            renderBatch();
        },

        // Create optimized product gallery
        renderOptimizedGallery: function(images) {
            const gallery = document.createElement('div');
            gallery.className = 'optimized-gallery';
            
            images.forEach((image, index) => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'gallery-item-optimized';
                
                if (index < 4) {
                    // Load first 4 images immediately
                    const img = document.createElement('img');
                    img.src = image.src;
                    img.alt = image.alt || '';
                    imgWrapper.appendChild(img);
                } else {
                    // Lazy load rest
                    const img = document.createElement('img');
                    img.dataset.src = image.src;
                    img.alt = image.alt || '';
                    img.className = 'lazy-load';
                    
                    // Placeholder
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="100%25" height="100%25"/%3E%3C/svg%3E';
                    
                    imgWrapper.appendChild(img);
                }
                
                gallery.appendChild(imgWrapper);
            });
            
            // Initialize lazy loading after render
            setTimeout(() => this.initLazyLoading(), 100);
            
            return gallery;
        },

        // Initialize lazy loading for images
        initLazyLoading: function() {
            const lazyImages = document.querySelectorAll('img.lazy-load');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy-load');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px'
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                });
            }
        },

        // Optimize heavy HTML sections
        optimizeHeavySection: function(sectionHtml) {
            // If HTML is too large, wrap in a deferred container
            if (sectionHtml.length > 50000) {
                console.warn('[LazyRender] Section HTML is very large:', sectionHtml.length);
                
                // Create placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'section-placeholder';
                placeholder.innerHTML = '<div class="loading-spinner">Loading section...</div>';
                placeholder.dataset.content = sectionHtml;
                
                // Load on visibility
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const el = entry.target;
                                el.innerHTML = el.dataset.content;
                                delete el.dataset.content;
                                observer.unobserve(el);
                            }
                        });
                    });
                    
                    observer.observe(placeholder);
                }
                
                return placeholder.outerHTML;
            }
            
            return sectionHtml;
        }
    };

    // Helper function to create collection element
    function createCollectionElement(collection) {
        const div = document.createElement('div');
        div.className = 'collection-item';
        
        // Use simpler HTML structure
        div.innerHTML = `
            <a href="/collections/${collection.handle}" class="collection-link">
                ${collection.imageUrl ? 
                    `<img class="lazy-load" data-src="${collection.imageUrl}" alt="${collection.title}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='100%25' height='100%25'/%3E%3C/svg%3E">` :
                    `<div class="collection-placeholder"><i class="material-icons">collections</i></div>`
                }
                <div class="collection-info">
                    <h3>${collection.title}</h3>
                    <p>${collection.productCount || 0} productos</p>
                </div>
            </a>
        `;
        
        return div;
    }

    // Auto-enhance pages on load
    document.addEventListener('DOMContentLoaded', function() {
        // Patch existing render functions
        if (window.loadCollectionsData) {
            const originalLoad = window.loadCollectionsData;
            window.loadCollectionsData = function() {
                console.log('[LazyRender] Intercepting collections load...');
                
                // Call original with modified callback
                const originalFetch = window.fetch;
                window.fetch = function(url) {
                    if (url.includes('/api/builder/collections')) {
                        return originalFetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.collections) {
                                    // Use lazy rendering
                                    window.LazyRender.renderCollections(data.collections);
                                    return { success: true, collections: [] }; // Prevent double render
                                }
                                return data;
                            });
                    }
                    return originalFetch.apply(this, arguments);
                };
                
                return originalLoad.apply(this, arguments);
            };
        }
    });
})();