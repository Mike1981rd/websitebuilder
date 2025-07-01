// Debug script para verificar el estado del footer
console.log('[DEBUG] Estado actual del footer:');
console.log('currentSectionsConfig.footer:', currentSectionsConfig.footer);

if (currentSectionsConfig.footer) {
    console.log('Items:', currentSectionsConfig.footer.items);
    console.log('ItemOrder:', currentSectionsConfig.footer.itemOrder);
    console.log('Número de items:', currentSectionsConfig.footer.itemOrder ? currentSectionsConfig.footer.itemOrder.length : 0);
}

// Verificar si la función renderFooterBlocksInSidebar existe
console.log('renderFooterBlocksInSidebar existe:', typeof renderFooterBlocksInSidebar === 'function');

// Intentar renderizar los bloques manualmente
if (typeof renderFooterBlocksInSidebar === 'function') {
    const html = renderFooterBlocksInSidebar();
    console.log('HTML generado por renderFooterBlocksInSidebar:', html);
}

// Verificar si hay bloques en el DOM
const footerBlocks = document.querySelectorAll('.footer-block-item');
console.log('Bloques de footer en el DOM:', footerBlocks.length);