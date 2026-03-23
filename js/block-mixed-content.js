/**
 * Block Mixed Content Script
 * Prevents loading of the problematic script from jsinit.directfwd.com
 */

(function () {
    'use strict';

    // Block the specific problematic script
    const blockedScripts = [
        'http://cdn.jsinit.directfwd.com/sk-jspark_init.php',
        'https://cdn.jsinit.directfwd.com/sk-jspark_init.php',
        '//cdn.jsinit.directfwd.com/sk-jspark_init.php'
    ];

    // Override document.createElement to block script injection
    const originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
        const element = originalCreateElement.call(document, tagName);

        if (tagName.toLowerCase() === 'script') {
            // Override src setter to block problematic URLs
            const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
            Object.defineProperty(element, 'src', {
                set: function (value) {
                    if (blockedScripts.some(blocked => value.includes(blocked))) {
                        console.warn('Blocked potentially malicious script:', value);
                        return;
                    }
                    originalSrcSetter.call(this, value);
                },
                get: function () {
                    return this.getAttribute('src');
                }
            });
        }

        return element;
    };

    // Block dynamic script loading
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function (child) {
        if (child.tagName && child.tagName.toLowerCase() === 'script') {
            const src = child.src || child.getAttribute('src');
            if (src && blockedScripts.some(blocked => src.includes(blocked))) {
                console.warn('Blocked script injection:', src);
                return child; // Return the element without appending
            }
        }
        return originalAppendChild.call(this, child);
    };

    // Block insertBefore
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
        if (newNode.tagName && newNode.tagName.toLowerCase() === 'script') {
            const src = newNode.src || newNode.getAttribute('src');
            if (src && blockedScripts.some(blocked => src.includes(blocked))) {
                console.warn('Blocked script insertion:', src);
                return newNode; // Return the element without inserting
            }
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
    };

    // Block innerHTML modifications
    const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
    Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function (value) {
            if (typeof value === 'string' && blockedScripts.some(blocked => value.includes(blocked))) {
                console.warn('Blocked innerHTML modification with blocked script');
                value = value.replace(/<script[^>]*src=["']?[^"']*jsinit\.directfwd\.com[^"']*["']?[^>]*><\/script>/gi, '');
            }
            originalInnerHTMLSetter.call(this, value);
        },
        get: function () {
            return originalInnerHTMLSetter.get.call(this);
        }
    });

    // Block outerHTML modifications
    const originalOuterHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML').set;
    Object.defineProperty(Element.prototype, 'outerHTML', {
        set: function (value) {
            if (typeof value === 'string' && blockedScripts.some(blocked => value.includes(blocked))) {
                console.warn('Blocked outerHTML modification with blocked script');
                value = value.replace(/<script[^>]*src=["']?[^"']*jsinit\.directfwd\.com[^"']*["']?[^>]*><\/script>/gi, '');
            }
            originalOuterHTMLSetter.call(this, value);
        },
        get: function () {
            return originalOuterHTMLSetter.get.call(this);
        }
    });

    // Block document.write
    const originalDocumentWrite = document.write;
    document.write = function (...args) {
        const content = args.join('');
        if (blockedScripts.some(blocked => content.includes(blocked))) {
            console.warn('Blocked document.write with blocked script');
            const cleanedContent = content.replace(/<script[^>]*src=["']?[^"']*jsinit\.directfwd\.com[^"']*["']?[^>]*><\/script>/gi, '');
            return originalDocumentWrite.call(document, cleanedContent);
        }
        return originalDocumentWrite.apply(document, args);
    };

    // Block document.writeln
    const originalDocumentWriteln = document.writeln;
    document.writeln = function (...args) {
        const content = args.join('');
        if (blockedScripts.some(blocked => content.includes(blocked))) {
            console.warn('Blocked document.writeln with blocked script');
            const cleanedContent = content.replace(/<script[^>]*src=["']?[^"']*jsinit\.directfwd\.com[^"']*["']?[^>]*><\/script>/gi, '');
            return originalDocumentWriteln.call(document, cleanedContent);
        }
        return originalDocumentWriteln.apply(document, args);
    };

    console.log('Mixed content blocker loaded - protecting against jsinit.directfwd.com scripts');
})();
