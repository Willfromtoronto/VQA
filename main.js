if (window.location.href.includes('127.0.0.1')) {
    // Create the button element
    var button = document.createElement('button');
    button.id = 'toggleButton';
    button.textContent = 'Toggle Attributes Highlight';

    // Add CSS styles for the button
    var style = document.createElement('style');
    style.innerHTML = `
        #toggleButton {
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }
        .highlighted-url {
            color: red;
            font-size: 16px;
            margin-left: 10px;
        }
        .highlighted-alt {
            color: blue;
            font-size: 12px;
            margin-left: 10px;
        }
        .highlighted-none {
            color: red;
            font-size: 20px;
            font-weight: bold;
            margin-left: 10px;
        }
        .highlighted-validation {
            color: green;
            font-size: 12px;
            margin-left: 10px;
        }
        .highlighted-required {
            color: orange;
            font-size: 12px;
            margin-left: 10px;
        }
        .info-div {
            position: fixed;
            bottom: 50px;
            right: 10px;
            background-color: white;
            padding: 10px;
            border: 1px solid #ccc;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);

    // Append the button to the body
    document.body.appendChild(button);

    var isHighlighted = false;
    var spans = [];

    function highlightAttributes() {
        // Highlight href attributes
        var links = document.querySelectorAll('a');
        links.forEach(function(link) {
            var href = link.getAttribute('href');
            var span = document.createElement('span');
            span.className = 'highlighted-url';
            span.textContent = href;
            link.parentNode.insertBefore(span, link.nextSibling);
            spans.push(span);
        });

        // Highlight alt attributes
        var images = document.querySelectorAll('img');
        images.forEach(function(img) {
            var alt = img.getAttribute('alt');
            var span = document.createElement('span');
            span.className = alt ? 'highlighted-alt' : 'highlighted-none';
            span.textContent = alt ? alt : 'NONE';
            img.parentNode.insertBefore(span, img.nextSibling);
            spans.push(span);
        });

        // Highlight form field validation
        var formFields = document.querySelectorAll('input, select, textarea');
        formFields.forEach(function(field) {
            var validationSpan = document.createElement('span');
            validationSpan.className = field.required ? 'highlighted-required' : 'highlighted-validation';
            var validationText = field.required ? 'Required' : 'Optional';
            if (field.type === 'email') {
                validationText += ' (Email format)';
            } else if (field.type === 'number') {
                validationText += ' (Number)';
            } else if (field.type === 'url') {
                validationText += ' (URL format)';
            } else if (field.type === 'text') {
                validationText += ' (Text)';
            } else {
                validationText += ` (${field.type})`;
            }
            validationSpan.textContent = validationText;
            field.parentNode.insertBefore(validationSpan, field.nextSibling);
            spans.push(validationSpan);
        });

        // Display title, description, and OG image
        var title = document.title;
        var description = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute('content') : 'NONE';
        var ogImage = document.querySelector('meta[property="og:image"]') ? document.querySelector('meta[property="og:image"]').getAttribute('content') : 'NONE';

        var infoDiv = document.createElement('div');
        infoDiv.className = 'info-div';
        infoDiv.innerHTML = `
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>OG Image:</strong> <a href="${ogImage}" target="_blank">${ogImage}</a></p>
        `;
        document.body.appendChild(infoDiv);
        spans.push(infoDiv);
    }

    function removeHighlight() {
        spans.forEach(function(span) {
            span.parentNode.removeChild(span);
        });
        spans = [];
    }

    document.getElementById('toggleButton').addEventListener('click', function() {
        if (isHighlighted) {
            removeHighlight();
            this.textContent = 'Toggle Attributes Highlight';
        } else {
            highlightAttributes();
            this.textContent = 'Remove Attributes Highlight';
        }
        isHighlighted = !isHighlighted;
    });
}
